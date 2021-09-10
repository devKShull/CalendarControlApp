import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import gooApi from './custom_modules/gooApi';
import emailApi from './custom_modules/emailApi';
import findCal from './custom_modules/findCal';
import createCal from './custom_modules/createCal';
import eventSave from './custom_modules/eventSave';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Calendar Test'>
        <Stack.Screen name="Calendar Test" component={gooApi} options={{ headerShown: false }} />
        <Stack.Screen name="Email Test" component={emailApi} />
        <Stack.Screen name="Calendar Finds" component={findCal} />
        <Stack.Screen name="Create Calendars" component={createCal} />
        <Stack.Screen name="Save Event Main" component={eventSave} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )

};



export default App;
