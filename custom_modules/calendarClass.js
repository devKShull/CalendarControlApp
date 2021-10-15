import RNCalendarEvents from "../cal";
import moment from 'moment';


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

        res = await RNCalendarEvents.saveEvent(eventTitle, eventData)
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
    // const res = await RNCalendarEvents.fetchAllEvents(data.start, data.end, data.calId);
    const res = await RNCalendarEvents.fetchAllEvents('2021-10-15T00:00:00.000Z', '2021-12-15T00:00:00.000Z', data.calId);//test
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



// //IOS
// {"alarms": [{"date": "2019-10-01T00:10:00.000Z"}], 
// "allDay": true, 
// "startDate": "2019-10-02T15:00:00.000Z",  
// "endDate": "2019-10-03T14:59:59.000Z",
// "id": "6FBCD7D8-1493-491B-A9D3-5E1B54E8F640", 
// "notes": "일정에 대한 설명", 
// "occurrenceDate": "2019-10-02T15:00:00.000Z", 
// "recurrenceRule": {"frequency": "yearly", "interval": 1, "occurrence": 5, 'duration': 'weekly', 'endDate':'2019-10-03T14:59:59.000Z'}, 
// "title": "개천절", 
// }

// //ANDROID
// {"alarms": [{"date": "2019-10-13T00:10:00.000Z"}], 
// "allDay": true, 
// "description": "일정 설명", 
// "endDate": "", 
// "id": "144", 
// "recurrenceRule": {"duration": "P1D", "frequency": "yearly", "interval": 1, "occurrence": 5,'endDate':'2019-10-03T14:59:59.000Z'}, 
// "startDate": "2019-10-13T00:00:00.000Z", 
// "title": "혁규 생일"
// }