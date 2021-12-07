import RNCalendarEvents from "../cal";
import moment from 'moment';
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

// 권한 체크 함수 authorized 가 아닐시 권한 요청
export async function permissionCheck() {
    while (true) {
        console.log("check func On")
        let res = await RNCalendarEvents.checkPermissions((readOnly = false))
        console.log(res);
        if (res != 'authorized') {
            await RNCalendarEvents.requestPermissions((readOnly = false))
        }
        else { return res } // res authorized denied restricted
    }
}
// 캘린더 생성 함수 params = {title, name} 
export async function calCreateFunc(params) {
    let calInfO = {
        title: params.title,
        source: {
            name: "calendar control sample App",
            isLocalAccount: true,
            type: "LOCAL"
        },
        name: params.name,
        color: "#D75F64",
        isPrimary: 'false',
        accessLevel: 'editor',
        allowedAvailabilities: ['busy', 'free'],
        ownerAccount: 'LOCAL',
        entityType: 'event',
    }
    const id = await RNCalendarEvents.saveCalendar(calInfO)
    console.log(id);
    console.log("id");

    return id
}
// 캘린더 삭제 함수
export async function calRemoveFunc(id) {
    const res = await RNCalendarEvents.removeCalendar(id)
    return res // bool true or false
}
// 캘린더 조회 함수
export async function calFetchFunc() {
    const res = await RNCalendarEvents.findCalendars()
    const googleCalData = res.filter((i) => { //구글 캘린더 필터링
        return (i.type === ('com.google'))
    });
    const localCalData = res.filter((i) => { //로컬 캘린더 필터링
        return (i.type === ('LOCAL') || i.source === ('Default'))
    })
    const samCalData = res.filter((i) => {//삼성 캘린더 필터링
        return (i.type === ('com.osp.app.signin'))
    })
    const otherCalendars = res.filter((i) => {//삼성 캘린더 필터링
        return (i.source === ('Other'))
    })
    const parsingRes = { google: googleCalData, local: localCalData, samsung: samCalData, others: otherCalendars }
    return parsingRes
    // parsingRes = { 리턴 데이터
    //     google: [{
    //         "allowedAvailabilities": ["busy", "free"],
    //         "allowsModifications": false, "color": "", "id": "", "isPrimary": false,
    //         "source": "~~~@gmail.com", "title": "대한민국의 휴일", "type": "com.google"
    //     }, ....],
    //     local: [{
    //         "allowedAvailabilities": ["busy", "free"],
    //         "allowsModifications": false, "color": "", "id": "", "isPrimary": false,
    //         "source": "~~~@gmail.com", "title": "", "type": "LOCAL"
    //     }],
    //     samsung: [{
    //         "allowedAvailabilities": ["busy", "free"],
    //         "allowsModifications": false, "color": "", "id": "", "isPrimary": false,
    //         "source": "~~~@gmail.com", "title": "", "type": ""
    //     }]
    // }

}
export async function eventSaveFunc(eventTitle, eventData, exception = null) {
    console.log('//////////////////////////')
    console.log(eventData);
    console.log(exception);
    //  { exceptionDate: exception, futureEvents: false }
    let res;
    if (exception == null) {

        res = await RNCalendarEvents.saveEvent(eventTitle, eventData);
    } else {
        console.log('exception on')
        res = await RNCalendarEvents.saveEvent(eventTitle, eventData, { exceptionDate: exception, futureEvents: false })
    }

    const te = await RNCalendarEvents.findEventById(res)
    console.log(te);
    console.log(res);
    return res;
}
export async function eventFindId(id) {
    const res = await RNCalendarEvents.findEventById(id)

    return res;
}
export async function eventFetchFunc(data) {
    // 입력 데이터 양식
    // data = {
    //     start : YYYY-MM-DDT00:00:00.000'Z'
    //     end : YYYY-MM-DDT00:00:00.000'Z'
    //     id: 'calendarId' 조회할 캘린더 id
    // }
    const res = await RNCalendarEvents.fetchAllEvents(data.start, data.end, data.calId);
    // const res = await RNCalendarEvents.fetchAllEvents('2021-10-15T00:00:00.000Z', '2021-12-15T00:00:00.000Z', data.calId);//test
    let item = {};
    // console.log(res);
    res.map((i) => {
        const date = moment(i.startDate).format('YYYY-MM-DD');
        const during = { start: i.startDate, end: i.endDate }
        if (item[date] != null) {
            item[date] = [...item[date], { 'name': i.title, 'id': i.id, 'during': during }]
        } else {
            item[date] = [{ 'name': i.title, 'id': i.id, 'during': during, }] //alarms : i.alarms 삭제
        }

    })
    // 아래는 Optional 일정이 없는 날짜에 빈 배열 추가
    let beforeDate = data.start
    while (true) {
        if (moment(beforeDate).isBefore(data.end)) { // beforeDate 와 endDate 비교 
            const date = moment(beforeDate).format("YYYY-MM-DD")
            if (item[date] == null) {
                item[date] = [];
            }
            beforeDate = moment(beforeDate).add('1', 'd') // startDate 에 하루씩 추가하며 반복
        } else {
            break;
        }
    }

    return item
    // Ex) item = {date:[{name:'타이틀', id: '이벤트 id', during: {start: '시작시간', end: '종료시간'},}, {..} ], ......}
}

