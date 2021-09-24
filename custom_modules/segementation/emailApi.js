import React from 'react'
import { Text, TouchableOpacity, StyleSheet, View, Linking } from 'react-native';
import { openInbox, openComposer } from 'react-native-email-link';

const emailApi = () => {
    const openB = () => {
        openInbox({
            message: "Test message",
            title: 'test title',
            cancelLabel: "test cancle Lable",
        })
    }
    return (
        <View>
            <TouchableOpacity onPress={() => openB()} style={styles.touchSt}>
                <Text style={{ fontSize: 40, alignItems: 'center' }}>open</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    touchSt: {
        justifyContent: 'center',
        backgroundColor: '#6666ff',
        margin: 15,

    }
})

export default emailApi;