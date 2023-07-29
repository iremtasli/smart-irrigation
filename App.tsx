import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserIdScreen from './src/UserIdScreen';
import PicoDeviceIDRegister from './src/PicoDeviceIDRegister';
import MqttTopicsRegister from './src/MqttTopicsRegister';
import db, { initializeDatabase } from './src/database';

const App: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);

  // Veritabanını başlat
  initializeDatabase();

  const handleUserIdEntered = (enteredUserId: number) => {
    setUserId(enteredUserId);
  };

  return (
    <View style={styles.container}>
      {userId === null ? (
        <UserIdScreen onUserIdEntered={handleUserIdEntered} />
      ) : (
        <>
          <Text style={styles.title}>Welcome, User ID: {userId}</Text>
          <PicoDeviceIDRegister userId={userId} onDeviceIDRegistration={() => {}} />
          {userId && <MqttTopicsRegister userId={userId} deviceId={''} />}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;
