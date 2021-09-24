import { View, Text, Button, StyleSheet, Keyboard } from 'react-native'
import React, { useState, useRef, useEffect, useReducer } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import RNCalendarEvents from 'react-native-calendar-events';
import Toast from 'react-native-easy-toast';
import { createStackNavigator } from '@react-navigation/stack'
import CheckBox from '@react-native-community/checkbox'
import { Picker } from '@react-native-picker/picker'
import selectCalInterface from './selectCalInterface'
import calAlarmSetInterface from './calAlarmSetInterface'


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



    const init = async () => {

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
                const res = await RNCalendarEvents.findEventById(route.params.eventId)
                dispatch({ type: 'all', data: res });
                setTitle(res.title);
                calId = {
                    id: res.calendar.id,
                    title: res.calendar.title
                }
                // 알람 데이터는 수신시 날짜형식으로 수신함 parsing
                const dateDif = res.alarms.map((i) => {
                    return moment(i.date).diff(res.startDate, 'minute');
                })
                alarmData = dateDif.map((i) => {
                    return { ["date"]: i }
                })
                alarmSet(alarmData);

            }
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
                    if (isStart) {
                        dispatch({ type: 'startDate', data: forDate })
                    } else {
                        dispatch({ type: 'endDate', data: forDate })
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
                            {console.log(eventData)}
                            {console.log('********************')}
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
                    onValueChange={(item) => { dispatch({ type: 'recurrence', data: item }) }}>
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

const EventStack = createStackNavigator();  // 네비게기터 설정
export default eventSave = () => {
    return (
        <EventStack.Navigator initialRouteName={"Save Event"} >
            <EventStack.Screen name={"Save Event"} component={eventSaveMain} />
            <EventStack.Screen name={"Select Calendar"} component={selectCalInterface} />
            <EventStack.Screen name={"알림"} component={calAlarmSetInterface} options={{ headerLeft: null }} />
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