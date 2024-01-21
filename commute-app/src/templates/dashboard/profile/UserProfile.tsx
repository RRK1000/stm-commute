import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import PocketBase from 'pocketbase'

const url = 'https://stm-commute.pockethost.io/'
const pb = new PocketBase(url)

interface User {
    name: string;
    age: number;
    email: string;
}

const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState<any>(); // Assuming any data structure

    useEffect(() => {
        const fetchData = async () => {
            try {
                await pb.admins.authWithPassword('admin@admin.com', 'admin123123');

                const pbuser = await pb.collection('users').getFirstListItem('name="rrk"', {
                    expand: 'cards',
                });
                console.log(pbuser);

                const userJson = JSON.parse(JSON.stringify(pbuser))
                console.log(userJson);

                const user: User = {
                    name: userJson.name,
                    age: userJson.age,
                    email: userJson.email,
                };
                console.log(user);
                setUserData(user);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to fetch data only once on mount



    return (
        <View>
            <Text>User Details</Text>
            <Text>Name: {userData ? userData.name:""} </Text>
            <Text>Age: {userData ? userData.age : ""}  </Text>
            <Text>Email: {userData ? userData.email : ""} </Text>
        </View>
    );
};


export default UserProfile;
