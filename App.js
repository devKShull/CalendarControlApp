import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import eventSaveInterface from './custom_modules/eventSaveInterface';
import eventSave from './custom_modules/eventSave';
import homeInterface from './custom_modules/homeInterface';
import gooApi from './custom_modules/gooApi'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Calendar Test'>
        <Stack.Screen name="Calendar Test" component={homeInterface} options={{ headerShown: false }} />
        <Stack.Screen name="Save Event Main" component={eventSaveInterface} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )

};



export default App;
