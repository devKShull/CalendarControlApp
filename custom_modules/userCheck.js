
import CreateUser from './CreateUser'
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    Input,
    Alert

} from 'react-native';

import UserList from './UserList';
import React, { useState, useRef } from 'react';


const userCheck = () => {

    const [inputs, setInputs] = useState({
        username: '',
        email: ''
    });
    const { username, email } = inputs;
    const handleChange = (name, text) => {

        // const { eventCount, target, text } = e.nativeEvent;
        // Alert.alert("Title", eventCount + "ta" + target + "text" + text);
        // if (target == 373) {
        //   setInputs({
        //     ...inputs,
        //     username: text
        //   });
        // } else {
        //   setInputs({
        //     ...inputs,
        //     email: text
        //   });
        // }

        setInputs({
            ...inputs,
            [name]: text
        })

    };
    const init = () => {
        setUsers([]);
        setInputs({
            username: '',
            email: ''
        });
    }
    const [users, setUsers] = useState([
        {
            id: 1,
            username: 'velopert',
            email: 'public.velopert@gmail.com'
        },
        {
            id: 2,
            username: 'tester',
            email: 'tester@example.com'
        },
        {
            id: 3,
            username: 'liz',
            email: 'liz@example.com'
        }
    ]);

    const nextId = useRef(4);
    const onCreatef = () => {
        if (username != '' && email != '') {

            Alert.alert("알림", "제출성공")
            const user = {
                id: nextId.current,
                username,
                email
            };
            setUsers(users.concat(user));

            setInputs({
                username: '',
                email: ''
            });
            nextId.current += 1;
        } else {
            Alert.alert('경고', '빈칸이 있습니다.')
        }
    };
    return (
        <View style={styles.container}>
            <CreateUser
                username={username}
                email={email}
                handle={handleChange}
                onCreatef={onCreatef}
                init={init} />

            <UserList users={users} style={styles.userList} />

        </View>



    );
};
const styles = StyleSheet.create(
    {
        container: {
            margin: 15,

        },

    }
)

export default userCheck;
