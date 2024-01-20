import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';


NfcManager.start();

export default function App() {
  async function scanTag() {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
        console.log("tag found", tag);
      })

    await NfcManager.registerTagEvent();
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <TouchableOpacity onPress={scanTag}>
        <Text>Scan a Tag</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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
