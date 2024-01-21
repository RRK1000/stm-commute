import React from 'react';
import { View, FlatList, Image, StyleSheet, Modal, Pressable, Text, Vibration, ScrollView } from 'react-native';

const Card = ({ id, img, fares } : {id:any, img:any, fares:any}) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    return (
        <View style={styles.centered}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                    <View style={styles.centered}>
                        <View style={styles.modal}>
                            <Pressable 
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Image source={{uri:img}} style={styles.modalImage}/>
                            </Pressable>
                            <View style={styles.cardInfo}>
                                <Text style={styles.text}>Opus #{id}</Text>
                                <View style={styles.faresBox}>
                                    <Text style={styles.fares}>Available fares list</Text>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={Object.keys(fares)}
                                        contentContainerStyle={{
                                            flexGrow: 1,
                                            }}
                                        renderItem={({ item }) => {
                                            if (item === "monthly") {
                                                return <Text style={styles.fares}>Monthly Pass for </Text>;
                                            } else {
                                                return <Text style={styles.fares}>{item}: {fares[item]}</Text>;
                                            }
                                        }}
                                    />
                                </View>
                                <Pressable
                                    onPress={() => {
                                        Vibration.vibrate(100);
                                    }}>
                                    <Text style={styles.faresButton}>Recharge</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Pressable 
                    onPress={() => {
                        setModalVisible(true);
                        Vibration.vibrate(80);}}>
                    <Image source={require('../../../../assets/opus.png')} 
                    style={styles.image} />
                </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        marginTop: 160,
        backgroundColor: 'slategray',
        borderRadius: 20,
        width: 400,
        height: 550,
        shadowColor: '#000',
        shadowOffset: {
            width: 30,
            height: 30,
        },
        shadowOpacity: 0.5,
        elevation: 5,
    },
    modalImage: {
        borderRadius: 20,
        width: 400,
        height: 254,
    },
    image: {
        borderRadius: 20,
        width: 316,
        height: 200,
    },
    text: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 8,
    },
    faresButton: {
        borderRadius: 10,
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 18,
        textAlign: 'center',
        padding: 12,
        backgroundColor: '#ED7F00',
        width: 200,
        height: 60,
        shadowColor: '#000',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        elevation: 10,
    },
    cardInfo: {
        alignItems: 'center',
    },
    faresBox: {
        backgroundColor: '#ED7F00',
        borderRadius: 15,
        opacity: 0.8,
        height: 140,
        width: 200,
    },
    fares: {
        marginLeft: 10,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        width: 200,
    },
});

export default Card;
