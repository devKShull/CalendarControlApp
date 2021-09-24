import React, { useCallback, useState, useRef, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import Toast from "react-native-easy-toast";
import { useFocusEffect } from "@react-navigation/native";
import calRemoveFunc from "./calRemoveFunc";
import calFetchFunc from "./calFetchFunc";

export default calendarFetchInterface = () => {
    const [active, setActive] = useState()
    const [isRemove, setIsRemove] = useState(false)
    const toastRef = useRef();
    useEffect(() => {
        init()
    }, [isRemove])
    useFocusEffect(useCallback(
        () => {
            init()
        },
        [],
    ))


    const init = async () => {
        const data = await calFetchFunc();
        console.log(data.google)
        setActive(
            <View>
                {data.google != '' && <Text style={{ fontSize: 25, fontWeight: 'bold', }}>Google Calendars</Text>}

                {data.google.map((i, key) => {
                    return (
                        <TouchableOpacity key={key} onPress={() => {
                            console.log(isRemove);
                            if (isRemove) { remove(i.id); showToast(i.title) }
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
                {(data.google == '' && data.local == '' && data.samsung == '') && <Text style={{ fontSize: 25, fontWeight: 'bold', }}>캘린더가 없습니다.</Text>}
            </View>
        )
    }
    const remove = async (id) => {
        console.log('remove on')
        await calRemoveFunc(id);
        init();
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