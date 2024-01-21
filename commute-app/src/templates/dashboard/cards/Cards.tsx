import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PocketBase from 'pocketbase'
import Card from './Card'

const url = 'https://stm-commute.pockethost.io/'
const pb = new PocketBase(url)


const PocketBaseCardsList: React.FC = () => {
    const [cardsData, setCardsData] = useState<any[]>([]); // Assuming any data structure

    useEffect(() => {
        const fetchData = async () => {
            try {
                await pb.admins.authWithPassword('admin@admin.com', 'admin123123');

                const user = await pb.collection('users').getFirstListItem('name="rrk"', {
                    expand: 'cards',
                });
                const userJson = JSON.parse(JSON.stringify(user))
                setCardsData(userJson["cards"]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to fetch data only once on mount

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>PocketBase Cards List</Text>
            <View style={styles.cardsContainer}>
                {cardsData.map((card, index) => (
                    <View key={index} style={styles.card}>
                        <Card/>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#009EE0',
        alignContent: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        border: '1px solid #ccc',
        margin: 10,
        padding: 10,
        width: 200,
    },
    image: {
        width: 316,
        height: 200,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PocketBaseCardsList;
