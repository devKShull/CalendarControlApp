import React from "react";
import { Button, View } from "react-native";
import * as calendarClass from './calendarClass'
import RNCalendarEvents from "react-native-calendar-events";
import moment from "moment";
export default devMode = () => {

    const test = async () => {
        // calendarClass.eventSaveFunc()
        const date = new Date();
        console.log(date)
        const data = {
            calendarId: '15',       //저장될 캘린더 ID
            startDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z', //시작시간  -09:00 필요
            endDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',  //종료시간
            allDay: false,
            description: null,
            recurrence: 'none', //반복
            alarms: [], //  분단위로 자동 조절 ex 10 => startDate로 부터 10분전}
            id: '909'
        }
        const res = await RNCalendarEvents.saveEvent('test243', data)
        console.log(res);
    }
    return (
        <View>
            <Button title='save' onPress={test} />
        </View>
    )
}