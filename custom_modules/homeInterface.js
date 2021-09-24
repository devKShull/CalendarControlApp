
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React from 'react'
import { View, Text } from 'react-native';
import calAgendaInterface from './calAgendaInterface';
import calFetchInterface from './calFetchInterface';
import calCreateInterface from './calCreateInterface';

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
            <Drawer.Screen name='Calendar' component={calAgendaInterface} />
            <Drawer.Screen name='Calendar List' component={calFetchInterface} />
            <Drawer.Screen name='Create Cal' component={calCreateInterface} />
        </Drawer.Navigator>
    );
}