export async function eventRemoveFunc(id) {
    const res = await RNCalendarEvents.removeEvent(id, { futureEvents: true })
    return res
}

export async function eventSend(titleIn, dataIn, id) {
    console.log('sendStart')
    const key = Math.floor(Math.random() * 109951162777600).toString(16)
    AsyncStorage.setItem('eventKeys', JSON.stringify({ "key": key, "id": id }));
    let parseData = {
        "title": titleIn,
        "id": key,
        "allDay": dataIn.allDay,
        "startDate": moment(dataIn.startDate).add("09:00"),
        // "endDate": moment(dataIn.endDate),
        // "recurrenceRule": {
        //     "frequency": dataIn.recurrenceRule.frequency,
        //     "interval": dataIn.recurrenceRule.interval,
        //     "occurrence": dataIn.recurrenceRule.occurrence,
        //     "daysOfWeek": dataIn.recurrenceRule.daysOfWeek,
        //     "recEndDate": dataIn.recurrenceRule.endDate
        // },
    }
    if (dataIn.alarms != null) {
        parseData = { ...parseData, "alarms": dataIn.alarms }
    } else {
        parseData = { ...parseData, "alarms": '' }
    }
    if (dataIn.description != null) {
        parseData = { ...parseData, "description": dataIn.description }
    } else {
        parseData = { ...parseData, "description": '' }
    }
    if (dataIn.recurrenceRule != null) { //반복일정시 event Save를 위해 endDate를 지웠기 때문에 duration 으로 다시만듬
        const duration = dataIn.recurrenceRule.duration
        if (duration == 'P1D') {
            parseData = { ...parseData, endDate: moment(parseData.startDate).add(1, 'd') }
        } else if (duration.indexOf('S') != -1) {
            const second = duration.substring(duration.indexOf('P') + 1, duration.indexOf('S'))
            console.log(second)
            parseData = { ...parseData, endDate: moment(parseData.startDate).add(second, 's').subtract('09:00').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' }
        } else if (duration.indexOf('H') != -1) {
            const hour = duration.substring(duration.indexOf('T') + 1, duration.indexOf('H'))
            console.log(hour)
            parseData = { ...parseData, endDate: moment(parseData.startDate).add(hour, 'h').subtract('09:00').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' }
        }

        let recData;
        if (dataIn.recurrenceRule.frequency != null) {
            recData = { ...recData, "frequency": dataIn.recurrenceRule.frequency }
        }
        if (dataIn.recurrenceRule.interval != null) {
            recData = { ...recData, "interval": dataIn.recurrenceRule.interval }
        } else {
            recData = { ...recData, "interval": '' }
        }
        if (dataIn.recurrenceRule.occurrence != null) {
            recData = { ...recData, "occurrence": dataIn.recurrenceRule.occurrence }
        } else {
            recData = { ...recData, "occurrence": '' }
        }
        if (dataIn.recurrenceRule.daysOfWeek != null) {
            recData = { ...recData, "daysOfWeek": dataIn.recurrenceRule.daysOfWeek }
        } else {
            recData = { ...recData, "daysOfWeek": '' }
        }
        if (dataIn.recurrenceRule.recEndDate != null) {
            recData = { ...recData, "recEndDate": dataIn.recurrenceRule.endDate }
        } else {
            recData = { ...recData, "recEndDate": '' }
        }
        if (dataIn.recurrenceRule.weekPositionInMonth != null) {
            recData = { ...recData, "weekPositionInMonth": dataIn.recurrenceRule.weekPositionInMonth }
        } else {
            recData = { ...recData, "weekPositionInMonth": '' }
        }
        if (dataIn.recurrenceRule.monthPositionInMonth != null) {
            recData = { ...recData, "monthPositionInMonth": dataIn.recurrenceRule.monthPositionInMonth }
        } else {
            recData = { ...recData, "monthPositionInMonth": '' }
        }

        parseData = { ...parseData, "recurrenceRule": recData }
    } else {
        parseData = { //반복일정이 아닐때 빈 recurrenceRule 데이터 전송
            ...parseData, endDate: dataIn.endDate, recurrenceRule: {
                "frequency": '',
                "interval": 0,
                "occurrence": 0,
                "daysOfWeek": '',
                "recEndDate": '',
                "daysOfWeek": '',
                "weekPositionInMonth": 0,
                "monthPositionInMonth": 0,
            }
        }
    }

    console.log(parseData);
    axios({
        method: 'post',
        url: 'https://ntm.nanoit.kr/ysh/calendar/test20211008/UploadFullCalendar/insertApi.php',
        headers: {
            "Content-Type": 'application/json',
            "Accept": "application/json"
        },
        data: parseData
    }).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    })


    // axios.post('https://ntm.nanoit.kr/ysh/calendar/test20211008/UploadFullCalendar/insertApi.php',
    //     null
    //     , {
    //         params: parseData,
    //         headers: {
    //             "Content-Type": 'application/json',
    //             "Accept": "application/json"
    //         }
    //     }
    // )
    //     .then(function (response) {

    //         console.log(response.request.response);
    //         // setTxt('log: ' + JSON.parse(response.request.response))
    //         // setTxt2(JSON.stringify(response))
    //         //console.log(response);

    //     }).catch(function (error) {
    //         console.log(error);
    //     })
}
