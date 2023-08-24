import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial-next';

const App = () => {
  const [message, setMessage] = useState('');
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    BluetoothSerial.isConnected().then((isConnected) => {
      if (!isConnected) {
        BluetoothSerial.connect('20:14:04:16:15:31')
          .then(() => {
            console.log('Connected to Bluetooth device');
            BluetoothSerial.on('data', (data) => {
              setMessage(data);
            });
          })
          .catch((err) => {
            console.error('Bluetooth connection error:', err);
          });
      }
    });

    return () => {
      BluetoothSerial.disconnect();
    };
  }, []);

  const sendText = () => {
    if (inputText !== '') {
      BluetoothSerial.write(inputText);
      setInputText('');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Text>{message}</Text>
      <TextInput
        style={{ width: '80%', borderWidth: 1, marginTop: 10, padding: 5 }}
        placeholder="Mesajınızı buraya yazın"
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Gönder" onPress={sendText} />
    </View>
  );
};

export default App;
