import React, { useState, useEffect, useCallback } from 'react'
import { View, Button, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import moment from 'moment';
import * as calendarClass from './calendarClass'
import { useFocusEffect } from '@react-navigation/native';
import { Agenda } from 'react-native-calendars';


export default calAgendaInterface = ({ navigation }) => {
    const [items, setItems] = useState({});
    const [changedDate, setChangedDate] = useState(new Date());
    const check = async () => { //권한 체크
        const res = await calendarClass.permissionCheck() // authorized => 허용, restricted, denied => 거부
        if (res == 'authorized') {
            fetchF();
        }
    }

    const fetchF = async (fetchDate = {
        start: moment(changedDate).subtract(8, 'month').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
        end: moment(changedDate).add(8, 'month').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
        // start: moment(changedDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
        // end: moment(changedDate).add(1, 'month').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
    }) => {
        console.log('fetch ons')
        const res = await calendarClass.eventFetchFunc(fetchDate)
        setItems(res);

    }

    useEffect(() => { // 초기 셋팅
        check();
    }, [])

    useFocusEffect(useCallback( //포커스가 돌아왔을때 다시로딩
        () => {
            fetchF();
        },
        [],
    ))

    const remove = async (id, title) => {    //이벤트 삭제

        // const itemIndex = moment(title).format('YYYY-MM-DD');
        // const res = items[itemIndex].filter(i => i.id != id)
        // setItems({ ...items, [itemIndex]: res });
        // console.log(items[itemIndex])
        const resBool = await calendarClass.eventRemoveFunc(id);
        console.log(resBool) // true or false
        fetchF();
    }

    const renderItem = (item) => { //아이템 렌더링
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 3 }}>
                    <TouchableOpacity
                        style={[styles.item, { height: item.height }]}
                        onPress={() => { navigation.navigate('Save Event Main', { screen: 'Save Event', params: { eventId: item.id } }) }}//일정 수정
                    >
                        <Text>{item.name}</Text>
                        <Text>{moment(item.during.start).format("MM/DD  HH:mm")} ~</Text><Text>{moment(item.during.end).format("MM/DD  HH:mm")}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        style={[styles.item, { height: item.height }]}
                        onPress={() => { remove(item.id, item.during.start); }}>
                        <Text>
                            삭제
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const renderEmptyDate = () => { // 빈 아이템 렌더링
        return (
            <View></View>
        );
    }

    const loadItems = (month) => { // 스크롤 시 작동하는 함수 
        console.log(month);
        const after = moment(changedDate).add(5, 'month')
        const before = moment(changedDate).subtract(5, 'month')
        console.log(changedDate);
        if (moment(month.dateString).isBefore(before) || moment(month.dateString).isAfter(after)) {
            console.log('loadDate on');
            const loadDate = {
                start: moment(month.dateString).subtract(8, 'month').format('YYYY-MM-DDT00:00:00.000') + 'Z',
                end: moment(month.dateString).add(8, 'month').format('YYYY-MM-DDT00:00:00.000') + 'Z'
                // start: moment(month.dateString).format('YYYY-MM-DDT00:00:00.000') + 'Z',
                // end: moment(month.dateString).add(1, 'month').format('YYYY-MM-DDT00:00:00.000') + 'Z'
            }
            fetchF(loadDate);
            setChangedDate(month.dateString);
        }

    }

    return (
        <View style={{ height: '90%' }}>
            <Agenda
                items={items}
                renderItem={renderItem}
                renderEmptyDate={renderEmptyDate}
                // hideKnob={true}
                pastScrollRange={100}
                futureScrollRange={100}
                loadItemsForMonth={loadItems}
            />

            <Button
                onPress={() => { fetchF() }}
                title="새로고침"
            />
            <TouchableOpacity
                onPress={() => { navigation.navigate('Save Event Main') }}
                style={[{ justifyContent: 'center' }, styles.touchs]}>
                <Text style={{ color: 'white' }}>일정 추가</Text>
            </TouchableOpacity>

        </View>
    )
}
const styles = StyleSheet.create(
    {
        touchs: {
            justifyContent: 'center',
            backgroundColor: '#5A18C9',
            height: 50,
            alignItems: 'center',
            margin: 5,

        },
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