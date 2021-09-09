import { View, Text, Button, StyleSheet, Keyboard } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import RNCalendarEvents from 'react-native-calendar-events';
import Toast from 'react-native-easy-toast';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import CheckBox from '@react-native-community/checkbox'




const eventSaveMain = ({ navigation, route }) => {
    const [date, setDate] = useState(new Date());
    const [eventData, setEventData] = useState({
        calendarId: null,       //저장될 캘린더 ID
        //notes: 'test Notes',    //메모
        startDate: moment(date).add('03:00').format('YYYY-MM-DDThh:mm:ss.SSS') + 'Z', //시작시간
        endDate: moment(date).add('03:00').format('YYYY-MM-DDThh:mm:ss.SSS') + 'Z',  //종료시간
        allDay: false,
        description: null,
        recurrence: 'none', //반복

    })
    let calId = { id: null, title: null };
    // const [calId, setCalId] = useState()
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isStart, setIsStart] = useState(false);
    // let show = false;
    // const onChange = (event, selected) => {
    //     const currentDate = selected || date;
    //     show = false;
    //     setDate(currentDate);
    // }
    const [eventTitle, setTitle] = useState();
    const [calNameShow, setCalNameShow] = useState()
    const [isAllDay, setIsAllDay] = useState(false);
    const allDayFunc = (val) => {
        setEventData({ ...eventData, allDay: val });
        setIsAllDay(val);
    }
    useEffect(() => {
        // console.log(route.params);
        if (route.params != null) {
            calId = {
                id: route.params.id,
                title: route.params.title
            };
        }


        if (calId.id != null) {
            setEventData({ ...eventData, ["calendarId"]: calId.id })
            if (calId.title != null) {
                // console.log(calId.title);
                setCalNameShow(<Text style={{ textAlign: 'center', flex: 1, marginVertical: 15 }}>{calId.title} 선택됨</Text>)
                showToast(calId.title + "캘린더가 선택되었습니다.")
            }
        }

        return () => {
        }
    }, [route.params])

    const onChange = (event, selectedDate) => {
        if (selectedDate != null) {
            const currentDate = selectedDate || date;
            console.log('sdsds' + selectedDate);
            //날짜선택이 취소되었을 경우 date(오늘날짜) 가 들어감
            // console.log(currentDate);
            // console.log(date);
            // console.log(selectedDate);

            setShow(false);
            setDate(currentDate);
            if (mode === 'date') {
                showMode('time');

                // console.log(mode);
            } else {
                // console.log(isStart);
                //YYYY-MM-DDThh:mm:ss.SSSZ
                const forDate = moment(currentDate).add("03:00").format('YYYY-MM-DDThh:mm:ss.SSS');
                console.log(forDate);
                isStart ? setEventData({ ...eventData, ["startDate"]: forDate + 'Z' }) : setEventData({ ...eventData, ["endDate"]: forDate + 'Z' });
                console.log('evttime');
                console.log(eventData.startDate);
                // console.log("date")
                // console.log(date)
                // console.log("--------------------")
                // console.log(eventData.startDate)
                // console.log("-------------------")
                // console.log(eventData.endDate)
            }
        } else {
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
    const onSaveEventHandle = async () => {
        Keyboard.dismiss()
        if (eventTitle == null) {
            showToast('제목을 입력하세요!');
        } else if (route.params == null) {
            showToast('캘린더를 선택하세요');
        }
        else {
            const id = await RNCalendarEvents.saveEvent(eventTitle, eventData)
            // console.log(id);
            showToast(eventTitle + '일정이 저장되었습니다. id:' + id);
            console.log(eventData.startDate);

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
                <TextInput placeholder={"제목"} style={{ fontSize: 30 }} onChangeText={(txt) => setTitle(txt)} />

                <View>

                    <TouchableOpacity onPress={() => showDatepicker(true)} >
                        <View style={styles.rowStyleDate}>
                            <Text style={{ fontSize: 15, textAlign: 'left' }}>시작    </Text>
                            <Text style={{ textAlign: 'right' }}>{moment(eventData.startDate).format('MM월 DD일  HH시 mm분')}</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => showDatepicker(false)}>
                        <View style={styles.rowStyleDate}>
                            <Text style={{ fontSize: 15, }}>종료    </Text>
                            <Text style={{ textAlign: 'right' }}>{moment(eventData.endDate).format('MM월 DD일  HH시 mm분')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <CheckBox
                            value={isAllDay}
                            disabled={false}
                            onValueChange={(val) => { allDayFunc(val); }}
                        />
                        <Text style={{ marginLeft: 15 }}>하루종일</Text>
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

                <TextInput placeholder={"메모"} style={{ fontSize: 20 }} onChangeText={(txt) => eventData.description = txt} />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Select Calendar')}><Text style={styles.touchText}>캘린더 위치</Text></TouchableOpacity>
                    {calNameShow}
                </View>

                <TouchableOpacity><Text style={styles.touchText}>알람</Text></TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.touchText}>반복 없음</Text></TouchableOpacity>


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
const selectCal = ({ navigation }) => {
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


        // console.log(googleCalData);
        // console.log(localCalData);

        setDatas();
    }
    const selectedCal = (id, title) => {
        // setEventData({ ...eventData, ["calendarId"]: id });
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


const EventStack = createStackNavigator();


export default eventSave = () => {


    const recurrenceCal = ({ navigation }) => {

        return (
            <View>

            </View>
        )
    }
    return (

        <EventStack.Navigator initialRouteName={"Save Event"} >
            <EventStack.Screen name={"Save Event"} component={eventSaveMain} />
            <EventStack.Screen name={"Select Calendar"} component={selectCal} />
            <EventStack.Screen name={"반복"} component={recurrenceCal} />
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
    }

})