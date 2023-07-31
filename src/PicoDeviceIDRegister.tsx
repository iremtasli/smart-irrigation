import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import db from './database';

interface PicoDeviceIDRegisterProps {
  userId: number; // Farm ID yerine User ID kullanacağız
  onDeviceIDRegistration: (registeredDeviceId: string) => void;
}

const PicoDeviceIDRegister: React.FC<PicoDeviceIDRegisterProps> = ({ userId, onDeviceIDRegistration }) => {
  const [deviceId, setDeviceId] = useState('');

  const handleRegisterDeviceID = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO devices (user_id, device_id, mqtt_topic) VALUES (?, ?, ?)',
        [userId, deviceId, ''], // mqtt_topic alanını boş olarak ekliyoruz
        (_, result) => {
          console.log('PicoDevice ID registered successfully.');
          onDeviceIDRegistration(deviceId);
        },
        (error) => {
          console.error('Error while registering PicoDevice ID: ', error);
        },
      );
    });
  };;
  

  return (
    <View>
      <TextInput
        placeholder="PicoDevice ID"
        value={deviceId}
        onChangeText={setDeviceId}
      />
      <Button title="Register PicoDevice ID" onPress={handleRegisterDeviceID} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default PicoDeviceIDRegister;