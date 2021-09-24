import RNCalendarEvents from 'react-native-calendar-events'
import moment from 'moment';
export default eventFetchFun = async (data) => {
    // 입력 데이터 양식
    // data = {
    //     start : YYYY-MM-DDT00:00:00.000'Z'
    //     end : YYYY-MM-DDT00:00:00.000'Z'
    //     id: 'calendarId'
    // }

    const res = await RNCalendarEvents.fetchAllEvents(data.start, data.end, data.calId);
    let item = {};
    res.map((i) => {
        const date = moment(i.startDate).format('YYYY-MM-DD');
        const during = { start: i.startDate, end: i.endDate }
        item[date] = [{ 'name': i.title, 'id': i.id, 'during': during, 'alarms': i.alarms }]
    })
    // 아래는 Optional
    let beforeDate = data.start
    while (true) {
        if (moment(beforeDate).isBefore(data.end)) {
            const date = moment(beforeDate).format("YYYY-MM-DD")
            if (item[date] == null) {
                item[date] = [];
            }

            beforeDate = moment(beforeDate).add('1', 'd')
        } else {
            break;
        }
    }

    return item
}
