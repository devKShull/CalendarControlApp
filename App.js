import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import eventSaveInterface from './custom_modules/eventSaveInterface';
import homeInterface from './custom_modules/homeInterface';

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
// upload Test sksksks
export default App;
