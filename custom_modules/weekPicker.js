import CheckBox from "@react-native-community/checkbox";
import React, { useState, useReducer, useContext } from "react";
import { View, Text } from "react-native";
import { weekContext } from "./eventSaveMainInterface";

const weekPicker = () => {
    const { weeks, setWeeks } = useContext(weekContext);
    const reducer = (state, action) => { // 체크박스 value 
        switch (action.type) {
            case 0:
                return { ...state, 'mo': action.data }
            case 1:
                return { ...state, 'tu': action.data }
            case 2:
                return { ...state, 'we': action.data }
            case 3:
                return { ...state, 'th': action.data }
            case 4:
                return { ...state, 'fr': action.data }
            case 5:
                return { ...state, 'sa': action.data }
            case 6:
                return { ...state, 'su': action.data }
            default:
                break;
        }
    }
    const [checkWeek, dispatch] = useReducer(reducer, {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
    })

    const set = (val, when) => {
        if (val) {
            setWeeks([...weeks, when]) //알림 추가
        } else {
            setWeeks(weeks.filter(i => i.date != when)); //알림 삭제
        }
    }
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
                value={checkWeek.mo}
                onValueChange={(val) => { dispatch({ type: 0, data: val }); set(val, 'MO') }} />
            <Text>월</Text>
            <CheckBox
                value={checkWeek.tu}
                onValueChange={(val) => { dispatch({ type: 1, data: val }); set(val, 'TU') }} />
            <Text>화</Text>
            <CheckBox
                value={checkWeek.we}
                onValueChange={(val) => { dispatch({ type: 2, data: val }); set(val, 'WE') }} />
            <Text>수</Text>
            <CheckBox
                value={checkWeek.th}
                onValueChange={(val) => { dispatch({ type: 3, data: val }); set(val, 'TH') }} />
            <Text>목</Text>
            <CheckBox
                value={checkWeek.fr}
                onValueChange={(val) => { dispatch({ type: 4, data: val }); set(val, 'FR') }} />
            <Text>금</Text>
            <CheckBox
                value={checkWeek.sa}
                onValueChange={(val) => { dispatch({ type: 5, data: val }); set(val, 'SA') }} />
            <Text>토</Text>
            <CheckBox
                value={checkWeek.su}
                onValueChange={(val) => { dispatch({ type: 6, data: val }); set(val, 'SU') }} />
            <Text>일</Text>

        </View>
    )

}
export default weekPicker
