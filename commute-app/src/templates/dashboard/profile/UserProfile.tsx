import React from 'react';
import { View, Text } from 'react-native';

interface User {
    name: string;
    age: number;
    email: string;
}

const UserProfile: React.FC = () => {
    const user: User = {
        name: 'John Doe',
        age: 25,
        email: 'johndoe@example.com',
    };

    return (
        <View>
            <Text>User Details</Text>
            <Text>Name: {user.name}</Text>
            <Text>Age: {user.age}</Text>
            <Text>Email: {user.email}</Text>
        </View>
    );
};


export default UserProfile;
