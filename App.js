import React, { useState, useRef, Component } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
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

const Styles = StyleSheet.create({
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  eachView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    height: 5
  },
  touch: {
    height: 40,
    backgroundColor: '#6666ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  }
})

export default App;
