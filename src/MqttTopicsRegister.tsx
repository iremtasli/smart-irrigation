import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import db from './database';

interface MqttTopicsRegisterProps {
  userId: number;
  deviceId: string;
}

const MqttTopicsRegister: React.FC<MqttTopicsRegisterProps> = ({ userId, deviceId }) => {
  const [mqttTopic, setMqttTopic] = useState('');

  const handleRegisterMqttTopic = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO devices (user_id, device_id, mqtt_topic) VALUES (?, ?, ?)',
        [userId, deviceId, mqttTopic],
        (_, result) => {
          console.log('Mqtt topic registered successfully.');
        },
        (error) => {
          console.error('Error while registering Mqtt topic: ', error);
        },
      );
    });
  };
  
  

  return (
    <View>
      <TextInput
        placeholder="Enter your MQTT Topic"
        value={mqttTopic}
        onChangeText={setMqttTopic}
      />
      <Button title="Register MQTT Topic" onPress={handleRegisterMqttTopic} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default MqttTopicsRegister;
