// PicoDeviceList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import db from './database';
import MqttTopicsRegister from './MqttTopicsRegister'; // MqttTopicsRegister bileşenini içe aktarın

interface PicoDeviceListProps {
  userId: number;
}

const PicoDeviceList: React.FC<PicoDeviceListProps> = ({ userId }) => {
  const [picoDevices, setPicoDevices] = useState<string[]>([]);

  useEffect(() => {
    // Veritabanından PicoDevice'leri getir
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT device_id FROM devices WHERE user_id = ?',
        [userId],
        (_, result) => {
          const devices = [];
          for (let i = 0; i < result.rows.length; i++) {
            devices.push(result.rows.item(i).device_id);
          }
          setPicoDevices(devices);
        },
        (error) => {
          console.error('Error while fetching PicoDevices from the database: ', error);
        },
      );
    });
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PicoDevice List</Text>
      {picoDevices.length === 0 ? (
        <Text>No PicoDevices found for this user.</Text>
      ) : (
        <FlatList
          data={picoDevices}
          renderItem={({ item }) => <Text>{item}</Text>}
          keyExtractor={(item) => item}
        />
      )}
      {/* MqttTopicsRegister bileşenini PicoDeviceList içinde kullanın ve userId prop'unu geçirin */}
      <MqttTopicsRegister userId={userId} deviceId="" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default PicoDeviceList;
