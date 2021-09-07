import { TouchableOpacity, View, Text } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import RNCalendarEvents from 'react-native-calendar-events'
import Toast from 'react-native-easy-toast'


const findCal = ({ navigaitor }) => {
    // const [calendars, setCalendars] = useState(route.params)
    const toastRef = useRef();
    const showToast = (title) => {
        toastRef.current.show(title + '캘린더가 삭제되었습니다.', 1000);
    }
    let calendars;

    // const [calData, setCalData] = useState(() => {
    //     calendars.map((i, key) => {
    //         return (
    //             <TouchableOpacity key={key} onPress={() => { remove(i.id, key) }}>
    //                 <Text>{i.title}</Text>
    //             </TouchableOpacity>)
    //     })
    // })
    const [data, setData] = useState()
    const [data2, setData2] = useState()
    //const [googleCalData, setGoogleCalData] = useState()
    let googleCalData;
    // googleCalData.push(<Text key={'gD'}>Googl calendar Sources</Text>);
    // const [localCalData, setLocalCalData] = useState();
    let localCalData;
    // LocalCalData.push(<Text key={'lD'}>Local Calendar Source</Text>);

    useEffect(() => {
        //RNCalendarEvents.findCalendars().then(calendars);
        // console.log("USEEFEECT-------------------------------------");
        // console.log(calendars);
        console.log("Effect on")
        init();



        //console.log('GOOGLE: ' + googleCalData + 'LOCAL: ' + LocalCalData)

        return () => {
        }
    }, [calendars])
    const init = async () => {
        console.log("initOn")
        calendars = await RNCalendarEvents.findCalendars();
        console.log(calendars);

        googleCalData =
            calendars.filter((i) => {
                return (i.type === ('com.google'))
            })


        localCalData =
            calendars.filter((i) => {
                return i.type === ('LOCAL')
            }
            )


        console.log(googleCalData);
        console.log(localCalData);
        //
        setDatas();
    }

    const setDatas = () => {
        // calendars.map((i, key) => {
        //     if (i.type == ("com.google")) {
        //         setGoogleCalData(
        //             ...googleCalData,
        //             {
        //                 id: i.id,
        //                 key: key,
        //                 title: i.title
        //             })
        //     }
        //     else if (i.type == ("LOCAL")) {
        //         setLocalCalData(
        //             ...localCalData,
        //             {
        //                 id: i.id,
        //                 key: key,
        //                 title: i.title
        //             })
        //     }

        // })


        setData(
            googleCalData.map((i, key) => {
                return (
                    <View key={key}>
                        <TouchableOpacity onPress={() => { remove(i.id, key, i.title) }}>
                            <Text>{i.title}</Text>
                        </TouchableOpacity>
                    </View>
                )
            })
        )
        setData2(
            localCalData.map((i, key) => {
                return (
                    <View key={key}>
                        <TouchableOpacity onPress={() => { remove(i.id, key, i.title) }}>
                            <Text>{i.title}</Text>
                        </TouchableOpacity>
                    </View>
                )
            })
        )

        // setData(
        //     ...data,
        //     calendars.map((i, key) => {
        //         if (i.type == ("LOCAL")) {
        //             return (
        //                 <View key={key}>
        //                     <Text >Local Calendar Source</Text>
        //                     <TouchableOpacity onPress={() => { remove(i.id, key) }}>
        //                         <Text>{i.title}</Text>
        //                     </TouchableOpacity>
        //                 </View>
        //             )
        //         }
        //     })
        // )

    }
    //console.log(data);
    // RNCalendarEvents.findCalendars().then((val) => { calendars = val.map((ti) => { return ti.title }) })

    // useEffect(() => {
    //     calendars = RNCalendarEvents.findCalendars().then(calendars);
    //     console.log(calendars);
    //     // const res = calendars._W.map(i => { return (i.tittle) })
    //     console.log(res);
    //     return () => {

    //     }
    // }, [])

    // const [act, setAct] = useState(false)
    const remove = async (id, key, title) => {
        console.log(await RNCalendarEvents.removeCalendar(id));
        // await setCalendars(calendars.filter((i) => { return i.id !== id }));
        calendars = calendars.filter((i) => { return i.id !== id });
        console.log("********************************************");
        console.log(calendars);
        init();
        console.log(googleCalData)
        console.log(localCalData)
        setDatas();
        showToast(title);
        // console.log(calendars);

    }
    const Active = () => {
        console.log("Active On:\n");


        return (
            <View>
                <Text style={{ fontSize: 25, fontWeight: 'bold', }}>Google Calendars</Text>
                {data}
                <Text style={{ fontSize: 25, fontWeight: 'bold', }}>Local Calendars</Text>
                {data2}
            </View>


        )

    }

    return (
        <View style={{ margin: 15, }}>
            {/* <TouchableOpacity onPress={() => { console.log(data.type) }}><Text>touch</Text></TouchableOpacity> */}

            <Active />
            <Text style={{ textAlign: 'right' }}>터치시 캘린더가 삭제됩니다</Text>
            <Toast
                fadeInDuration={200}
                fadeOutDuration={500}
                ref={toastRef}
                positionValue={200} />
        </View>
    )
}

// const vl = [];
// vl.push(<View></View>);
export default findCal;