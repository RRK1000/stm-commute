
import React from 'react';
import { View, FlatList, Image, StyleSheet, Modal, Pressable, Text, Vibration } from 'react-native';
import { HceTools } from 'react-native-nfc-sdk';

const Card = ({ id, img, fares } : {id:any, img:any, fares:any}) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const hce = new HceTools();

    const [isTagRead, setIsTagRead] = React.useState(false);

    function monthName(mon:any) {
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
     }

    const emulate = () => {
        // The start emulation function receives a content, which
        // corresponds to a NFC tag payload, and a writable boolean,
        // which will define if the NFC card you emulate can be written
        // The second parameter is a callback which will be called once
        // your emulated tag is read
        console.log("here")
        console.log(isTagRead)
        hce.startEmulation(
          {content: 'Hello World!', writable: false},
          () => {
            console.log("isTagRead")
            setIsTagRead(true);
            Vibration.vibrate(100);
            console.log(isTagRead)
            setTimeout(() => setIsTagRead(false), 3000);
          }
        )
    }
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
                                <Text style={styles.text}>#{id}</Text>
                                <View style={styles.faresBox}>
                                    <Text style={styles.fares}>Fares available:</Text>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={Object.keys(fares)}
                                        contentContainerStyle={{
                                            flexGrow: 1,
                                            }}
                                        renderItem={({ item }) => {
                                            if (item === "monthly") {
                                                return <Text style={styles.fares}>Monthly - {monthName((new Date()).getMonth())}</Text>;
                                            } else {
                                                return <Text style={styles.fares}>{item} - {fares[item]}</Text>;
                                            }
                                        }}
                                    />
                                </View>
                                <View style={styles.buttons}>
                                    <Pressable
                                        onPress={() => {
                                            Vibration.vibrate(100);
                                        }}>
                                        <Text style={styles.faresButton}>Recharge</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => {
                                            emulate();
                                            Vibration.vibrate(50);
                                        }}
                                        style={{
                                        borderRadius: 10,
                                        marginTop: 12,
                                        padding: 12,
                                        width: 180,
                                        height: 60,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 3,
                                            height: 3,
                                        },
                                        elevation: 10, 
                                        backgroundColor: isTagRead ? '#1df569' : '#009EE0'}}>
                                        <Text style={styles.useButton}>Use Card</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Pressable 
                    onPress={() => {
                        setModalVisible(true);
                        Vibration.vibrate(80);}}>
                    <Image source={{uri:img}} style={styles.image}/>
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
        marginTop: 12,
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
        elevation: 10,
    },
    useButton: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttons: {
        flexDirection: 'row',
        padding: 10,
    },
    cardInfo: {
        alignItems: 'center',
    },
    faresBox: {
        backgroundColor: '#ED7F00',
        borderRadius: 15,
        opacity: 0.6,
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
