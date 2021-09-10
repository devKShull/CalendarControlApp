
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useState, useEffect } from 'react'
import { View, Button, Alert, TextInput, TouchableOpacity, Text, Linking, StyleSheet } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';
import FindCal from './findCal';
import createCal from './createCal';
import findCal from './findCal';
import { Agenda, Calendar } from 'react-native-calendars';


const calendarTest = ({ navigation }) => {

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

    const fetchF = async () => {
        const res = await RNCalendarEvents.fetchAllEvents('2021-09-09T00:00:00.000Z', '2021-09-10T19:26:00.000Z');
        console.log(res);
        res.map((i) => { console.log(i.alarms); i.alarms.map((j) => { console.log(moment(j.date).format('YYYY-MM-DDTHH:mm:ss.000')) }) });

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
            {/* <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Calendar Finds"); }} style={Styles.touchs}><Text style={{ color: 'white' }}>캘린더 조회</Text></TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Create Calendars") }} style={Styles.touchs}><Text style={{ color: 'white' }}>캘린더 추가</Text></TouchableOpacity>
            </View> */}
            {/* drawer 네비게이터로 옮김 */}
            <Calendar />
            <View style={{ flexDirection: 'row' }}>
                {/* <TextInput style={{ flex: 1 }} onChangeText={txt => TextHandle(txt)} placeholder={"id for find events"} /> */}
                <TouchableOpacity
                    onPress={() => { navigation.navigate('Save Event Main') }}
                    style={{ flex: 1, justifyContent: 'center' }, Styles.touchs}>
                    <Text style={{ color: 'white' }}>일정 추가</Text>
                </TouchableOpacity>

            </View>
            <Button
                onPress={() => { fetchF() }}
                title="fetch"
            />
            {/* <Button
                onPress={() => {
                    if (Platform.OS === 'ios') {
                        Linking.openURL('calshow:');
                    } else if (Platform.OS === 'android') {
                        Linking.openURL('content://com.android.calendar/time/');
                    }
                }}
                title='Open Calendar App'
            /> */}
            {/* open 삼성캘린더 */}




        </View >
    );
}

const CustomDrawer = (props) => {

    return (
        <DrawerContentScrollView {...props} >
            <View style={{ margin: 10 }}>
                <Text>Calendars</Text>
                {/* <FindCal /> */}
                {/* <Button title="추가" onPress={props.navigation.navigate('Create Cal')} /> */}
                <DrawerItemList {...props} />
                <DrawerItem label="button test" />
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
            <Drawer.Screen name='Calendar List' component={findCal} />
            <Drawer.Screen name='Create Cal' component={createCal} />
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