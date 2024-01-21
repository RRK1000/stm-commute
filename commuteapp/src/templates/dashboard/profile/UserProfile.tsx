import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ScrollView, RefreshControl } from "react-native";
import tailwind from "twrnc";
import { Avatar, ListItem } from 'react-native-elements';
import PocketBase from 'pocketbase';

const url = 'https://stm-commute.pockethost.io/';
const pb = new PocketBase(url);

interface User {
    name: string;
    age: number;
    email: string;
    pfp: string;
}

const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState<User | null>(null);

    const fetchData = async () => {
        try {
            await pb.admins.authWithPassword('admin@admin.com', 'admin123123');

            const pbuser = await pb.collection('users').getFirstListItem('name="Armando Christian Pérez"', {
                expand: 'cards',
            });

            const userJson = JSON.parse(JSON.stringify(pbuser));

            const user: User = {
                name: userJson.name,
                age: userJson.age,
                email: userJson.email,
                pfp: userJson.pfp,
            };
            setUserData(user);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
    
            <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: 'white' }}>
                <View style={{ paddingTop:90, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {userData && (
                        <View style={{ gap: 2, alignItems: 'center' }}>
                            <Avatar
                                rounded
                                source={{
                                    uri: userData.pfp,
                                }}
                                size="xlarge"
                            />
                            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                                {userData.name}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                                {userData.email}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                                {userData.age}
                            </Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
    );
};

export default UserProfile;