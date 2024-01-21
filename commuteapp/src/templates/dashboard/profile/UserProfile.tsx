import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ScrollView, RefreshControl } from "react-native";
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

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      }, []);

    const [userData, setUserData] = useState<any>(); // Assuming any data structure

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

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array to fetch data only once on mount
    return (
        <ScrollView 
            showsVerticalScrollIndicator={false} 
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
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
          </ScrollView>
    );
};
export default UserProfile;