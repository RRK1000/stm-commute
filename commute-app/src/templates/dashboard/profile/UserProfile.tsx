import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text } from "react-native";
import tailwind from "twrnc";
import { Avatar } from 'react-native-elements';
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

                const userJson = JSON.parse(JSON.stringify(pbuser))

                const user: User = {
                    name: userJson.name,
                    age: userJson.age,
                    email: userJson.email,
                };
                setUserData(user);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to fetch data only once on mount
    return (
        <SafeAreaView style={tailwind`w-full flex-1 bg-gray-50`}>

            <View style={tailwind`flex-1 items-center justify-center gap-8`}>
                <View style={tailwind`gap-2 items-center`}>
                    <Text style={tailwind`text-gray-950 text-3xl font-bold`}>
                        {userData ? userData.name : ""}
                    </Text>
                    <Text style={tailwind`text-gray-950 text-lg`}>{userData ? userData.email : ""}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};
export default UserProfile;