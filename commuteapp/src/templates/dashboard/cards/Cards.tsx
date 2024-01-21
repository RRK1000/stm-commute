import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import PocketBase from 'pocketbase'
import Card from './Card'

const url = 'https://stm-commute.pockethost.io/'
const pb = new PocketBase(url)

const PocketBaseCardsList: React.FC = () => {

    const [cardsData, setCardsData] = useState<any[]>([]); // Assuming any data structure

    const fetchData = async () => {
        try {
            await pb.admins.authWithPassword('admin@admin.com', 'admin123123');

            const user = await pb.collection('users').getFirstListItem('name="Armando Christian Pérez"', {
                expand: 'cards',
            });
            const userJson = JSON.parse(JSON.stringify(user))
            setCardsData(userJson["cards"]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array to fetch data only once on mount

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      }, []);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.cardsContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
                {cardsData.map((card, index) => (
                    <View key={index} style={styles.card}>
                        <Card
                            id={card["id"]}
                            img={card["source"]}
                            fares={card["fares"]}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignContent: 'center',
        justifyContent: 'center',
    },
    heading: {
        alignContent: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 8,
    },
    card: {
        border: '1px solid #ccc',
        margin: 10,
        padding: 4,
        width: 200,
    },
});

export default PocketBaseCardsList;