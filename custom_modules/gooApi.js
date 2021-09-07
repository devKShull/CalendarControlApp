
import React, { useState, useEffect } from 'react'
import { View, Button, Alert, TextInput, TouchableOpacity, Text, Linking, StyleSheet } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';


const gooApi = ({ navigation }) => {


    // RNCalendarEvents.saveEvent('Title of event', {
    //     id: '151',
    //     startDate: '2021-09-18T19:26:00.000Z',
    //     endDate: '2021-09-19T19:26:00.000Z'
    // })
    // var calData = RNCalendarEvents.findCalendars().then((val) => { calData = val.map((ti) => { return ti.title }) })
    const [eId, setEid] = useState('1');

    // const nv = navigation.addListener('focus', () => {
    //     check();

    // })
    const check = async () => {
        console.log("check func On")
        let res = await RNCalendarEvents.checkPermissions((readOnly = false))
        console.log(res);
        setPerState(res);
        // res = await RNCalendarEvents.findCalendars();
        // console.log(res);
        // calData = res;

    }

    useEffect(() => {
        check();
    }, []);
    // const [calData, setCalData] = useState();
    let calData;
    const [perState, setPerState] = useState();
    const TextHandle = (txt) => {
        setEid(
            txt
        )
        console.log(eId);
    }
    // const calVal = {
    //     id: '15',
    //     title: 'testCalendar',
    //     source: {
    //         name: "rhkstn0303@gmail.com",
    //         isLocalAccount: false,
    //         type: "com.google"
    //     },
    //     name: "testCalName",
    //     color: "#D75F64",
    //     isPrimary: 'false',
    //     accessLevel: 'editor',
    //     allowedAvailabilities: ['busy', 'free'],
    //     ownerAccount: 'rhkstn0303@gmail.com',

    // }

    const findHandle = async () => {
        console.log('eId=>' + eId);
        var data = await RNCalendarEvents.findEventById(eId);
        console.log(data);
        if (data != null) {
            Alert.alert(data.title, '시작시간' + data.startDate + '\n종료시간' + data.endDate + '\nevent Id 값' + data.id + "\n위치" + data.location + '\n설명' + data.description);
        }
    }




    // RNCalendarEvents.findCalendars().then(rs => console.log(rs))
    return (
        <View style={{ margin: 10, }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 1, alignSelf: 'center' }}>Permission State: {perState}</Text>
                {perState != "authorized" && <TouchableOpacity
                    onPress={() => {
                        RNCalendarEvents.requestPermissions((readOnly = false)).then(rs => { console.log(rs); setPerState(rs) })

                    }}
                    style={Styles.touches}>
                    <Text style={{ alignSelf: 'center', color: 'white' }}>request Permission</Text>
                </TouchableOpacity>}

            </View>
            <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Calendar Finds"); }} style={Styles.touchs}><Text style={{ color: 'white' }}>find calendar</Text></TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Create Calendars") }} style={Styles.touchs}><Text style={{ color: 'white' }}>saveCalendar</Text></TouchableOpacity>
            </View>
            <Button
                onPress={() => { navigation.navigate('Save Event') }}
                title="save Events"
            />
            <View style={{ flexDirection: 'row' }}>
                <TextInput style={{ flex: 1 }} onChangeText={txt => TextHandle(txt)} placeholder={"id for find events"} />
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center' }, Styles.touchs}
                    onPress={() => findHandle()}


                >
                    <Text style={{ alignSelf: 'center', color: 'white' }}>find events</Text>
                </TouchableOpacity>
            </View>
            <Button
                onPress={() => {
                    RNCalendarEvents.fetchAllEvents('2021-09-03T00:00:00.000Z', '2021-09-30T19:26:00.000Z').then(rs => console.log(rs))
                }}
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

const Styles = StyleSheet.create({
    touchs: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#5A18C9',
        height: 50,
        alignItems: 'center',
        margin: 5,

    },
    touches: {
        backgroundColor: '#6666ff',
        flex: 1,
        height: 50,
        justifyContent: 'center'
    }
})

export default gooApi;