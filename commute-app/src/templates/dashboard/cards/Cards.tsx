import React from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';

const Cards = () => {
    return (
        <View style={styles.container}>
            <FlatList
                data={[
                    {
                        id: 1,
                        source: require('../../../../assets/opus.png'),
                    },
                    {
                        id: 2,
                        source: require('../../../../assets/opus.png'),
                    },
                    {
                        id: 3,
                        source: require('../../../../assets/opus.png'),
                    },
                ]}
                renderItem={({ item }) => <Image source={item.source} style={styles.image} />}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 16,
    },
});

export default Cards;
