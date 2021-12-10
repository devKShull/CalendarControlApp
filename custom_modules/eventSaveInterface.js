import eventSaveMainInterface from './eventSaveMain'
import { createStackNavigator } from '@react-navigation/stack'
import selectCalInterface from './calendarSelector'
import calAlarmSetInterface from './setAlarm'
import React from 'react'


const EventStack = createStackNavigator();  // 네비게기터 설정
export default eventSave = () => {
    return (
        <EventStack.Navigator initialRouteName={"Save Event"} >
            <EventStack.Screen name={"Save Event"} component={eventSaveMainInterface} />
            <EventStack.Screen name={"Select Calendar"} component={selectCalInterface} />
            <EventStack.Screen name={"알림"} component={calAlarmSetInterface} options={{ headerLeft: null }} />
        </EventStack.Navigator>
    )
}
