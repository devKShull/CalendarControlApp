import React, { useReducer } from "react";
import { Button, View } from "react-native";
import * as calendarClass from './calendarClass'
import RNCalendarEvents from "../cal";
import moment from "moment";
export default devMode = () => {

    const test = async () => {
        // calendarClass.eventSaveFunc()
        const date = new Date();
        console.log(date)
        const data = {
            calendarId: '15',       //저장될 캘린더 ID
            startDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z', //시작시간  -09:00 필요
            // endDate: moment(date).subtract("09:00").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',  //종료시간
            allDay: false,
            description: null,
            recurrenceRule: {
                frequency: 'yearly', //(기존의 recurrence 랑 같음) weekly monthly yearly daily
                // endDate: '2021-12-01T01:00:00.000Z', //해당 endDate는 일정의 반복의 끝을 의미함 없을시 무한반복
                duration: 'P3600S', //일정 지속시간 (기본일정의 endDate) P~~~S 초단위  PT~H 시단위  P~D 일단위 시작시간으로 부터 떨어진정도
                interval: 1, //(반복주기) option
                // occurrence: 10 //(반복횟수) option
                // weekStart: 'MO', //주 의 시작요일 ex) 'MO' 일경우 월요일을 기점으로 첫째주를 정함 화요일부터 시작되는 달이있으면 그다음주가 첫주가됨. 
                daysOfWeek: ['TU'], // 특정요일 반복 복수지정가능 주간반복시 사용 월간반복시 복수지정 불가 MO TU WE TH FR
                weekPositionInMonth: 3,  //달중 몇번째 주 월별반복시에만 사용
                monthPositionInYear: 10
            },
            alarms: [], //  분단위로 자동 조절 ex 10 => startDate로 부터 10분전}

        }
        const data2 = {
            // alarms: { "date": "2019-10-01T00:10:00.000Z" },
            "allDay": true,
            "calendarId": '15',
            "description": "ads",
            "recurrenceRule": { "frequency": "yearly", "interval": 1, "occurrence": 5, "endDate": "2021-12-05T14:59:59.000Z", "duration": "P3600S" },
            "startDate": "2021-10-15T15:00:00.000Z",
        }
        console.log(data);
        const res = await RNCalendarEvents.saveEvent('test20', data)
        console.log(res);
    }
    const testfe = async () => {
        const res = await calendarClass.eventFindId('240');
        console.log(res);
    }
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
            case 'recurrenceRule':
                return { ...state, recurrenceRule: { duration: action.data.dur, frequency: action.data.fre } }
            default:
                break;
        }
    }
    const [eventData, dispatch] = useReducer(eventReducer, {
        calendarId: null,       //저장될 캘린더 ID
        startDate: '',//시작시간  -09:00 필요
        endDate: '',  //종료시간
        allDay: false,
        description: null,
        alarms: [], //  분단위로 자동 조절 ex 10 => startDate로 부터 10분전
        recurrenceRule: { duration: 'p3600' }
    })
    return (
        <View>
            <Button title='save' onPress={() => { dispatch({ type: 'recurrenceRule', data: { fre: '야호' } }) }} />
            <Button title='save2' onPress={() => test()} />
            <Button title='find' onPress={() => testfe()} />
        </View>
    )
}