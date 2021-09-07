import React from 'react'
import { Button, TextInput, Text, View, Alert, StyleSheet } from 'react-native'
//import { Input } from 'native-base'

export default function CreateUser({ username, email, handle, onCreatef, init }) {
    const test = () => {
        Alert.alert("test", 'stest');
    }
    return (
        <View>
            <TextInput
                name="usernamne"
                placeholder="계정명"
                onChangeText={(txt) => handle("username", txt)}
                value={username}
            />

            <TextInput
                name="email"
                placeholder="email"
                onChangeText={(txt) => handle("email", txt)}

                value={email}
            />

            <Button Style={styles.Btn} onPress={onCreatef} title="submit"></Button>
            <Button Style={styles.Btn} onPress={init} title="초기화"></Button>
        </View>
    );

}
const styles = StyleSheet.create({
    Btn: {
        flex: 1,
        width: 50,
        backgroundColor: '#6666ff'
    }
})