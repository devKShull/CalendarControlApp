import { View, Text, Button, StyleSheet, Keyboard, Platform, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import React, { useState, useRef, useEffect, useReducer } from 'react';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/ko';
import * as calendarClass from './calendarClass';
import Toast from 'react-native-easy-toast';
import CheckBox from '@react-native-community/checkbox';
import RadioForm from 'react-native-simple-radio-button';
import WeekPicker, { week } from './weekPicker';
import { Icon } from 'native-base';

export const weekContext = React.createContext();
const eventSaveMain = ({ navigation, route }) => {
    const [date, setDate] = useState(new Date()); //현재 시각
    const eventReducer = (state, action) => {
        //eventData 지정을 위한 리듀서
        switch (action.type) {
            case 'calendarId': //일정을 저장할 캘린더 ID
                return { ...state, calendarId: action.data };
            case 'startDate': //일정 시작시간
                return { ...state, startDate: action.data };
            case 'endDate': //일정 종료시간
                return { ...state, endDate: action.data };
            case 'allDay': //일정이 하루종일인가?
                return { ...state, allDay: action.data };
            case 'description': //일정 설명
                return { ...state, description: action.data };
            case 'recurrence': //일정 반복 == recurrenceRule 의 frequency와 같음
                return { ...state, recurrence: action.data };
            case 'alarms': //일정 알림
                return { ...state, alarms: action.data };
            case 'all': //일정 전체 데이터 설정
                return action.data;
            case 'date': //일정 시작,종료시간 동시설정
                return { ...state, startDate: action.data, endDate: action.data };
            //아래는 recurrenceRule
            case 'duration': //안드로이드의 endDate를 대신함 일정지속시간
                return { ...state, recurrenceRule: { ...state.recurrenceRule, duration: action.data } };
            case 'frequency': //반복 종류 weekly daily monthly등
                return { ...state, recurrenceRule: { ...state.recurrenceRule, frequency: action.data } };
            case 'interval': //반복 간격
                return { ...state, recurrenceRule: { ...state.recurrenceRule, interval: action.data } };
            case 'occurrence': //반복 횟수
                return { ...state, recurrenceRule: { ...state.recurrenceRule, occurrence: action.data } };
            case 'recurrenceEndDate': //반복 종료 날짜
                return { ...state, recurrenceRule: { ...state.recurrenceRule, endDate: action.data } };
            case 'daysOfWeek':
                return { ...state, recurrenceRule: { ...state.recurrenceRule, daysOfWeek: action.data } };
            //frequency 가 weekly 일때 월간반복중 요일 선택 ["MO","TU"] => 매주 월요일 화요일
            //frequency 가 monthly 일때 weekPositionInMonth와 함께 사용가능 ["3TU"] => 매달 3번째 화요일
            case 'weekPositionInMonth': //frequency가 monthly 일경우 월간 반복 중 몇번째 주?
                return { ...state, recurrenceRule: { ...state.recurrenceRule, weekPositionInMonth: action.data } };
            case 'monthPositionInMonth': //frequency가 yearly 일경우 년간 반복 중 몇번째 달?
                return { ...state, recurrenceRule: { ...state.recurrenceRule, monthPositionInMonth: action.data } };
            default:
                break;
        }
    };
    const [eventData, dispatch] = useReducer(eventReducer, {
        startDate: moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        endDate: moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        allDay: false,
        description: null,
        alarms: [], //  분단위로 자동 조절 ex 10 => startDate로 부터 10분전
        recurrenceRule: {
            frequency: 'none',
            duration: 'PT0H',
        },
    });
    let calId = { id: null, title: null }; //캘린더 선택후 받아온 데이터 저장용
    let alarmData = []; //알람데이터 저장용
    const [mode, setMode] = useState('date'); //dateTimePicker 의 모드 선택용
    const [show, setShow] = useState(false); // show 가 true 일때만 dateTimePicker 표시
    const [isStart, setIsStart] = useState(false); //true = 시작시간 or false = 종료시간
    const [eventTitle, setTitle] = useState(); // 이벤트의 title은 eventData와 별개로 지정되기 때문에 따로 state 로 지정
    const [initDate, setInitDate] = useState(false); // datetimePicker 초기화 false 인경우 시작, 종료시간 동시에 설정
    const [alarmShow, setAlarmShow] = useState(); // 선택한 알림을 표기하기위한 component state
    const [calNameShow, setCalNameShow] = useState(); // 선택한 캘린더의 title 을 표시하기우한 component state
    const [saveState, setSaveState] = useState(false); //저장중 저장버튼 중복클릭 예방용
    const [isException, setIsException] = useState(false); //반복일정 수정시 전체삭제와 예외삭제 구분용
    const [isModalVisible, setModalVisible] = useState(false); //반복일정 수정시 예외삭제 모달 표시용
    const [recurModalVisible, setRecurModal] = useState(false); //반복 설정 모달 표시용
    const [weeks, setWeeks] = useState([]); //weekpicker 로 부터 week가져오기위함

    const init = async () => {
        //데이터 초기화 이미있는일정 선택시
        if (route.params != null) {
            // route.params 가 null일 경우 .id 혹은 다른 데이터들이 undefined로 나타나기 때문에 먼저 params 검증부터함
            if (route.params.id != null) {
                //캘린더 설정후 받은 params
                calId = {
                    id: route.params.id,
                    title: route.params.title,
                };
            }
            if (route.params.alarmsParams != null) {
                //알림설정후 받은 params 로 알림데이터 설정
                alarmData = route.params.alarmsParams;
                alarmSet(alarmData);
            }
            //일정 수정을 위한 params 수신 및 적용
            if (route.params.eventId != null) {
                const res = await calendarClass.eventFindId(route.params.eventId);
                console.log(res);
                setTitle(res.title); //일정 제목
                calId = {
                    id: res.calendar.id,
                    title: res.calendar.title,
                };
                delete res.calendar; // 이벤트 저장시 캘린더에 대한 내용은 calendarId만 있으면됨
                delete res.recurrence; // recurrence 설정은 recurrenceRule 로 대체한다 10/01
                dispatch({ type: 'all', data: res });
                //recurrenceRule 데이터에서 endDate 추출 09/23
                if (res.recurrenceRule != null) {
                    //recurrenceRule 존재여부 먼저 확인 안할시 duration undefined 오류
                    if (res.recurrenceRule.duration != null) {
                        const duration = res.recurrenceRule.duration;
                        console.log('recurrenceRule 확인됨');
                        console.log(duration);
                        if (!(res.recurrenceRule.frequency == null || res.recurrenceRule.frequency == 'none')) {
                            setIsException(true);
                        } //exception 날짜를 지정하기위함
                        if (duration == 'P1D') {
                            //duration으로 endDate생성
                            dispatch({ type: 'endDate', data: moment(res.startDate).add(1, 'd') });
                        } else if (duration.indexOf('S') != -1) {
                            const second = duration.substring(duration.indexOf('P') + 1, duration.indexOf('S'));
                            console.log(second);
                            dispatch({ type: 'endDate', data: moment(res.startDate).add(second, 's').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' });
                        } else if (duration.indexOf('H') != -1) {
                            const hour = duration.substring(duration.indexOf('T') + 1, duration.indexOf('H'));
                            console.log(hour);
                            dispatch({ type: 'endDate', data: moment(res.startDate).add(hour, 'h').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' });
                        }
                    }
                }
                // 알람 데이터는 수신시 날짜형식으로 수신함 minute 단위로 parsing
                const dateDif = res.alarms.map((i) => {
                    return moment(i.date).diff(res.startDate, 'minute');
                });
                alarmData = dateDif.map((i) => {
                    return { ['date']: i };
                });
                alarmSet(alarmData);
                setInitDate(true); // 일정수정시엔 시작 종료시간 각각 설정할수 있도록 initDate true 로 설정
            }
        }
        if (calId.id != null) {
            if (calId.title != null) {
                //캘린더 id 설정 name 표시
                dispatch({ type: 'calendarId', data: calId.id });
                setCalNameShow(<Text style={{ textAlign: 'right', marginVertical: 15, flex: 1 }}>{calId.title} 선택됨</Text>);
                showToast(calId.title + '캘린더가 선택되었습니다.');
            }
        }
    };

    useEffect(async () => {
        init();
    }, [route.params]);

    const alarmSet = (alarmDataParam) => {
        //알림 데이터및 렌더 설정
        dispatch({ type: 'alarms', data: alarmDataParam });
        setAlarmShow(
            //설정된 알림 표시하는 렌더
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={{ textAlign: 'right', flex: 1 }}>
                    {alarmDataParam.map((i) => {
                        switch (i.date) {
                            case 0:
                                return '일정 시작시간 ';
                            case 10:
                                return '10분 전 ';
                            case 60:
                                return '1시간 전 ';
                            case 1440:
                                return '1일 전 ';
                            default:
                                //customTime 알람데이터는 분단위로 저장되어 들어옴
                                const hour = Math.floor(i.date / 60);
                                const min = i.date % 60;
                                let res = '';
                                if (hour != 0) {
                                    res = hour + '시간 ';
                                }
                                if (min != 0) {
                                    res += min + '분 전 ';
                                } else {
                                    res += '전 ';
                                }
                                return res;
                        }
                    })}
                </Text>
            </View>
        );
    };
    const onChange = (event, selectedDate) => {
        //날짜선택시
        if (selectedDate != null) {
            const currentDate = selectedDate || date;
            //선택된 날짜가 없을시 date(현재시간) 가 들어감
            setShow(Platform.OS === 'ios');
            setDate(currentDate);
            console.log('CurrentDate ' + currentDate);
            const forDate = moment(currentDate).format('YYYY-MM-DDTHH:mm:ss.SSS');
            if (mode === 'date' && !eventData.allDay) {
                showMode('time');
                //날짜 선택 완료시 시간선택모드로
            } else {
                let diffTime;
                eventData.allDay && setShow(false);
                if (!initDate) {
                    //datetimePicker 초기일시 시작,종료시간 둘다 설정
                    dispatch({ type: 'date', data: forDate });
                    setInitDate(true);
                } else {
                    if (isStart) {
                        //시작시간 설정
                        dispatch({ type: 'startDate', data: forDate });
                        const end = moment(eventData.endDate);
                        diffTime = moment.duration(end.diff(moment(currentDate))).asSeconds(); // 시간차 사전 계산
                    } else {
                        //종료시간 설정
                        dispatch({ type: 'endDate', data: forDate });
                        const start = moment(eventData.startDate);
                        diffTime = moment.duration(moment(currentDate).diff(start)).asSeconds(); // 시간차 사전 계산
                    }
                    // save용 recurrenceRule data
                    if (eventData.recurrenceRule != null) {
                        if (diffTime == 0) {
                            dispatch({ type: 'duration', data: 'P1D' });
                        } else {
                            dispatch({ type: 'duration', data: 'P' + Math.floor(diffTime) + 'S' });
                        }
                    }
                }
            }
        } else {
            //선택된 데이터가 없을시 dateTimePicker 종료
            setShow(false);
        }
    };

    const showMode = (currentMode) => {
        setMode(currentMode);
        setShow(true);
    };

    const showDatepicker = (isStart) => {
        setIsStart(isStart);
        showMode('date');
    };

    const onSaveEventHandle = async () => {
        //일정 디바이스에 저장 기능
        Keyboard.dismiss(); //키보드 사라지게함
        if (!saveState) {
            //중복방지
            const dateWarning = moment(eventData.startDate).isBefore(eventData.endDate); //시작시간이 종료시간보다 뒤일경우
            if (eventTitle == null) {
                //제목입력 필요
                showToast('제목을 입력하세요!');
            } else if (eventData.calendarId == null) {
                //캘린더 선택 필요
                showToast('캘린더를 선택하세요');
            } else if (eventData.startDate != eventData.endDate && !dateWarning) {
                showToast('시작날짜가 종료날짜보다 뒤일 수 없습니다.');
            } else {
                if (eventData.recurrenceRule != null) {
                    //recurrenceRule 검증 endDate 삭제 09/23
                    if (Platform.OS === 'android') {
                        //안드로이드에서 recurrenceRule이 존재할때 endDate사이에 충돌이 발생함
                        if (eventData.recurrenceRule.frequency == 'none') {
                            delete eventData.recurrenceRule; //recurrenceRule의 frequency가 none 인경우 => 반복아님 recurrenceRule 삭제
                        } else {
                            delete eventData.endDate; //recurrenceRule 의 frequency 가 none이 아닌경우 => 반복인경우 endDate 삭제
                        }
                    }
                }
                if (isException) {
                    //반복일정이며 일정수정 상태일때 예외날짜 선택 모달 표시
                    setModalVisible(true);
                } else {
                    setSaveState(true);
                    console.log('//////////////////////////////////');
                    console.log(eventData);
                    const id = await calendarClass.eventSaveFunc(eventTitle, eventData); //이벤트 저장
                    await calendarClass.eventSend(eventTitle, eventData, id); //이벤트 데이터 전송용 파싱 및 전송
                    showToast(eventTitle + '일정이 저장되었습니다. id:' + id); //Toast알림 표시
                    setTimeout(() => {
                        navigation.navigate('Agenda Calendar');
                        setSaveState(false);
                    }, 1500);
                }
            }
        }
    };
    const saveInModal = async (isExcept) => {
        if (isExcept) {
            //예외 일정 수정 해당 기능 현재 작동하지않음
            const id = await calendarClass.eventSaveFunc(eventTitle, eventData, eventData.startDate);
            setModalVisible(false);
            showToast(eventTitle + '일정이 저장되었습니다. id:' + id);
            setTimeout(() => {
                navigation.navigate('Agenda Calendar');
                setSaveState(false);
            }, 1500);
        } else {
            //전체 일정 수정
            const id = await calendarClass.eventSaveFunc(eventTitle, eventData);
            setModalVisible(false);
            showToast(eventTitle + '일정이 저장되었습니다. id:' + id);
            setTimeout(() => {
                navigation.navigate('Agenda Calendar');
                setSaveState(false);
            }, 1500);
        }
    };
    const toastRef = useRef();
    const showToast = (txt) => {
        toastRef.current.show(txt, 2000);
    };
    const RecView = () => {
        //recurrenceRule 데이터 렌더
        let txt;
        if (eventData.recurrenceRule != null) {
            txt = eventData.recurrenceRule.frequency; //frequency 추가
            if (eventData.recurrenceRule.interval != null) {
                txt += ', interval: ' + eventData.recurrenceRule.interval; //interval 추가
            }
            if (eventData.recurrenceRule.occurrence != null) {
                txt += ', occurence: ' + eventData.recurrenceRule.occurrence; //occurrence 추가
            }
        }
        return <Text>{txt}</Text>;
    };
    const initModal = () => {
        //recurrenceRule 데이터 초기화
        dispatch({ type: 'frequency', data: 'none' });
        dispatch({ type: 'duration', data: 'PT0H' });
        if (eventData.recurrenceRule.interval != null) {
            delete eventData.recurrenceRule.interval;
        }
        if (eventData.recurrenceRule.occurrence != null) {
            delete eventData.recurrenceRule.occurrence;
        }
    };
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={{ margin: 15, backgroundColor: '#f7f7f7', padding: 25 }}>
                <TextInput
                    placeholder={'제목'}
                    value={eventTitle}
                    style={{ fontSize: 30, color: '#000000', backgroundColor: '#f7f7f7', marginVertical: 10 }}
                    onChangeText={(txt) => setTitle(txt)}
                />
                <View>
                    <TouchableOpacity onPress={() => showDatepicker(true)}>
                        <View style={styles.rowStyleDate}>
                            <Text style={{ fontSize: 15, textAlign: 'left' }}>시작 </Text>
                            {eventData.allDay ? (
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(eventData.startDate).format('MM월 DD일')}</Text>
                            ) : (
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(eventData.startDate).format('MM월 DD일  HH시 mm분')}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showDatepicker(false)}>
                        <View style={styles.rowStyleDate}>
                            <Text style={{ fontSize: 15 }}>종료 </Text>
                            {eventData.allDay ? (
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(eventData.endDate).format('MM월 DD일')}</Text>
                            ) : (
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(eventData.endDate).format('MM월 DD일  HH시 mm분')}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={onChange}
                        />
                    )}
                    <View style={{ flexDirection: 'row' }}>
                        <CheckBox
                            value={eventData.allDay}
                            disabled={false}
                            onValueChange={(val) => {
                                dispatch({ type: 'allDay', data: val });
                            }}
                        />
                        <Text style={{ marginLeft: 15, alignSelf: 'center' }}>하루종일</Text>
                    </View>
                </View>

                <TextInput
                    value={eventData.description}
                    placeholder={'메모'}
                    style={{ color: '#000000', fontSize: 20, backgroundColor: '#f7f7f7' }}
                    onChangeText={(txt) => (eventData.description = txt)}
                />
                <TouchableOpacity onPress={() => navigation.navigate('Select Calendar')} style={{ height: 50 }}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        <Icon name="calendar" type="Feather" style={styles.touchText} />
                        <Text style={styles.touchText}> 캘린더 위치</Text>
                        {calNameShow}
                    </View>
                </TouchableOpacity>
                <View style={{ height: 50 }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('알림', eventData.alarms);
                        }}
                        style={{ height: 50 }}>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            <Icon name="alarm-outline" type="Ionicons" style={styles.touchText} />
                            <Text style={styles.touchText}> 알림</Text>
                            {alarmShow}
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setRecurModal(true);
                    }}
                    style={{ height: 50 }}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        <Icon name="return-down-back" type="Ionicons" style={styles.touchText} />
                        <Text style={{ flex: 1 }}> 반복</Text>
                        <RecView />
                    </View>
                </TouchableOpacity>
                <View>
                    <Button
                        onPress={() => {
                            onSaveEventHandle();
                        }}
                        title={'저장'}></Button>
                </View>
                <Toast ref={toastRef} positionValue={200} fadeInDuration={200} fadeOutDuration={1000} style={{ backgroundColor: 'rgba(33, 87 ,243, 0.5)' }} />
                <Modal isVisible={isModalVisible}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>이 일정만 수정할 것인가요?</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Button onPress={() => saveInModal(true)} title="이 날짜의 일정만"></Button>
                            <Button onPress={() => saveInModal(false)} title="연관된 모든 날짜"></Button>
                        </View>
                    </View>
                </Modal>
                <Modal isVisible={recurModalVisible}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                        <RadioForm
                            radio_props={[
                                { label: '반복없음', value: 'none' },
                                { label: '매일반복', value: 'daily' },
                                { label: '매주반복', value: 'weekly' },
                                { label: '매월반복', value: 'monthly' },
                                { label: '매년반복', value: 'yearly' },
                            ]}
                            onPress={(val) => {
                                dispatch({ type: 'frequency', data: val });
                                console.log(eventData);
                            }}
                        />
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>반복횟수 </Text>
                                <TextInput
                                    style={{ backgroundColor: '#d9d9d9' }}
                                    keyboardType="numeric"
                                    onChangeText={(txt) => dispatch({ type: 'occurrence', data: parseInt(txt) })}
                                />
                                <Text>번 반복</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={{ backgroundColor: '#d9d9d9' }}
                                    keyboardType="numeric"
                                    onChangeText={(txt) => dispatch({ type: 'interval', data: parseInt(txt) })}
                                />
                                <Text>주기로 반복</Text>
                            </View>
                            <weekContext.Provider value={{ weeks, setWeeks }}>
                                <WeekPicker />
                            </weekContext.Provider>
                            <Text>반복종료날짜 설정</Text>
                            {/* 미완성 */}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Button
                                title="닫기"
                                onPress={() => {
                                    console.log(weeks);
                                    dispatch({ type: 'daysOfWeek', data: weeks });
                                    console.log(eventData.recurrenceRule.frequency);
                                    console.log(eventData.recurrenceRule);
                                    setRecurModal(false);
                                }}
                            />
                            <Button
                                title="초기화"
                                onPress={() => {
                                    initModal();
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    rowStyle: {
        flexDirection: 'row',
    },
    fontsStyle: {
        fontSize: 20,
    },
    rowStyleDate: {
        flexDirection: 'row',
        height: 30,
    },
    touchText: {
        marginVertical: 15,
        fontSize: 15,
    },
    checkStyle: {
        flexDirection: 'row',
        marginVertical: 15,
        alignItems: 'center',
    },
});

export default eventSaveMain;
