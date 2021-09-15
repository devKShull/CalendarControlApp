import { View, Text, Button, StyleSheet, Keyboard } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react'
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
    const [eventData, setEventData] = useState({
        calendarId: null,       //저장될 캘린더 ID
        startDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z', //시작시간 //format 사용시 한글이 들어가게되면 자동으로 변환됨 -09:00 필요
        endDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',  //종료시간
        allDay: false,
        description: null,
        recurrence: 'none', //반복
        alarms: [] //  분단위로 자동 조절 ex 10 => startDate로 부터 10분전
    })
    // let eventData = {
    //     calendarId: null,       //저장될 캘린더 ID
    //     startDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z', //시작시간 //format 사용시 한글이 들어가게되면 자동으로 변환됨 -09:00 필요
    //     endDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',  //종료시간
    //     allDay: false,
    //     description: null,
    //     recurrence: 'none', //반복
    //     alarms: [] //  분단위로 자동 조절 ex 10 => startDate로 부터 10분전
    // }
    let calId = { id: null, title: null };
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [eventTitle, setTitle] = useState();
    const [calNameShow, setCalNameShow] = useState()
    const [isAllDay, setIsAllDay] = useState(false);
    const [recurrenceData, setRecurrence] = useState('none');
    const [initDate, setInitDate] = useState(false);
    const [alarmShow, setAlarmShow] = useState();

    let alarmData = [];

    const init = async () => {
        let res
        let id
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
                console.log('eventId init')
                res = await RNCalendarEvents.findEventById(route.params.eventId)
                console.log("-----------------------------")
                console.log(res)
                calId = {
                    id: res.calendar.id,
                    title: res.calendar.title
                }
                const date = { start: moment(res.startDate).add('09:00'), end: moment(res.endDate).add('09:00') }


                // setEventData({ ...eventData, startDate: date.start, endDate: date.end, recurrence: res.recurrence, id: route.params.eventId })
                // setEventData({ ...eventData, ["startDate"]: date.start, ["endDate"]: date.end, ["recurrence"]: res.recurrence, ["id"]: route.params.eventId, ["allDay"]: res.allDay });

                setIsAllDay(res.allDay)

                if (res.startDate == null) {
                    setShowTime({ start: ' ', end: res.endDate });
                } else if (res.endDate == null) {
                    setShowTime({ start: res.startDate, end: ' ' });
                } else {
                    setShowTime({ start: res.startDate, end: res.endDate });
                }
                setTitle(res.title);
                setRecurrence(res.recurrence)

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

            }
        }
        if (calId.id != null) {
            id = calId.id
            // setEventData({ ...eventData, ["calendarId"]: calId.id })
            if (calId.title != null) {
                // console.log(calId.title);
                setCalNameShow(<Text style={{ textAlign: 'right', marginVertical: 15, flex: 1 }}>{calId.title} 선택됨</Text>)
                showToast(calId.title + "캘린더가 선택되었습니다.")
            }
        }
        if (alarmData != '' && res == null) {
            console.log('justalarm')
            console.log(alarmData)
            setEventData({ ...eventData, ["alarms"]: alarmData })
        } else if (res != null) {
            console.log('allEventData')
            setEventData(
                // ...eventData,
                // ["alarms"]: alarmData,
                // ["calendarId"]: calId.id,
                // ["startDate"]: moment(res.startDate).add('09:00'),
                // ["endDate"]: moment(res.endDate).add('09:00'),
                // ["recurrence"]: res.recurrence,
                // ["id"]: route.params.eventId,
                // ["allDay"]: res.allDay
                res
            );
        } else if (calId.id != null) {
            setEventData({ ...eventData, ["calendarId"]: calId.id })
            console.log('Tid')
        }
        console.log('effect')
        console.log(eventData);
    }

    useEffect(async () => {
        init();
    }, [route.params])


    useEffect(() => {
        console.log('changed eventData');
        console.log(eventData)

    }, [eventData])
    useEffect(() => {
        console.log('Isallday changed');
        console.log(isAllDay)

    }, [isAllDay])


    const alarmSet = (alarmDataParam) => {

        console.log(eventData.alarms)
        console.log(alarmDataParam)
        alarmData = alarmDataParam
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
                                return i.date + "분 전"
                        }
                    })}
                </Text>
            </View>
        )
    }

    const [showTime, setShowTime] = useState({ start: eventData.startDate, end: eventData.endDate });
    const onChange = (event, selectedDate) => { //날짜선택시
        if (selectedDate != null) {
            const currentDate = selectedDate || date;
            //선택되는 시간은 GPT기준 한국시간으로 9시간 더해야함
            //날짜선택이 취소되었을 경우 date(오늘날짜) 가 들어감
            console.log(currentDate);
            setShow(false);
            setDate(currentDate);
            const forDate = moment(currentDate).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS');
            const forDate2 = moment(currentDate).format('YYYY-MM-DDTHH:mm:ss.SSS');
            if (isAllDay) { //allDay 선택시 시작날짜 및 종료날짜 00시00분00초로 동기화

                isStart ? setEventData({ ...eventData, ["startDate"]: forDate + 'Z' }) : setEventData({ ...eventData, ["endDate"]: forDate + 'Z' });
            } else if (mode === 'date') {
                showMode('time');
                //날짜 선택 완료시 시간선택모드로
            } else {
                if (!initDate) {
                    setEventData({ ...eventData, ["startDate"]: forDate + 'Z', ["endDate"]: forDate + 'Z' });
                    setShowTime({ start: forDate2, end: forDate2 });
                    setInitDate(true);
                } else {
                    if (isStart) {
                        setEventData({ ...eventData, ["startDate"]: forDate + 'Z' })
                        setShowTime({ ...showTime, start: forDate2 });
                    } else {
                        setEventData({ ...eventData, ["endDate"]: forDate + 'Z' })
                        setShowTime({ ...showTime, end: forDate2 });
                    }
                }

                // if (isStart) { //시작 시간을 설정하였는가?
                //     initDate ? setEventData({ ...eventData, ["startDate"]: forDate + 'Z' }) //initDate = false 가장 처음 선택시 시작 종료시간 동시설정
                //         : setEventData({ ...eventData, ["startDate"]: forDate + 'Z', ["endDate"]: forDate + 'Z' });
                //     setInitDate(true);
                // } else {//종료시간 선택
                //     initDate ? setEventData({ ...eventData, ["endDate"]: forDate + 'Z' }) //initDate = false 가장 처음 선택시 시작 종료시간 동시설정
                //         : setEventData({ ...eventData, ["startDate"]: forDate + 'Z', ["endDate"]: forDate + 'Z' });
                //     setInitDate(true);
                // }
                // isStart ? setEventData({ ...eventData, ["startDate"]: forDate + 'Z' }) : setEventData({ ...eventData, ["endDate"]: forDate + 'Z' });  
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

        console.log("*******************************")
        console.log(eventData);


        const dateWarning = moment(eventData.startDate).isBefore(eventData.endDate) //시작시간이 종료시간보다 뒤일경우
        if (eventTitle == null) {
            showToast('제목을 입력하세요!');
        } else if (route.params == null) {
            showToast('캘린더를 선택하세요');
        } else if (eventData.startDate != eventData.endDate && !dateWarning) {
            showToast('시작날짜가 종료날짜보다 뒤일 수 없습니다.')
        }
        else {
            console.log(eventData);
            const id = await RNCalendarEvents.saveEvent(eventTitle, eventData)
            showToast(eventTitle + '일정이 저장되었습니다. id:' + id);
            setTimeout(() => {
                navigation.navigate('Calendar Test');
            }, 1500);
        }
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
                            {isAllDay ?
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(showTime.start).format('MM월 DD일')}</Text> :
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(showTime.start).format('MM월 DD일  HH시 mm분')}</Text>}
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => showDatepicker(false)}>
                        <View style={styles.rowStyleDate}>
                            <Text style={{ fontSize: 15, }}>종료    </Text>
                            {isAllDay ?
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(showTime.end).format('MM월 DD일')}</Text> :
                                <Text style={{ textAlign: 'right', flex: 1 }}>{moment(showTime.end).format('MM월 DD일  HH시 mm분')}</Text>}
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <CheckBox
                            value={isAllDay}
                            disabled={false}
                            onValueChange={(val) => { setIsAllDay(val); eventData.allDay = val; }}
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
                    selectedValue={recurrenceData}
                    onValueChange={(item) => { setRecurrence(item); eventData.recurrence = item; }}>
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
    const [zero, setZero] = useState(false);
    const [ten, setTen] = useState(false);
    const [hour, setHour] = useState(false);
    const [day, setDay] = useState(false);      //체크박스 선택 여부
    useEffect(() => {
        init();
    }, [route])
    const init = () => {
        const res = route.params
        console.log('alarmCal');
        console.log(res);
        setAlarmsParams(res);   //알림설정 변경 시 기존에 선택했던 alarms 데이터를 route로 받아옴 
        res.map((i) => {        //switch 사용시 break 사용 주의
            switch (i.date) {
                case 0:
                    setZero(true);
                    break
                case 10:
                    setTen(true);
                    break
                case 60:
                    setHour(true);
                    break
                case 1440:
                    setDay(true);
                    break
            }
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
                        value={zero}
                        disabled={false}
                        onValueChange={(val) => { setZero(val); setAlarms(val, 0) }} />
                    <Text style={{ fontSize: 25 }}>일정 시작시간</Text>
                </View>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={ten}
                        disabled={false}
                        onValueChange={(val) => { setTen(val); setAlarms(val, 10) }} />
                    <Text style={{ fontSize: 25 }}>10분 전</Text>
                </View>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={hour}
                        disabled={false}
                        onValueChange={(val) => { setHour(val); setAlarms(val, 60) }} />
                    <Text style={{ fontSize: 25 }}>1시간 전</Text>
                </View>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={day}
                        disabled={false}
                        onValueChange={(val) => { console.log(val); setDay(val); setAlarms(val, 1440) }} />
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