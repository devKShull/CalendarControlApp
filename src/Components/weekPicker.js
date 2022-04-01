import CheckBox from '@react-native-community/checkbox';
import React, { useState, useReducer, useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as ActionTypeConst from '../reducers/ActionTypeConst';
const weekPicker = () => {
    const weeks = useSelector((state) => {
        return state.week;
    });
    const dispatch = useDispatch();
    // const { weeks, setWeeks } = useContext(weekContext);
    // const reducer = (state, action) => {
    //     // 체크박스 value
    //     switch (action.type) {
    //         case 0:
    //             return { ...state, mo: action.data };
    //         case 1:
    //             return { ...state, tu: action.data };
    //         case 2:
    //             return { ...state, we: action.data };
    //         case 3:
    //             return { ...state, th: action.data };
    //         case 4:
    //             return { ...state, fr: action.data };
    //         case 5:
    //             return { ...state, sa: action.data };
    //         case 6:
    //             return { ...state, su: action.data };
    //         default:
    //             break;
    //     }
    // };
    // const [checkWeek, dispatch] = useReducer(reducer, {
    //     mo: false,
    //     tu: false,
    //     we: false,
    //     th: false,
    //     fr: false,
    //     sa: false,
    //     su: false,
    // });
    // const getIndex = (val) => {
    //     switch (val) {
    //         case 'MO':
    //             return 0;
    //         case 'TU':
    //             return 1;
    //         case 'WE':
    //             return 2;
    //         case 'TH':
    //             return 3;
    //         case 'FR':
    //             return 4;
    //         case 'SA':
    //             return 5;
    //         case 'SU':
    //             return 6;
    //     }
    // };
    // const set = (val, when) => {
    //     if (val) {
    //         setWeeks([...weeks, when]); //알림 추가
    //     } else {
    //         setWeeks(weeks.filter((i) => i.date != when)); //알림 삭제
    //     }
    // };
    const onChangeListener = (val) => {
        console.log(weeks);
        if (weeks.includes(val)) {
            console.log('sub 가동');
            dispatch({ type: 'sub', data: val });
        } else {
            dispatch({ type: 'add', data: val });
        }
    };
    const includeCheck = (val) => {
        if (weeks.includes(val)) {
            return true;
        } else {
            return false;
        }
    };
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
                value={includeCheck(ActionTypeConst.MONDAY)}
                onValueChange={(val) => {
                    // dispatch({ type: 0, data: val });
                    // set(val, 'MO');
                    onChangeListener(ActionTypeConst.MONDAY);
                }}
            />
            <Text>월</Text>
            <CheckBox
                value={includeCheck(ActionTypeConst.TUESDAY)}
                onValueChange={(val) => {
                    onChangeListener(ActionTypeConst.TUESDAY);
                }}
            />
            <Text>화</Text>
            <CheckBox
                value={includeCheck(ActionTypeConst.WENDSDAY)}
                onValueChange={(val) => {
                    onChangeListener(ActionTypeConst.WENDSDAY);
                }}
            />
            <Text>수</Text>
            <CheckBox
                value={includeCheck(ActionTypeConst.THURSDAY)}
                onValueChange={(val) => {
                    onChangeListener(ActionTypeConst.THURSDAY);
                }}
            />
            <Text>목</Text>
            <CheckBox
                value={includeCheck(ActionTypeConst.FRIDAY)}
                onValueChange={(val) => {
                    onChangeListener(ActionTypeConst.FRIDAY);
                }}
            />
            <Text>금</Text>
            <CheckBox
                value={includeCheck(ActionTypeConst.SATERDAY)}
                onValueChange={(val) => {
                    onChangeListener(ActionTypeConst.SATERDAY);
                }}
            />
            <Text>토</Text>
            <CheckBox
                value={includeCheck(ActionTypeConst.SUNDAY)}
                onValueChange={(val) => {
                    onChangeListener(ActionTypeConst.SUNDAY);
                }}
            />
            <Text>일</Text>
        </View>
    );
};
export default weekPicker;
