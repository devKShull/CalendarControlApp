
import RNCalendarEvents from 'react-native-calendar-events'
import React, { useEffect } from 'react'
import { Text } from 'react-native'
export default calendarFetchFun = async () => {

    const res = await RNCalendarEvents.findCalendars()

    const googleCalData = res.filter((i) => {
        return (i.type === ('com.google'))
    });
    const localCalData = res.filter((i) => {
        return (i.type === ('LOCAL'))
    })
    const samCalData = res.filter((i) => {
        return (i.type === ('com.osp.app.signin'))
    })

    const parsingRes = { google: googleCalData, local: localCalData, samsung: samCalData }

    return parsingRes
}