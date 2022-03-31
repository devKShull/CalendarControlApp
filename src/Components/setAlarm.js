import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export default calAlarmSetInterface = ({ navigation, route }) => {
    // 캘린더 알림 선택 화면
    const [alarmsParams, setAlarmsParams] = useState([]); //알림 데이터
    const reducer = (state, action) => {
        // 체크박스 value
        switch (action.type) {
            case 0:
                return { ...state, zero: action.data }; //알림시작시간
            case 10:
                return { ...state, ten: action.data }; //알림 10분전
            case 60:
                return { ...state, hour: action.data }; //알림 60분전
            case 1440:
                return { ...state, day: action.data }; //알림 하루전
            default:
                break;
        }
    };
    const [checkBool, dispatch] = useReducer(reducer, {
        //체크박스 체크벨류
        zero: false,
        ten: false,
        hour: false,
        day: false,
    });
    useEffect(() => {
        init();
    }, [route]);

    const init = () => {
        if (route.params != null) {
            //이전에 설정한 알림데이터 route.params
            const res = route.params;
            console.log('alarmCal');
            console.log(res);
            setAlarmsParams(res); //알림데이터 변경
            res.map((i) => {
                //체크박스 value 변경
                dispatch({ type: i.date });
            });
        }
    };

    const setAlarms = (val, when) => {
        if (val) {
            setAlarmsParams([...alarmsParams, { ['date']: when }]); //알림 추가
        } else {
            setAlarmsParams(alarmsParams.filter((i) => i.date != when)); //알림 삭제
        }
    };

    return (
        <View>
            <View style={{ padding: 20 }}>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={checkBool.zero}
                        disabled={false}
                        onValueChange={(val) => {
                            dispatch({ type: 0, data: val });
                            setAlarms(val, 0);
                        }}
                    />
                    <Text style={{ fontSize: 25 }}>일정 시작시간</Text>
                </View>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={checkBool.ten}
                        disabled={false}
                        onValueChange={(val) => {
                            dispatch({ type: 10, data: val });
                            setAlarms(val, 10);
                        }}
                    />
                    <Text style={{ fontSize: 25 }}>10분 전</Text>
                </View>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={checkBool.hour}
                        disabled={false}
                        onValueChange={(val) => {
                            dispatch({ type: 60, data: val });
                            setAlarms(val, 60);
                        }}
                    />
                    <Text style={{ fontSize: 25 }}>1시간 전</Text>
                </View>
                <View style={styles.checkStyle}>
                    <CheckBox
                        value={checkBool.day}
                        disabled={false}
                        onValueChange={(val) => {
                            dispatch({ type: 1440, data: val });
                            setAlarms(val, 1440);
                        }}
                    />
                    <Text style={{ fontSize: 25 }}>1일 전</Text>
                </View>
                <Button
                    title="저장"
                    onPress={() => {
                        navigation.navigate('Save Event', { alarmsParams });
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    checkStyle: {
        flexDirection: 'row',
        marginVertical: 15,
        alignItems: 'center',
    },
});
