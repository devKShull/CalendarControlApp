import React, { useState, useRef } from 'react';
import * as calendarClass from './calendarClass';
import Toast from 'react-native-easy-toast';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';

export default CreateCalInterface = ({ navigation }) => {
    const [calData, setCalData] = useState({ title: '', name: '' }); // calenda 생성을 위해 커스텀 할 데이터 title 과 name 통합하여도 상관 없을것같음
    const [state, setState] = useState(true);
    const submitSave = async () => {
        if (calData.title == '') {
            //title 입력 검증
            toastRef.current.show('Title 을 입력하세요');
        } else if (calData.name == '') {
            //name 입력 검증
            toastRef.current.show('name 을 입력하세요');
        } else {
            setState(false); // 생성완료 및 토스트 타임아웃 끝날때 까지 save 버튼 비활성화
            Keyboard.dismiss();
            const res = await calendarClass.calCreateFunc(calData); // 생성된 캘린더 id 리턴
            setCalData({ title: '', name: '' });
            showToast(res);
            setTimeout(() => {
                setState(true);
                navigation.goBack();
            }, 1500);
        }
    };
    const toastRef = useRef();
    const showToast = (id) => {
        toastRef.current.show(calData.title + '캘린더가 생성되었습니다. id: ' + id, 2000);
    };

    return (
        <View style={{ margin: 15 }}>
            <View style={Styles.RowView}>
                <Text style={{ flex: 1 }}>Calendar Title</Text>
                <TextInput
                    style={{ flex: 2 }}
                    value={calData.title}
                    placeholder="testCalendar"
                    onChangeText={(text) => {
                        setCalData({ ...calData, ['title']: text });
                    }}
                />
            </View>
            <View style={Styles.RowView}>
                <Text style={{ flex: 1 }}>Calendar Name</Text>
                <TextInput
                    placeholder="testCalName"
                    value={calData.name}
                    style={{ flex: 2 }}
                    onChangeText={(text) => setCalData({ ...calData, ['name']: text })}
                />
            </View>

            <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => {
                    state && submitSave();
                }}>
                <Text style={{ fontSize: 20 }}>저장</Text>
            </TouchableOpacity>
            <Toast ref={toastRef} positionValue={200} fadeInDuration={200} fadeOutDuration={1000} style={{ backgroundColor: 'rgba(33, 87 ,243, 0.5)' }} />
        </View>
    );
};

const Styles = StyleSheet.create({
    RowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
