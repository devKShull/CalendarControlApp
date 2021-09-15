import React from "react";
import RNCalendarEvents from "react-native-calendar-events";

export default createCalFunc = async (params) => {
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
    }
    const id = await RNCalendarEvents.saveCalendar(calInfO)
    console.log(id);
    console.log("id");




    return id
}
