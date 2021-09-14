
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useState, useEffect } from 'react'
import { View, Button, Alert, TextInput, TouchableOpacity, Text, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';
import createCal from './createCal';
import findCal from './findCal';
import { Agenda, Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';


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
        fetchF();
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            fetchF();
        }, [])
    )
    const [perState, setPerState] = useState();
    const [calId, setCalId] = useState()

    const [items, setItems] = useState({});
    const [fin, setFin] = useState(false);
    const [fetchData, setFetchData] = useState({ start: '2020-12-01T00:00:00.000Z', end: '2021-10-30T19:26:00.000Z' })

    const fetchF = async () => {
        setFin(false);
        const res = await RNCalendarEvents.fetchAllEvents(fetchData.start, fetchData.end, calId);
        // console.log(res);
        // res.map((i) => { console.log(i.alarms); i.alarms.map((j) => { console.log(moment(j.date).format('YYYY-MM-DDTHH:mm:ss.000')) }) });
        res.map((i) => {
            const date = moment(i.startDate).format('YYYY-MM-DD');

            const during = { start: i.startDate, end: i.endDate }

            // setItems({ ...items, [date]: [{ 'name': i.title, 'id': i.id, 'during': during, 'alarms': i.alarms }] })
            items[date] = [{ 'name': i.title, 'id': i.id, 'during': during, 'alarms': i.alarms }]
            // 'id': i.id, 'during': during, 'alarms': i.alarms
        })
        let beforeDate = fetchData.start
        while (true) {
            if (moment(beforeDate).isBefore(fetchData.end)) {
                const date = moment(beforeDate).format("YYYY-MM-DD")
                if (items[date] == null) {
                    items[date] = [];
                }

                beforeDate = moment(beforeDate).add('1', 'd')
            } else {
                break;
            }
        }
        setFin(true)
        // setItems(itemList);
        // console.log(items);

    }

    const renderItem = (item) => {
        return (
            <View>
                <TouchableOpacity
                    style={[Styles.item, { height: item.height }]}
                    //just to have some style
                    onPress={() => { navigation.navigate('Save Event Main', { screen: 'Save Event', params: { eventId: item.id } }) }}
                //일정 수정
                // onPress={() => Alert.alert(item.name, item.alarms.date)}
                >
                    <Text>{item.name}</Text>
                    <Text>{moment(item.during.start).format("MM/DD  HH:MM")} ~</Text><Text>{moment(item.during.end).format("MM/DD  HH:MM")}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    onPress={() => { navigation.navigate('Save Event Main', { 'eventId': item.id }) }}
                    style={[{ justifyContent: 'center' }, Styles.touchs]}>
                    <Text style={{ color: 'white' }}>일정 수정</Text>
                </TouchableOpacity> */}
            </View>
        );
    }
    const renderEmptyDate = () => {
        return (
            <View style={Styles.emptyDate}><Text>This is empty date!</Text></View>
        );
    }
    const loadItems = (day) => {
        console.log(day);
        const loadDate = moment(day.dateString).format('YYYY-MM-01')
        console.log(loadDate)

    }


    return (
        // <View style={{ margin: 10, }}>

        //     <View style={{ flexDirection: 'row' }}>
        //         <Text style={{ flex: 1, alignSelf: 'center' }}>권한 상태: {perState}</Text>
        //         {/* {perState != "authorized" && <TouchableOpacity
        //             onPress={() => {
        //                 RNCalendarEvents.requestPermissions((readOnly = false)).then(rs => { console.log(rs); setPerState(rs) })}}
        //             style={Styles.touchesPer}>
        //             <Text style={{ alignSelf: 'center', color: 'white' }}>request Permission</Text>
        //         </TouchableOpacity>} */}
        //     </View>

        //     {/* <View style={{ flexDirection: 'row' }}>
        //         <TouchableOpacity
        //             onPress={() => { navigation.navigate("Calendar Finds"); }} style={Styles.touchs}><Text style={{ color: 'white' }}>캘린더 조회</Text></TouchableOpacity>
        //         <TouchableOpacity
        //             onPress={() => { navigation.navigate("Create Calendars") }} style={Styles.touchs}><Text style={{ color: 'white' }}>캘린더 추가</Text></TouchableOpacity>
        //     </View> */}
        //     {/* drawer 네비게이터로 옮김 */}



        //     <View style={{ flexDirection: 'row' }}>
        //         {/* <TextInput style={{ flex: 1 }} onChangeText={txt => TextHandle(txt)} placeholder={"id for find events"} /> */}
        //         <TouchableOpacity
        //             onPress={() => { navigation.navigate('Save Event Main') }}
        //             style={{ flex: 1, justifyContent: 'center' }, Styles.touchs}>
        //             <Text style={{ color: 'white' }}>일정 추가</Text>
        //         </TouchableOpacity>

        //     </View>
        //     <Button
        //         onPress={() => { fetchF() }}
        //         title="fetch"
        //     />
        //     {/* <Button
        //         onPress={() => {
        //             if (Platform.OS === 'ios') {
        //                 Linking.openURL('calshow:');
        //             } else if (Platform.OS === 'android') {
        //                 Linking.openURL('content://com.android.calendar/time/');
        //             }
        //         }}
        //         title='Open Calendar App'
        //     /> */}
        //     {/* open 삼성캘린더 */}




        // </View >

        <View style={{ height: heightPer }}>
            {fin ?
                <Agenda
                    items={items}
                    renderItem={renderItem}
                    renderEmptyDate={renderEmptyDate}
                    // hideKnob={true}
                    pastScrollRange={100}
                    futureScrollRange={100}
                    minDate={moment(fetchData.start).format('YYYY-MM-DD')}
                    maxDate={moment(fetchData.end).format('YYYY-MM-DD')}
                    loadItemsForMonth={loadItems}
                />
                : <ActivityIndicator size="large" />
            }

            <Button
                onPress={() => { fetchF() }}
                title="fetch"
            />
            <TouchableOpacity
                onPress={() => { navigation.navigate('Save Event Main') }}
                style={[{ justifyContent: 'center' }, Styles.touchs]}>
                <Text style={{ color: 'white' }}>일정 추가</Text>
            </TouchableOpacity>

        </View>




    );
}
const heightPer = '90%';



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
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
})

export default gooApi;