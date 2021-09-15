import RNCalendarEvents from "react-native-calendar-events";

export default calendarRemove = async (id) => {
    const res = await RNCalendarEvents.removeCalendar(id)
    return res
}