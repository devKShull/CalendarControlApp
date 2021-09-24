import React, { useEffect, useReducer, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import CheckBox from '@react-native-community/checkbox'

export default calAlarmSetInterface = ({ navigation, route }) => {   // 캘린더 알림 선택 화면
    const [alarmsParams, setAlarmsParams] = useState([]);   //알림 데이터
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
        if (route.params != null) {
            const res = route.params
            console.log('alarmCal');
            console.log(res);
            setAlarmsParams(res);   //알림설정 변경 시 기존에 선택했던 alarms 데이터를 route로 받아옴 
            res.map((i) => {        //switch 사용시 break 사용 주의
                dispatch({ type: i.date })
            })
        }
    }
    const setAlarms = (val, when) => {
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
const styles = StyleSheet.create({
    checkStyle: {
        flexDirection: 'row',
        marginVertical: 15,
        alignItems: 'center'
    }
})