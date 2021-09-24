
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React from 'react'
import { View, } from 'react-native';
import calAgendaInterface from './calAgendaInterface';
import calFetchInterface from './calFetchInterface';
import calCreateInterface from './calCreateInterface';

const CustomDrawer = (props) => {

    return (
        <DrawerContentScrollView {...props} >
            <View style={{ margin: 10 }}>
                <Text>Calendars</Text>
                <DrawerItemList {...props} />
                <DrawerItem label="button test" />
            </View>
        </DrawerContentScrollView>
    )
}
const Drawer = createDrawerNavigator();
export default Home = () => {
    return (
        <Drawer.Navigator
            initialRouteName="calTest"
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <Drawer.Screen name='calTest' component={calAgendaInterface} />
            <Drawer.Screen name='Calendar List' component={calFetchInterface} />
            <Drawer.Screen name='Create Cal' component={calCreateInterface} />
        </Drawer.Navigator>
    );
}
