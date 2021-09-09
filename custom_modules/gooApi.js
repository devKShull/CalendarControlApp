
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useState, useEffect } from 'react'
import { View, Button, Alert, TextInput, TouchableOpacity, Text, Linking, StyleSheet } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';


const calendarTest = ({ navigation }) => {

    const [eId, setEid] = useState('1');

    const check = async () => {
        console.log("check func On")
        let res = await RNCalendarEvents.checkPermissions((readOnly = false))
        console.log(res);
        if (res != 'authorized') {
            await RNCalendarEvents.requestPermissions((readOnly = false))
            check();
        }
        else { setPerState(res); }
    }

    useEffect(() => {
        check();
    }, []);

    const [perState, setPerState] = useState();
    const TextHandle = (txt) => {
        setEid(
            txt
        )
        console.log(eId);
    }

    const findHandle = async () => {
        console.log('eId=>' + eId);
        var data = await RNCalendarEvents.findEventById(eId);
        console.log(data);
        if (data != null) {
            Alert.alert(data.title, '시작시간' + data.startDate + '\n종료시간' + data.endDate + '\nevent Id 값' + data.id + "\n위치" + data.location + '\n설명' + data.description);
        }
    }
    const fetchF = async () => {
        const res = await RNCalendarEvents.fetchAllEvents('2021-09-08T00:00:00.000Z', '2021-09-09T19:26:00.000Z');
        console.log(res);
        res.map((i) => { console.log(i.alarms) });
    }

    return (
        <View style={{ margin: 10, }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 1, alignSelf: 'center' }}>권한 상태: {perState}</Text>
                {/* {perState != "authorized" && <TouchableOpacity
                    onPress={() => {
                        RNCalendarEvents.requestPermissions((readOnly = false)).then(rs => { console.log(rs); setPerState(rs) })}}
                    style={Styles.touchesPer}>
                    <Text style={{ alignSelf: 'center', color: 'white' }}>request Permission</Text>
                </TouchableOpacity>} */}
            </View>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Calendar Finds"); }} style={Styles.touchs}><Text style={{ color: 'white' }}>캘린더 조회</Text></TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Create Calendars") }} style={Styles.touchs}><Text style={{ color: 'white' }}>캘린더 추가</Text></TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row' }}>
                {/* <TextInput style={{ flex: 1 }} onChangeText={txt => TextHandle(txt)} placeholder={"id for find events"} /> */}
                <TouchableOpacity
                    onPress={() => { navigation.navigate('Save Event Main') }}
                    style={{ flex: 1, justifyContent: 'center' }, Styles.touchs}>
                    <Text style={{ color: 'white' }}>일정 추가</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center' }, Styles.touchs}
                    onPress={() => findHandle()}
                >
                    <Text style={{ alignSelf: 'center', color: 'white' }}>find events</Text>
                </TouchableOpacity>
            </View>
            <Button
                onPress={() => { fetchF() }}
                title="fetch"
            />
            <Button
                onPress={() => {
                    if (Platform.OS === 'ios') {
                        Linking.openURL('calshow:');
                    } else if (Platform.OS === 'android') {
                        Linking.openURL('content://com.android.calendar/time/');
                    }
                }}
                title='Open Calendar App'
            />




        </View >
    );
}

const CustomDrawer = (props) => {

    return (
        <DrawerContentScrollView {...props} >
            <View>
                <Text>test drawer</Text>
            </View>
        </DrawerContentScrollView>
    )
}
const Drawer = createDrawerNavigator();
const gooApi = () => {
    return (
        <Drawer.Navigator
            initialRouteName="calTest"
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <Drawer.Screen name='calTest' component={calendarTest} />
        </Drawer.Navigator>
    );
}

const Styles = StyleSheet.create({
    touchs: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#5A18C9',
        height: 50,
        alignItems: 'center',
        margin: 5,

    },
    touchesPer: {
        backgroundColor: '#6666ff',
        flex: 1,
        height: 50,
        justifyContent: 'center'
    }
})

export default gooApi;