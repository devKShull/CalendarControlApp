import { View, Text, Button, StyleSheet } from "react-native";
import RNCalendarEvents from "react-native-calendar-events";
import React, { useRef } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from 'react-native-easy-toast';


export default createCal = ({ navigation }) => {
    let calInfO = {
        title: 'testCalendar',
        source: {
            name: "calendar control sample App",
            isLocalAccount: false,
            type: "LOCAL"
        },
        name: "testCalName",
        color: "#D75F64",
        isPrimary: 'false',
        accessLevel: 'editor',
        allowedAvailabilities: ['busy', 'free'],
        ownerAccount: 'LOCAL',
    }
    const submitSave = async () => {
        console.log("setSave");
        const id = await RNCalendarEvents.saveCalendar(calInfO);
        console.log(id);

        navigation.goBack(calInfO.title, id);
        showToast();
    }
    const toastRef = useRef();
    const showToast = () => {
        toastRef.current.show(calInfO.title + '캘린더가 생성되었습니다. id:' + id, 2000);
    }

    return (
        <View style={{ margin: 15 }}>
            <View style={Styles.RowView}>
                <Text style={{ flex: 1, }}>Calendar Title</Text>
                <TextInput style={{ flex: 2, }} placeholder="testCalendar" onChangeText={(text) => { calInfO.title = text }} />
            </View>
            <View style={Styles.RowView}>
                <Text style={{ flex: 1, }}>Calendar Name</Text>
                <TextInput placeholder="testCalName" style={{ flex: 2, }} onChangeText={(text) => calInfO.name} />
            </View>
            <View style={Styles.RowView}>
                <Text style={{ flex: 0.5 }}>Type</Text>

                <DropDownPicker
                    style={{ width: 150 }}
                    containerStyle={{ flex: 1 }}
                    itemStyle={{
                        justifyContent: 'flex-start',
                        backgroundColor: 'pink',
                    }}
                    dropDownMaxHeight={200}
                    placeholder="choose"
                    items={[
                        { label: 'Local', value: 'LOCAL' },
                        { label: 'gmail.com', value: 'com.google' }
                    ]}
                    value={null}
                    onChangeItem={(item) => { calInfO.source.type = item }}
                    multiple={true}

                />

            </View>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { submitSave() }}><Text style={{ fontSize: 20 }}>Submit</Text></TouchableOpacity>
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