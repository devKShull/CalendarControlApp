import React, { useState, useRef } from "react";
import calCreateFunc from "./calCreateFunc";
import Toast from "react-native-easy-toast";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";

export default CreateCalInterface = (props) => {

    const [calData, setCalData] = useState({ title: 'test', name: 'test' })
    const submitSave = async () => {
        const res = await calCreateFunc(calData);

        showToast(res);
    }
    const toastRef = useRef();
    const showToast = (id) => {
        toastRef.current.show(calData.title + '캘린더가 생성되었습니다. id: ' + id, 2000);
    }

    return (
        <View style={{ margin: 15 }}>
            <View style={Styles.RowView}>
                <Text style={{ flex: 1, }}>Calendar Title</Text>
                <TextInput style={{ flex: 2, }} placeholder="testCalendar" onChangeText={(text) => { setCalData({ ["title"]: text }) }} />
            </View>
            <View style={Styles.RowView}>
                <Text style={{ flex: 1, }}>Calendar Name</Text>
                <TextInput placeholder="testCalName" style={{ flex: 2, }} onChangeText={(text) => setCalData({ ['name']: text })} />
            </View>

            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { submitSave() }}><Text style={{ fontSize: 20 }}>저장</Text></TouchableOpacity>
            <Toast ref={toastRef}
                positionValue={200}
                fadeInDuration={200}
                fadeOutDuration={1000}
                style={{ backgroundColor: 'rgba(33, 87 ,243, 0.5)' }}
            />
        </View>
    )
}

const Styles = StyleSheet.create({
    RowView: {
        flexDirection: 'row',
        alignItems: 'center'
    }
}
)