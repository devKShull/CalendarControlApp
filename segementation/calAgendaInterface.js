import React, { useState, useEffect, useCallback } from 'react'
import { View, Button, Alert, TextInput, TouchableOpacity, Text, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import moment from 'moment';
import permissionCheck from './permissionCheck';
import eventFetchFunc from './eventFetchFunc';
import { useFocusEffect } from '@react-navigation/native';
import { Agenda } from 'react-native-calendars';
export default calAgendaInterface = () => {
    const [perState, setPerState] = useState();
    const [items, setItems] = useState({});
    const [fin, setFin] = useState(false);
    const [fetchData, setFetchData] = useState({ start: '2020-12-01T00:00:00.000Z', end: '2021-10-30T19:26:00.000Z' })

    const check = async () => {
        const res = await permissionCheck()
        setPerState(res);
    }

    const fetchF = async () => {
        setFin(false);
        if (perState == 'authorized') {
            const res = await eventFetchFunc(fetchData)
            setItems(res);
            setFin(true);
        } else {
            // Alert.alert('경고', '권한이 필요합니다.');
            check();
        }
    }

    useEffect(() => {
        check();
        fetchF();
    }, [])
    useFocusEffect(useCallback(
        () => {
            fetchF();
        },
        [],
    ))

    const renderItem = (item) => {
        return (
            <View>
                <TouchableOpacity
                    style={[styles.item, { height: item.height }]}

                //onPress={() => { navigation.navigate('Save Event Main', { screen: 'Save Event', params: { eventId: item.id } }) }}
                //일정 수정
                // onPress={() => Alert.alert(item.name, item.alarms.date)}
                >
                    <Text>{item.name}</Text>
                    <Text>{moment(item.during.start).format("MM/DD  HH:mm")} ~</Text><Text>{moment(item.during.end).format("MM/DD  HH:mm")}</Text>
                </TouchableOpacity>

            </View>
        );
    }
    const renderEmptyDate = () => {
        return (
            <View></View>
        );
    }
    const loadItems = (day) => {
        console.log(day);
        const loadDate = moment(day.dateString).format('YYYY-MM-01')
        console.log(loadDate)

    }
    const heightPer = '70%'
    return (
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
                title="새로고침"
            />
            {/* <TouchableOpacity
                onPress={() => { navigation.navigate('Save Event Main') }}
                style={[{ justifyContent: 'center' }, Styles.touchs]}>
                <Text style={{ color: 'white' }}>일정 추가</Text>
            </TouchableOpacity> */}

        </View>
    )
}
const styles = StyleSheet.create(
    {
        item: {
            backgroundColor: 'white',
            flex: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            marginTop: 17
        },
    }
)