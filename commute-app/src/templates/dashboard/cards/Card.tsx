import React from 'react';
import { View, FlatList, Image, StyleSheet, Modal, Pressable, Text, Vibration, Button } from 'react-native';

const Card = () => {
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
                                <Image source={require('../../../../assets/opus.png')} 
                                style={styles.modalImage}/>
                            </Pressable>
                            <View>
                                <Text style={styles.text}>Opus ID number</Text>
                                <Text style={styles.text}>Available fares</Text>
                                
                                <Pressable>
                                    <Text style={styles.faresButton}>Recharge</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Pressable 
                    onPress={() => {
                        setModalVisible(true);
                        Vibration.vibrate(80);
                        console.warn("Tapped");}}>
                    <Image source={require('../../../../assets/opus.png')} 
                    style={styles.image} />
                </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
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
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    faresButton: {
        borderRadius: 10,
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        textAlign: 'center',
        padding: 12,
        backgroundColor: '#ED7F00',
        width: 180,
        height: 60,
        shadowColor: '#000',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        elevation: 5,
    }
});

export default Card;
