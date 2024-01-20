import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';


NfcManager.start();

export default function App() {
  useEffect(() => {
    initNfc();

    return () => {
      deinitNfc();
    };
  }, []);

  const initNfc = async () => {
    await NfcManager.start();
    NfcManager.setEventListener(NfcTech.Ndef, handleNdef);
  };

  const deinitNfc = () => {
    NfcManager.setEventListener(NfcTech.Ndef, null);
    NfcManager.stop();
  };

  const handleNdef = async (tag) => {
    // Handle NDEF data
    console.log(tag);
  };

  return (
    <View>
      <Text>Your NFC-Enabled Component</Text>
      <TouchableOpacity onPress={toggleNfcOperation}>
        <View
          style={{
            backgroundColor: '#3498db',
            padding: 10,
            margin: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: '#fff' }}>
            {isReading ? 'Stop Reading' : 'Start Reading'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
