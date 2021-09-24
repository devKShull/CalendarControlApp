import RNCalendarEvents from "react-native-calendar-events";

export default eventRemoveFunc = async (id) => {
    const res = await RNCalendarEvents.removeEvent(id)

    return res
}