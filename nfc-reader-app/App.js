import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { HceTools } from 'react-native-nfc-sdk';


export default function App () {
    const hce = new HceTools();
    const [isTagRead, setIsTagRead] = React.useState('No');

    const emulate = () => {
        // The start emulation function receives a content, which
        // corresponds to a NFC tag payload, and a writable boolean,
        // which will define if the NFC card you emulate can be written
        // The second parameter is a callback which will be called once
        // your emulated tag is read
        hce.startEmulation(
          {content: 'Hello World!', writable: false},
          () => {
            setTagIsRead('Yes!');
            setTimeout(() => setIsTagRead('No'), 1000);
          }
        )
    }

    return (
        <View>
            <Button onPress={emulate} title="EMULATE NFC TAG" />
            <Text>Was the tag read? {isTagRead}</Text>
        </View>
    );
}