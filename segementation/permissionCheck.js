import RNCalendarEvents from "react-native-calendar-events";



export default permissionCheck = async () => {

    console.log("check func On")
    let res = await RNCalendarEvents.checkPermissions((readOnly = false))
    console.log(res);
    if (res != 'authorized') {
        await RNCalendarEvents.requestPermissions((readOnly = false))
    }
    else { return res }

}