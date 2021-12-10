
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react'
import { View, Text } from 'react-native';
import calAgendaInterface from './AgendaCalendar';
import calFetchInterface from './calendarList';
import calCreateInterface from './calendarCreator';
import devMode from './devMode';

const CustomDrawer = (props) => {
    return (
        <DrawerContentScrollView {...props} >
            <View style={{ margin: 10 }}>
                <Text>Calendars</Text>
                <DrawerItemList {...props} />
            </View>
        </DrawerContentScrollView>
    )
}
const Drawer = createDrawerNavigator();
export default Home = () => {
    return (
        <Drawer.Navigator
            initialRouteName="Calendar"
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <Drawer.Screen name='Agenda Calendar' component={calAgendaInterface} options={{ headerShown: false }} />
            <Drawer.Screen name='Calendar List' component={calFetchInterface} />
            <Drawer.Screen name='Create Cal' component={calCreateInterface} />
            <Drawer.Screen name='Develop mode' component={devMode} />
        </Drawer.Navigator>
    );
}
