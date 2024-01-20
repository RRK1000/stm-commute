import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';


NfcManager.start();

export default function App() {
  const [isReading, setIsReading] = useState(false); 

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

  const toggleNfcOperation = () => {
    if (isReading) {
      // Stop reading
      NfcManager.setEventListener(NfcTech.Ndef, null);
      setIsReading(false);
    } else {
      // Start reading
      NfcManager.setEventListener(NfcTech.Ndef, handleNdef);
      setIsReading(true);

      // You can also trigger NFC transmission logic here
      // Example: NfcManager.setNdefPushMessage({ uri: 'https://example.com' });
    }
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
