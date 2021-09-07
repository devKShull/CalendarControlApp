import React, { useState, useRef, Component } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import userCheck from './custom_modules/userCheck';
import gooApi from './custom_modules/gooApi';
import emailApi from './custom_modules/emailApi';
import findCal from './custom_modules/findCal';
import createCal from './custom_modules/createCal';
import eventSave from './custom_modules/eventSave';

function First({ navigation }) {
  return (
    <View>
      <View style={{ margin: 50 }}>
        <Button title="Go second" onPress={() => navigation.navigate('second')}>
          <Text>Go second</Text>
        </Button>
        <Text style={Styles.btn}></Text>
        <Button title="Go third" onPress={() => navigation.navigate('third')}>
          <Text>Go third</Text>
        </Button>
        <Text style={Styles.btn}></Text>
        <TouchableOpacity onPress={() => navigation.navigate('userCheck')} style={Styles.touch}><Text style={{ color: 'white' }}>UserCheck</Text></TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('API test')} style={Styles.touch}><Text style={{ color: 'white' }}>API Test</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Email Test')} style={Styles.touch}><Text style={{ color: 'white' }}>Email Test</Text></TouchableOpacity>
      </View>

    </View>
  );
}

function second() {

  return (
    <View Style={Styles.eachView}>
      <Text>Testsecond</Text>
    </View>
  )

}

function third() {

  return (
    <View Style={Styles.eachView}>
      <Text>Testthird</Text>
    </View>
  )

}
const Stack = createStackNavigator();

const AppContainer = createAppContainer(Stack);
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={First} />
        <Stack.Screen name="second" component={second} />
        <Stack.Screen name="third" component={third} />
        <Stack.Screen name="userCheck" component={userCheck} />
        <Stack.Screen name="API test" component={gooApi} />
        <Stack.Screen name="Email Test" component={emailApi} />
        <Stack.Screen name="Calendar Finds" component={findCal} />
        <Stack.Screen name="Create Calendars" component={createCal} />
        <Stack.Screen name="Save Event" component={eventSave} />
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

// import React from 'react'
// import { View, Text } from 'react-native'
// const App = () => {
//   return (
//     <View>
//       <Text>sdsd</Text>
//     </View>
//   )
// }
// export default App;