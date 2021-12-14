import React, { useState, useEffect, useCallback } from 'react'
import { View, Button, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import moment from 'moment';
import 'moment/locale/ko';
import * as calendarClass from './calendarClass'
import { useFocusEffect } from '@react-navigation/native';
import { Agenda } from 'react-native-calendars';
import { Icon, Fab, Header, Left, Right, Body, H1, H2 } from 'native-base';

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
    }) => {
        console.log('fetch ons')
        const res = await calendarClass.eventFetchFunc(fetchDate)
        setItems({ ...items, ...res });
    }

    useFocusEffect(useCallback( //포커스가 돌아왔을때 다시로딩
        () => {
            check();
        },
        [],
    ))

    const remove = async (id, title) => {    //이벤트 삭제
        const itemIndex = moment(title).format('YYYY-MM-DD');
        const res = items[itemIndex].filter(i => i.id != id)
        setItems({ ...items, [itemIndex]: res });
        console.log(items[itemIndex])
        const resBool = await calendarClass.eventRemoveFunc(id);
        console.log(resBool) // true or false
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
                        style={[styles.item, { height: item.height }, { justifyContent: 'center', alignItems: 'center' }]}
                        onPress={() => { remove(item.id, item.during.start); }}>
                        <Icon type="Feather" name="delete" />
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
        //changedDate 바뀐시점의 날짜
        const after = moment(changedDate).add(5, 'month')
        const before = moment(changedDate).subtract(5, 'month') //앞뒤로 5개월씩
        console.log(changedDate);
        if (moment(month.dateString).isBefore(before) || moment(month.dateString).isAfter(after)) { //스크롤된 날짜가 5개월범위 넘어갈 시
            console.log('loadDate on');
            const loadDate = { //새로 8개월씩 로딩
                start: moment(month.dateString).subtract(8, 'month').format('YYYY-MM-DDT00:00:00.000') + 'Z',
                //캘린더에서 날짜 선택시에도 작동되기때문에 시작시간도 필요
                end: moment(month.dateString).add(8, 'month').format('YYYY-MM-DDT00:00:00.000') + 'Z'
            }
            fetchF(loadDate);
            setChangedDate(month.dateString);
        }

    }

    return (
        <View style={{ height: '100%' }}>
            <Header style={{ backgroundColor: 'white' }}>
                <Left>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ alignSelf: 'center' }}>
                        <Icon type="Ionicons" name="menu-outline" />
                    </TouchableOpacity>

                </Left>
                <Body>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}> Calendar</Text>
                </Body>
                <Right >
                    <TouchableOpacity onPress={() => fetchF()} style={{ alignItems: 'center', marginRight: 10 }}>
                        <Icon type="Feather" name="refresh-ccw" style={{ fontSize: 23 }} />
                    </TouchableOpacity>
                </Right>
            </Header>
            <Agenda
                items={items}
                renderItem={renderItem}
                renderEmptyDate={renderEmptyDate}
                // hideKnob={true}
                pastScrollRange={100}
                futureScrollRange={100}
                loadItemsForMonth={loadItems}
            />
            <Fab
                position="bottomRight"
                onPress={() => { navigation.navigate('Save Event Main') }}>
                <Icon name="plus-circle" type="Feather" />
            </Fab>
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