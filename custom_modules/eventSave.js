import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

export default eventSave = () => {

    const [date, setDate] = useState(new Date());
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
    const [eventData, setEventData] = useState({
        calendarId: '14',
        notes: 'test Notes',
        startDate: moment(date).format('YYYY-MM-DDThh:mm:ss.SSS') + 'Z',
        endDate: moment(date).format('YYYY-MM-DDThh:mm:ss.SSS') + 'Z',
        allDay: true,
        description: 'test Description',
    })
    // let eventData = {
    //     calendarId: '14',
    //     notes: 'test Notes',
    //     startDate: '2021-09-18T19:26:00.000Z',
    //     endDate: '2021-09-19T19:26:00.000Z',
    //     allDay: true,
    //     description: 'test Description',
    // }


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        //날짜선택이 취소되었을 경우 date(오늘날짜) 가 들어감
        console.log(currentDate);
        console.log(date);
        console.log(selectedDate);

        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        if (mode === 'date') {
            showMode('time');

            console.log(mode);
        } else {
            console.log(isStart);
            //YYYY-MM-DDThh:mm:ss.SSSZ
            const forDate = moment(currentDate).format('YYYY-MM-DDThh:mm:ss.SSS');
            isStart ? setEventData({ ...eventData, ["startDate"]: forDate + 'Z' }) : setEventData({ ...eventData, ["endDate"]: forDate + 'Z' });
            console.log("date")
            console.log(date)
            console.log("--------------------")
            console.log(eventData.startDate)
            console.log("-------------------")
            console.log(eventData.endDate)
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




    return (
        <View style={{ backgroundColor: '#98CA32' }}>
            <View style={{ margin: 15, backgroundColor: '#F5F7D4', padding: 10 }}>
                <View style={styles.rowStyle}>
                    <Text>Event Title</Text>
                    <TextInput placeholder={"title"} style={{ textAlign: 'right' }} onChangeText={(txt) => setTitle(txt)} />
                </View>
                <View style={styles.rowStyle}>
                    <Text>Notes</Text>
                    <TextInput placeholder={"notes"} style={{ textAlign: 'right' }} onChangeText={(txt) => eventData.notes = txt} />
                </View>

                <View style={styles.rowStyle}>
                    <View>
                        <TouchableOpacity onPress={() => showDatepicker(true)}><Text>set Start Date</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => showDatepicker(false)}><Text>set End Date</Text></TouchableOpacity>
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
                </View>
                <View>
                    <Text>startDate{eventData.startDate}</Text>
                    <Text>endDate{JSON.stringify(eventData.endDate)}</Text>
                    <Button onPress={() => { console.log(eventData.endDate) }} title={"test"}></Button>
                </View>


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    }

})