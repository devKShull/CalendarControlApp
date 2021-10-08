import { View, Text, Button, StyleSheet, Keyboard, Platform, ScrollView } from 'react-native'
import Modal from 'react-native-modal'
import React, { useState, useRef, useEffect, useReducer } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import * as calendarClass from './calendarClass'
import Toast from 'react-native-easy-toast'
import CheckBox from '@react-native-community/checkbox'
import { Picker } from '@react-native-picker/picker'
import RadioForm from 'react-native-simple-radio-button'


export default eventSaveMainInterface = ({ navigation, route }) => {
    const [date, setDate] = useState(new Date()); //현재 시각 및 오늘 날자

    const eventReducer = (state, action) => { //eventData 지정을 위한 리듀서
        switch (action.type) {
            case 'calendarId':
                return { ...state, calendarId: action.data }
            case 'startDate':
                return { ...state, startDate: action.data }
            case 'endDate':
                return { ...state, endDate: action.data }
            case 'allDay':
                return { ...state, allDay: action.data }
            case 'description':
                return { ...state, description: action.data }
            case 'recurrence':
                return { ...state, recurrence: action.data }
            case 'alarms':
                return { ...state, alarms: action.data }
            case 'all':
                return action.data
            case 'date':
                return { ...state, startDate: action.data, endDate: action.data }
            //아래는 recurrenceRule
            case 'duration':
                return { ...state, recurrenceRule: { ...state.recurrenceRule, duration: action.data } }
            case 'frequency':
                return { ...state, recurrenceRule: { ...state.recurrenceRule, frequency: action.data } }
            case 'interval':
                return { ...state, recurrenceRule: { ...state.recurrenceRule, interval: action.data } }
            case 'occurrence':
                return { ...state, recurrenceRule: { ...state.recurrenceRule, occurrence: action.data } }
            case 'recurrenceEndDate':
                return { ...state, recurrenceRule: { ...state.recurrenceRule, endDate: action.data } }
            default:
                break;
        }
    }
    const [eventData, dispatch] = useReducer(eventReducer, {
        calendarId: null,       //저장될 캘린더 ID
        startDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z', //시작시간  -09:00 필요
        endDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',  //종료시간
        allDay: false,
        description: null,
        alarms: [], //  분단위로 자동 조절 ex 10 => startDate로 부터 10분전
        recurrenceRule: { frequency: 'none', duration: 'PT0H' }
    })
    let calId = { id: null, title: null }; //캘린더 선택후 받아온 데이터 저장용
    let alarmData = []; //알람데이터 저장용
    const [mode, setMode] = useState('date');   //dateTimePicker 의 모드 선택용
    const [show, setShow] = useState(false);  // show 가 true 일때만 dateTimePicker 표시
    //Toast
    const [isStart, setIsStart] = useState(false); //시작시간true or 종료시간 false
    const [eventTitle, setTitle] = useState();  // 이벤트의 title은 eventData와 별개로 지정되기 때문에 따로 state 로 지정
    const [initDate, setInitDate] = useState(false); // 초기 설정인가 에 대한 state 초기설정(dateTimePicker) 일경우 시작시간 종료시간 동시에 설정

    const [alarmShow, setAlarmShow] = useState(); // 선택한 알림을 표기하기위한 component state 
    const [calNameShow, setCalNameShow] = useState(); // 선택한 캘린더의 title 을 표시하기우한 component state
    const [initPicker, setInitPicker] = useState(true);
    // 이벤트 수정시 받아온데이터에서 picker의 value 인 recurrence가 있을때 bug로 value 와 onValueChange 의 item 이 동기화되지않는것을 방지
    const [saveState, setSaveState] = useState(false)
    const [isException, setIsException] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [recurModalVisible, setRecurModal] = useState(false);
    const [recShow, setRecShow] = useState()

    const init = async () => {

        if (route.params != null) {
            // route.params 가 null일 경우 .id 혹은 다른 데이터들이 undefined로 나타나기 때문에 먼저 params 검증부터함
            if (route.params.id != null) {
                calId = {
                    id: route.params.id,
                    title: route.params.title
                };
            }
            if (route.params.alarmsParams != null) { //알림설정후 받은 params 로 알림데이터 설정
                alarmData = route.params.alarmsParams
                alarmSet(alarmData);
            }
            //일정 수정을 위한 데이터 수신 및 적용
            if (route.params.eventId != null) {
                const res = await calendarClass.eventFindId(route.params.eventId)
                console.log(res);
                setTitle(res.title);
                calId = {
                    id: res.calendar.id,
                    title: res.calendar.title
                }
                delete res.calendar; // 이벤트 저장시 캘린더에 대한 내용은 calendarId만 있으면됨
                delete res.recurrence // recurrence 설정은 recurrenceRule 로 대체한다 10/01
                dispatch({ type: 'all', data: res });
                //recurrenceRule 데이터에서 endDate 추출 09/23
                if (res.recurrenceRule != null) {   //recurrenceRule 존재여부 먼저 확인 안할시 duration 존재에 대해 promise경고
                    if (res.recurrenceRule.duration != null) {
                        const duration = res.recurrenceRule.duration
                        console.log("recurrenceRule 확인됨")
                        console.log(duration)
                        if (!(res.recurrenceRule.frequency == null || res.recurrenceRule.frequency == 'none')) {
                            setIsException(true);
                        } //exception 날짜를 지정하기위함
                        if (duration == 'P1D') {
                            dispatch({ type: 'endDate', data: moment(res.startDate).add(1, 'd') });
                        } else if (duration.indexOf('S') != -1) {
                            const second = duration.substring(duration.indexOf('P') + 1, duration.indexOf('S'))
                            console.log(second)
                            dispatch({ type: 'endDate', data: moment(res.startDate).add(second, 's').subtract('09:00').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' })
                        } else if (duration.indexOf('H') != -1) {
                            const hour = duration.substring(duration.indexOf('T') + 1, duration.indexOf('H'))
                            console.log(hour)
                            dispatch({ type: 'endDate', data: moment(res.startDate).add(hour, 'h').subtract('09:00').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' })
                        }
                    }
                    // else {
                    //     delete res.recurrenceRule;
                    //     // duration 없는 recurrenceRule는 없어도 무관함
                    //     //  RecurrenceRule이 존재할시 endDate를 삭제해야 하기 때문에 duration 없을시 recurrenceRule을 삭제(recurrence 가 있으면 자동으로 생성됨)
                    // }
                }

                // 알람 데이터는 수신시 날짜형식으로 수신함 minute 단위로 parsing
                const dateDif = res.alarms.map((i) => {
                    return moment(i.date).diff(res.startDate, 'minute');
                })
                alarmData = dateDif.map((i) => {
                    return { ["date"]: i }
                })
                alarmSet(alarmData);
                setInitDate(true); // 일정수정시엔 시작 종료시간 각각 설정할수 있도록 initDate true 로 설정
            }
        } else {
            setInitPicker(false);
        }

        if (calId.id != null) {
            if (calId.title != null) {
                dispatch({ type: 'calendarId', data: calId.id })
                setCalNameShow(<Text style={{ textAlign: 'right', marginVertical: 15, flex: 1 }}>{calId.title} 선택됨</Text>)
                showToast(calId.title + "캘린더가 선택되었습니다.")
            }
        }

    }

    useEffect(async () => {
        init();
    }, [route.params])

    const alarmSet = (alarmDataParam) => {
        dispatch({ type: 'alarms', data: alarmDataParam })
        setAlarmShow(
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={{ textAlign: 'right', flex: 1 }}>
                    {alarmDataParam.map((i) => {
                        switch (i.date) {
                            case 0:
                                return '일정 시작시간 '
                            case 10:
                                return '10분 전 '
                            case 60:
                                return '1시간 전 '
                            case 1440:
                                return '1일 전 '
                            default: // 알람데이터는 분단위로 저장되어 들어옴
                                const hour = Math.floor(i.date / 60)
                                const min = i.date % 60
                                let res = ''
                                if (hour != 0) {
                                    res = hour + "시간 "
                                }
                                if (min != 0) {
                                    res += min + '분 전 '
                                } else {
                                    res += '전 '
                                }
                                return res
                        }
                    })}
                </Text>
            </View>
        )
    }

    const onChange = (event, selectedDate) => { //날짜선택시
        if (selectedDate != null) {
            const currentDate = selectedDate || date;
            //선택되는 시간은 GPT기준 한국시간으로 9시간 더해야함
            //날짜선택이 취소되었을 경우 date(오늘날짜) 가 들어감
            setShow(Platform.OS === 'ios');
            setDate(currentDate);
            const forDate = moment(currentDate).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
            // if (eventData.allDay) { //allDay 선택시 시작날짜 및 종료날짜 00시00분00초로 동기화

            //     !initDate ? dispatch({ type: 'date', data: forDate + 'Z' }) :
            //         isStart ? dispatch({ type: 'startDate', data: forDate + 'Z' }) : dispatch({ type: 'endDate', data: forDate + 'Z' });
            //     console.log(eventData);
            // } else 
            if (mode === 'date' && !eventData.allDay) {
                showMode('time');
                //날짜 선택 완료시 시간선택모드로
            } else {
                let diffTime;
                eventData.allDay && setShow(false);
                if (!initDate) {
                    dispatch({ type: 'date', data: forDate });
                    setInitDate(true);
                } else {
                    if (isStart) {
                        dispatch({ type: 'startDate', data: forDate })
                        const end = moment(eventData.endDate)
                        diffTime = moment.duration(end.diff(moment(currentDate))).asSeconds(); // 시간차 사전 계산
                    } else {
                        dispatch({ type: 'endDate', data: forDate })
                        const start = moment(eventData.startDate)
                        diffTime = moment.duration(moment(currentDate).diff(start)).asSeconds(); // 시간차 사전 계산
                    }

                    // save용 recurrenceRule data 09/23
                    if (eventData.recurrenceRule != null) {
                        if (diffTime == 0) {
                            dispatch({ 'type': 'duration', 'data': 'P1D' })
                        } else {
                            dispatch({ 'type': 'duration', 'data': 'P' + Math.floor(diffTime) + 'S' })
                        }
                    }
                }
            }
        } else { //선택된 데이터가 없을시 dateTimePicker 종료
            setShow(false);
        }
    };

    const showMode = (currentMode) => {
        setMode(currentMode);
        setShow(true);
    };

    const showDatepicker = (isStart) => {
        setIsStart(isStart)
        showMode('date');
    };


    const onSaveEventHandle = async () => { //저장 기능
        Keyboard.dismiss() //키보드 사라지게함
        if (!saveState) {

            const dateWarning = moment(eventData.startDate).isBefore(eventData.endDate) //시작시간이 종료시간보다 뒤일경우
            if (eventTitle == null) {
                showToast('제목을 입력하세요!');
            } else if (route.params == null) {
                showToast('캘린더를 선택하세요');
            } else if (eventData.startDate != eventData.endDate && !dateWarning) {
                showToast('시작날짜가 종료날짜보다 뒤일 수 없습니다.')
            }
            else {
                if (eventData.recurrenceRule != null) { //recurrenceRule 검증 endDate 삭제 09/23
                    if (Platform.OS === 'android') {
                        if (eventData.recurrenceRule.frequency == 'none') {
                            delete eventData.recurrenceRule //recurrenceRule의 frequency가 none 인경우 => 반복아님 recurrenceRule 삭제
                        } else {
                            delete eventData.endDate //recurrenceRule 의 frequency 가 none이 아닌경우 => 반복인경우 endDate 삭제
                        }
                    }
                }
                if (isException) {
                    setModalVisible(true);
                } else {
                    setSaveState(true);
                    console.log('//////////////////////////////////')
                    console.log(eventData)
                    const id = await calendarClass.eventSaveFunc(eventTitle, eventData)
                    showToast(eventTitle + '일정이 저장되었습니다. id:' + id);
                    setTimeout(() => {
                        navigation.navigate('Agenda Calendar');
                        setSaveState(false);
                    }, 1500);
                }
            }
        }

    }
    const saveInModal = async (isExcept) => {
        if (isExcept) {
            const id = await calendarClass.eventSaveFunc(eventTitle, eventData, eventData.startDate)
            setModalVisible(false);
            showToast(eventTitle + '일정이 저장되었습니다. id:' + id);
            setTimeout(() => {
                navigation.navigate('Agenda Calendar');
                setSaveState(false);
            }, 1500);
        } else {
            const id = await calendarClass.eventSaveFunc(eventTitle, eventData)
            setModalVisible(false);
            showToast(eventTitle + '일정이 저장되었습니다. id:' + id);
            setTimeout(() => {
                navigation.navigate('Agenda Calendar');
                setSaveState(false);
            }, 1500);
        }
    }
    const recurrenceShow = (val) => {
        let txt
        switch (val) {
            case 'none':
                txt = '반복 없음'
                break;
            case 'daily':
                txt = '매일 반복'
                break;
            case 'weekly':
                txt = '주간 반복'
                break;
            case 'monthly':
                txt = '월간 반복'
                break;
            case 'yearly':
                txt = '년간 반복'
                break;
        }
        setRecShow(

            <Text style={{ textAlign: 'right', flex: 1 }}>
                {txt}
            </Text>

        )
    }
    const toastRef = useRef();
    const showToast = (txt) => {
        toastRef.current.show(txt, 2000);
    }
    const RecView = () => {
        let txt;
        if (eventData.recurrenceRule != null) {
            txt = eventData.recurrenceRule.frequency;
            if (eventData.recurrenceRule.interval != null) {
                txt += ', interval: ' + eventData.recurrenceRule.interval;
            }
            if (eventData.recurrenceRule.occurrence != null) {
                txt += ', occurence: ' + eventData.recurrenceRule.occurrence;
            }
        }
        return (
            <Text>{txt}</Text>
        )
    }
    const initModal = () => {
        dispatch({ type: 'frequency', data: 'none' });
        dispatch({ type: 'duration', data: 'PT0H' });
        if (eventData.recurrenceRule.interval != null) {
            delete eventData.recurrenceRule.interval
        }
        if (eventData.recurrenceRule.occurrence != null) {
            delete eventData.recurrenceRule.occurrence
        }
    }
    return (
        <View style={{ backgroundColor: '#98CA32', flex: 1 }}>
            <View style={{ margin: 15, backgroundColor: '#F5F7D4', padding: 25 }}>
                <TextInput placeholder={"제목"} value={eventTitle} style={{ fontSize: 30, backgroundColor: '#FAFBE9', marginVertical: 10 }} onChangeText={(txt) => setTitle(txt)} />

                <View>

                    <TouchableOpacity onPress={() => showDatepicker(true)} >
                        <View style={styles.rowStyleDate}>
                            <Text style={{ fontSize: 15, textAlign: 'left' }}>시작    </Text>
                            {eventData.allDay ?
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(eventData.startDate).format('MM월 DD일')}</Text> :
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(eventData.startDate).format('MM월 DD일  HH시 mm분')}</Text>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showDatepicker(false)}>
                        <View style={styles.rowStyleDate}>
                            <Text style={{ fontSize: 15, }}>종료    </Text>
                            {eventData.allDay ?
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(eventData.endDate).format('MM월 DD일')}</Text> :
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(eventData.endDate).format('MM월 DD일  HH시 mm분')}</Text>}
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <CheckBox
                            value={eventData.allDay}
                            disabled={false}
                            onValueChange={(val) => { dispatch({ type: 'allDay', data: val }) }}
                        />
                        <Text style={{ marginLeft: 15, alignSelf: 'center' }}>하루종일</Text>
                    </View>
                </View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'inline' : "default"}
                        onChange={onChange}
                    />
                )}
                <TextInput value={eventData.description} placeholder={"메모"} style={{ fontSize: 20, backgroundColor: '#FAFBE9' }} onChangeText={(txt) => eventData.description = txt} />

                <TouchableOpacity onPress={() => navigation.navigate('Select Calendar')} style={{ height: 50 }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <Text style={styles.touchText}>캘린더 위치</Text>
                        {calNameShow}
                    </View>
                </TouchableOpacity>
                <View style={{ height: 50 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate("알림", eventData.alarms) }} style={{ height: 50 }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={styles.touchText}>알림</Text>
                            {alarmShow}
                        </View>
                    </TouchableOpacity>
                </View>
                {/* <Picker
                    selectedValue={eventData.recurrence}
                    onValueChange={(item) => {
                        if (initPicker) {
                            setInitPicker(false);
                        } else {
                            dispatch({ type: 'recurrence', data: item })
                            if (eventData.recurrenceRule != null) {
                                if (eventData.recurrenceRule.duration != null) {
                                    dispatch({ type: 'recurrenceRule', data: { fre: item } });
                                }
                            }
                        }
                    }}>
                    <Picker.Item label="반복 없음" value="none" />
                    <Picker.Item label="매일 반복" value="daily" />
                    <Picker.Item label="매주 반복" value="weekly" />
                    <Picker.Item label="매월 반복" value="monthly" />
                    <Picker.Item label="매년 반복" value="yearly" />
                </Picker> */}
                <TouchableOpacity onPress={() => { setRecurModal(true); }} style={{ height: 50 }}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        <Text style={{ flex: 1 }}>반복</Text>
                        {/* {recShow} */}
                        <RecView />
                    </View>
                </TouchableOpacity>
                <View>
                    <Button onPress={() => { onSaveEventHandle() }} title={"저장"}></Button>
                </View>
                <Toast ref={toastRef}
                    positionValue={200}
                    fadeInDuration={200}
                    fadeOutDuration={1000}
                    style={{ backgroundColor: 'rgba(33, 87 ,243, 0.5)' }}
                />
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
                            radio_props={
                                [
                                    { label: '반복없음', value: 'none' },
                                    { label: '매일반복', value: 'daily' },
                                    { label: '매주반복', value: 'weekly' },
                                    { label: '매월반복', value: 'monthly' },
                                    { label: '매년반복', value: 'yearly' }
                                ]
                            }

                            onPress={(val) => { dispatch({ 'type': 'frequency', 'data': val }); recurrenceShow(val); console.log(eventData) }}
                        />

                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>반복횟수 </Text>
                                <TextInput

                                    keyboardType='numeric'
                                    onChangeText={(txt) => dispatch({ type: 'occurrence', data: parseInt(txt) })}
                                />
                                <Text>번 반복</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput

                                    keyboardType='numeric'
                                    onChangeText={(txt) => dispatch({ type: 'interval', data: parseInt(txt) })}
                                />
                                <Text>주기로 반복</Text>
                            </View>
                            <Text>반복종료날짜 설정</Text>
                            {/* <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    display={Platform.OS === 'ios' ? 'inline' : "default"}
                                    onChange={onChange}
                                /> */}
                        </View>

                        <Button title="닫기" onPress={() => { console.log(eventData.recurrenceRule.frequency); console.log(eventData.recurrenceRule); setRecurModal(false) }} />
                        <Button title="초기화" onPress={() => { initModal() }} />
                    </View>


                </Modal>

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    rowStyle: {
        flexDirection: 'row'
    },
    fontsStyle: {
        fontSize: 20
    },
    rowStyleDate: {
        flexDirection: 'row',
        height: 30,
    },
    touchText: {
        marginVertical: 15,
        fontSize: 15
    },
    checkStyle: {
        flexDirection: 'row',
        marginVertical: 15,
        alignItems: 'center'
    }


})