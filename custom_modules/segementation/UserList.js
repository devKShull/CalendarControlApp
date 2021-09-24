import React from 'react';
import { View, Text } from 'react-native'
function User({ user }) {
    return (
        <View>
            <Text>{user.username}</Text>
            <Text>{user.email}</Text>
        </View>
    );
}

function UserList({ users }) {
    return (
        <View>
            {users.map(user => (
                <User user={user} key={user.id} />
            ))}
        </View>
    );
}

export default UserList;