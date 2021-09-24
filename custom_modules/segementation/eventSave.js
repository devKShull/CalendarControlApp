import { View, Text, Button, StyleSheet, Keyboard } from 'react-native'
import React, { useState, useRef, useEffect, useCallback, useReducer } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import RNCalendarEvents from 'react-native-calendar-events';
import Toast from 'react-native-easy-toast';
import { createStackNavigator } from '@react-navigation/stack'
import CheckBox from '@react-native-community/checkbox'
import { Picker } from '@react-native-picker/picker'

import { useFocusEffect } from '@react-navigation/native'



export const eventSaveMain = ({ navigation, route }) => {
    const [date, setDate] = useState(new Date());

    const eventReducer = (state, action) => {
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
            case 'recurrenceRule':
                return { ...state, recurrenceRule: { duration: action.data.dur, frequency: action.data.fre } }
            case 'alarms':
                return { ...state, alarms: action.data }
            case 'all':
                return action.data
            case 'date':
                return { ...state, startDate: action.data, endDate: action.data }
            default:
                break;
        }
    }
    const [eventData, dispatch] = useReducer(eventReducer, {
        calendarId: null,       //저장될 캘린더 ID
        startDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z', //시작시간 //format 사용시 한글이 들어가게되면 자동으로 변환됨 -09:00 필요
        endDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',  //종료시간
        allDay: false,
        description: null,
        recurrence: 'none', //반복
        alarms: [] //  분단위로 자동 조절 ex 10 => startDate로 부터 10분전
    })
    let calId = { id: null, title: null };
    let alarmData = [];
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    //Toast
    const [isStart, setIsStart] = useState(false); //시작시간true or 종료시간 false
    const [eventTitle, setTitle] = useState();
    const [initDate, setInitDate] = useState(false);

    const [alarmShow, setAlarmShow] = useState();
    const [calNameShow, setCalNameShow] = useState();
    const [initPicker, setInitPicker] = useState(true);

    const init = async () => {
        console.log("********************init")

        if (route.params != null) {
            console.log('params init')
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
                console.log('eventId init/////////////////////////////')
                const res = await RNCalendarEvents.findEventById(route.params.eventId)
                setTitle(res.title);
                calId = {
                    id: res.calendar.id,
                    title: res.calendar.title
                }
                delete res.calendar;

                // duration 없는 recurrence는 없어도 무관함
                if (res.recurrenceRule != null) {
                    if (res.recurrenceRule.duration == null) {
                        delete res.recurrenceRule;
                    }
                }
                dispatch({ type: 'all', data: res });
                console.log(res);
                //recurrenceRule 데이터에서 endDate 추출 09/23
                if (res.recurrenceRule != null) {   //recurrenceRule 존재여부 먼저 확인 안할시 duration 존재에 대해 promise경고
                    if (res.recurrenceRule.duration != null) {
                        const duration = res.recurrenceRule.duration
                        console.log("recurrenceRule 확인됨")
                        console.log(duration)
                        if (duration == 'P1D') {
                            dispatch({ type: 'endDate', data: res.startDate });
                        } else {
                            const second = duration.substring(duration.indexOf('P') + 1, duration.indexOf('S'))
                            console.log(second)
                            dispatch({ type: 'endDate', data: moment(res.startDate).add(second, 's').subtract('09:00').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' })
                        }
                    }

                }


                const dateDif = res.alarms.map((i) => {
                    return moment(i.date).diff(res.startDate, 'minute');
                })
                console.log(dateDif);
                alarmData = dateDif.map((i) => {
                    return { ["date"]: i }
                })
                console.log(alarmData)
                alarmSet(alarmData);
                console.log(eventData);
                setInitDate(true);
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

    // useEffect(() => {
    //     console.log('changed eventData');
    //     console.log(eventData)

    // }, [eventData])



    const alarmSet = (alarmDataParam) => {

        console.log(eventData.alarms)
        console.log(alarmDataParam)

        dispatch({ type: 'alarms', data: alarmDataParam })
        setAlarmShow(
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={{ textAlign: 'right', flex: 1 }}>
                    {alarmDataParam.map((i) => {
                        console.log(i.date)
                        switch (i.date) {
                            case 0:
                                return '일정 시작시간 '
                            case 10:
                                return '10분 전 '
                            case 60:
                                return '1시간 전 '
                            case 1440:
                                return '1일 전 '
                            default:
                                const hour = i.date / 60
                                const min = i.date % 60
                                let res = ''
                                if (hour != 0) {
                                    res = hour + "시간 "
                                }
                                if (min != 0) {
                                    res += min + '분 전'
                                } else {
                                    res += '전'
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
            console.log(eventData);
            setShow(false);
            setDate(currentDate);
            const forDate = moment(currentDate).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
            // if (eventData.allDay) { //allDay 선택시 시작날짜 및 종료날짜 00시00분00초로 동기화

            //     !initDate ? dispatch({ type: 'date', data: forDate + 'Z' }) :
            //         isStart ? dispatch({ type: 'startDate', data: forDate + 'Z' }) : dispatch({ type: 'endDate', data: forDate + 'Z' });
            //     console.log(eventData);
            // } else 
            if (mode === 'date') {
                showMode('time');
                //날짜 선택 완료시 시간선택모드로
            } else {
                if (!initDate) {
                    dispatch({ type: 'date', data: forDate });
                    setInitDate(true);
                } else {
                    let diffTime
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
                            dispatch({ 'type': 'recurrenceRule', 'data': { dur: 'P1D', fre: eventData.recurrence } })
                        } else {
                            console.log('dispatch')
                            dispatch({ 'type': 'recurrenceRule', 'data': { dur: 'P' + Math.floor(diffTime) + 'S', fre: eventData.recurrence } })
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
                delete eventData.endDate
            }
            console.log(eventData);
            const id = await RNCalendarEvents.saveEvent(eventTitle, eventData)
            showToast(eventTitle + '일정이 저장되었습니다. id:' + id);
            setTimeout(() => {
                navigation.navigate('Calendar Test');
            }, 1500);
        }

        // const id = await RNCalendarEvents.saveEvent('recurrence testing', {
        //     calendarId: 14,       //저장될 캘린더 ID
        //     startDate: moment(date).subtract("07:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z', //시작시간 //format 사용시 한글이 들어가게되면 자동으로 변환됨 -09:00 필요

        //     allDay: false,
        //     description: null,
        //     recurrence: 'none', //반복
        //     recurrenceRule: { endDate: moment(date).subtract("08:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z', frequency: 'monthly' },
        //     alarms: [] //  분단위로 자동 조절 ex 10 => startDate로 부터 10분전
        // })
        // showToast(eventTitle + '일정이 저장되었습니다. id:' + id);

    }


    const toastRef = useRef();
    const showToast = (txt) => {
        toastRef.current.show(txt, 2000);
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
                        display="default"
                        onChange={onChange}
                    />
                )}

                <TextInput placeholder={"메모"} style={{ fontSize: 20, backgroundColor: '#FAFBE9' }} onChangeText={(txt) => eventData.description = txt} />

                <TouchableOpacity onPress={() => navigation.navigate('Select Calendar')} style={{ height: 50 }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <Text style={styles.touchText}>캘린더 위치</Text>
                        {calNameShow}
                    </View>
                </TouchableOpacity>


                <View style={{ height: 50 }}>
                    <TouchableOpacity onPress={() => { console.log(alarmData); navigation.navigate("알림", eventData.alarms) }} style={{ height: 50 }}><View style={{ flexDirection: 'row', flex: 1 }}><Text style={styles.touchText}>알림</Text>
                        {alarmShow}</View></TouchableOpacity>

                </View>
                <Picker

                    selectedValue={eventData.recurrence}
                    onValueChange={(item) => {
                        if (initPicker) {
                            setInitPicker(false);
                        } else {
                            dispatch({ type: 'recurrence', data: item });
                            if (eventData.recurrenceRule != null) {
                                if (eventData.recurrenceRule.duration != null) {
                                    dispatch({ type: 'recurrenceRule', data: { fre: item } });
                                }
                            }

                            console.log(eventData);
                        }
                    }}>
                    <Picker.Item label="반복 없음" value="none" />
                    <Picker.Item label="매일 반복" value="daily" />
                    <Picker.Item label="매주 반복" value="weekly" />
                    <Picker.Item label="매월 반복" value="monthly" />
                    <Picker.Item label="매년 반복" value="yearly" />
                </Picker>


                <View>
                    <Button onPress={() => { onSaveEventHandle() }} title={"저장"}></Button>
                </View>

                <Toast ref={toastRef}
                    positionValue={200}
                    fadeInDuration={200}
                    fadeOutDuration={1000}
                    style={{ backgroundColor: 'rgba(33, 87 ,243, 0.5)' }}
                />
            </View>
        </View>
    )
}


const selectCal = ({ navigation }) => { //캘린더 선택 화면
    const [data, setData] = useState();
    const [data2, setData2] = useState();
    const [data3, setData3] = useState();

    useEffect(() => {
        init();
    }, [])

    let googleCalData
    let localCalData
    let samCalData
    let calendars

    const init = async () => {
        console.log("initOn")
        calendars = await RNCalendarEvents.findCalendars();

        //캘린더 분류
        googleCalData =
            calendars.filter((i) => {
                return (i.type === ('com.google'))
            })
        localCalData =
            calendars.filter((i) => {
                return i.type === ('LOCAL')
            }
            )
        samCalData = calendars.filter((i) => {
            return i.type === ('com.osp.app.signin')
        })

        setDatas();
    }
    const selectedCal = (id, title) => {    //캘린더 선택시 이전화면으로 id 와 title을 넘김
        navigation.navigate('Save Event', { id: id, title, title });
    }

    const setDatas = () => {
        setData(
            googleCalData.map((i, key) => {
                return (
                    <View key={key}>
                        <TouchableOpacity onPress={() => { selectedCal(i.id, i.title) }}>
                            <Text style={{ fontSize: 20 }}>{i.title}</Text>
                        </TouchableOpacity>
                    </View>
                )
            })
        )
        setData2(
            localCalData.map((i, key) => {
                return (
                    <View key={key}>
                        <TouchableOpacity onPress={() => { selectedCal(i.id, i.title) }}>
                            <Text style={{ fontSize: 20 }}>{i.title}</Text>
                        </TouchableOpacity>
                    </View>
                )
            })
        )
        setData3(
            samCalData.map((i, key) => {
                return (
                    <View key={key}>
                        <TouchableOpacity onPress={() => { selectedCal(i.id, i.title) }}>
                            <Text style={{ fontSize: 20 }}>{i.title}</Text>
                        </TouchableOpacity>
                    </View>
                )
            })
        )
    }

    return (
        <View style={{ margin: 30 }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', }}>Google Calendars</Text>
            {data}
            <Text style={{ fontSize: 30, fontWeight: 'bold', }}>Local Calendars</Text>
            {data2}
            <Text style={{ fontSize: 30, fontWeight: 'bold', }}>Samsung Calendars</Text>
            {data3}
        </View>
    )
}

const alarmCal = ({ navigation, route }) => {   // 캘린더 알림 선택 화면
    const [alarmsParams, setAlarmsParams] = useState([]);   //알림 데이터
    // const [zero, setZero] = useState(false);
    // const [ten, setTen] = useState(false);
    // const [hour, setHour] = useState(false);
    // const [day, setDay] = useState(false);      //체크박스 선택 여부
    const reducer = (state, action) => {
        switch (action.type) {
            case 0:
                return { ...state, 'zero': true }
            case 10:
                return { ...state, 'ten': true }
            case 60:
                return { ...state, 'hour': true }
            case 1440:
                return { ...state, 'day': true }
            default:
                break;
        }
    }


    const [checkBool, dispatch] = useReducer(reducer, {
        'zero': false,
        'ten': false,
        'hour': false,
        'day': false
    })
    useEffect(() => {
        init();
    }, [route])
    const init = () => {
        const res = route.params
        console.log('alarmCal');
        console.log(res);
        setAlarmsParams(res);   //알림설정 변경 시 기존에 선택했던 alarms 데이터를 route로 받아옴 
        res.map((i) => {        //switch 사용시 break 사용 주의
            dispatch({ type: i.date })
            // switch (i.date) {
            //     case 0:
            //         setZero(true);
            //         break
            //     case 10:
            //         setTen(true);
            //         break
            //     case 60:
            //         setHour(true);
            //         break
            //     case 1440:
            //         setDay(true);
            //         break
            // }
        })
    }
    const setAlarms = (val, when) => {
        //val 이 true 일시 알림 추가 false 일시 알림 제거
        if (val) {
            setAlarmsParams([...alarmsParams, { ['date']: when }])
        } else {
            setAlarmsParams(alarmsParams.filter(i => i.date != when));
        }
    }

    return (
        <View>
            <View style={{ padding: 20 }}>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={checkBool.zero}
                        disabled={false}
                        onValueChange={(val) => { dispatch({ type: 0 }); setAlarms(val, 0) }} />
                    <Text style={{ fontSize: 25 }}>일정 시작시간</Text>
                </View>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={checkBool.ten}
                        disabled={false}
                        onValueChange={(val) => { dispatch({ type: 10 }); setAlarms(val, 10) }} />
                    <Text style={{ fontSize: 25 }}>10분 전</Text>
                </View>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={checkBool.hour}
                        disabled={false}
                        onValueChange={(val) => { dispatch({ type: 60 }); setAlarms(val, 60) }} />
                    <Text style={{ fontSize: 25 }}>1시간 전</Text>
                </View>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={checkBool.day}
                        disabled={false}
                        onValueChange={(val) => { dispatch({ type: 1440 }); setAlarms(val, 1440) }} />
                    <Text style={{ fontSize: 25 }}>1일 전</Text>
                </View>
                <Button title="저장" onPress={() => { navigation.navigate('Save Event', { alarmsParams }) }} />
            </View>
        </View>
    )
}

const EventStack = createStackNavigator();  // 네비에기터 설정
export default eventSave = () => {
    return (
        <EventStack.Navigator initialRouteName={"Save Event"} >
            <EventStack.Screen name={"Save Event"} component={eventSaveMain} />
            <EventStack.Screen name={"Select Calendar"} component={selectCal} />
            <EventStack.Screen name={"알림"} component={alarmCal} options={{ headerLeft: null }} />
        </EventStack.Navigator>
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