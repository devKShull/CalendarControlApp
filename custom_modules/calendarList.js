import React, { useCallback, useState, useRef, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import Toast from "react-native-easy-toast";
import { useFocusEffect } from "@react-navigation/native";
import * as calendarClass from './calendarClass'

export default calendarFetchInterface = () => {
    const [active, setActive] = useState() // component state
    const [isRemove, setIsRemove] = useState(false) // 삭제모드
    const toastRef = useRef();

    useFocusEffect(useCallback(
        () => {
            init()
        },
        [isRemove],// isRemove 가 true나 false 로 변할시 TouchableOpacity 의 onPress 변경 및 렌더링을 위해 init() 호출
    ))
    const init = async () => {
        const data = await calendarClass.calFetchFunc();
        setActive(
            <View>
                {data.google != '' && <Text style={{ fontSize: 25, fontWeight: 'bold', }}>Google Calendars</Text>}
                {data.google.map((i, key) => {
                    return (
                        <TouchableOpacity key={key} onPress={() => {
                            console.log(isRemove);
                            if (isRemove) { remove(i.id); showToast(i.title) } //remove 가 true 일때만 삭제됨
                        }}>
                            <Text>{i.title}</Text>
                        </TouchableOpacity>
                    )
                })}

                {data.local != '' && <Text style={{ fontSize: 25, fontWeight: 'bold', }}>Local Calendars</Text>}
                {data.local.map((i, key) => {
                    return (
                        <TouchableOpacity key={key} onPress={() => {
                            console.log(isRemove);
                            if (isRemove) { remove(i.id); showToast(i.title) }
                        }}>
                            <Text>{i.title}</Text>
                        </TouchableOpacity>
                    )
                })}
                {data.samsung != '' && <Text style={{ fontSize: 25, fontWeight: 'bold', }}>Samsung Calendars</Text>}
                {data.samsung.map((i, key) => {
                    return (
                        <TouchableOpacity key={key} onPress={() => {
                            console.log(isRemove);
                            if (isRemove) { remove(i.id); showToast(i.title) }
                        }}>
                            <Text>{i.title}</Text>
                        </TouchableOpacity>
                    )
                })}
                {data.icloud != '' && <Text style={{ fontSize: 25, fontWeight: 'bold', }}>iCloud Calendars</Text>}
                {data.icloud.map((i, key) => {
                    return (
                        <TouchableOpacity key={key} onPress={() => {
                            console.log(isRemove);
                            if (isRemove) { remove(i.id); showToast(i.title) }
                        }}>
                            <Text>{i.title}</Text>
                        </TouchableOpacity>
                    )
                })}
                {data.others != '' && <Text style={{ fontSize: 25, fontWeight: 'bold', }}>Other Calendars</Text>}
                {data.others.map((i, key) => {
                    return (
                        <TouchableOpacity key={key} onPress={() => {
                            console.log(isRemove);
                            if (isRemove) { remove(i.id); showToast(i.title) }
                        }}>
                            <Text>{i.title}</Text>
                        </TouchableOpacity>
                    )
                })}
                {(data.google == '' && data.local == '' && data.samsung == '' && data.others == '' &&data.icloud == '') && <Text style={{ fontSize: 25, fontWeight: 'bold', }}>캘린더가 없습니다.</Text>}
            </View>
        )
    }
    const remove = async (id) => {
        console.log('remove on')
        await calendarClass.calRemoveFunc(id);
        init();// 삭제된 캘린더를 없애고 다시 렌더링
    }

    const showToast = (title) => {
        toastRef.current.show(title + '캘린더가 삭제되었습니다.', 1000);
    }

    return (
        <View style={{ margin: 15, }}>
            {active}
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                <Text style={{ textAlign: 'right' }}>삭제</Text>
                <Switch
                    value={isRemove}
                    onValueChange={(val) => { setIsRemove(val); console.log(isRemove) }} />
            </View>
            {isRemove && <Text style={{ textAlign: 'right' }}>터치시 캘린더가 삭제됩니다</Text>}
            <Toast
                fadeInDuration={200}
                fadeOutDuration={500}
                ref={toastRef}
                positionValue={200} />

        </View>
    )
}