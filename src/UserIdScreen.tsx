import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import db from './database';
import PicoDeviceList from './PicoDeviceList';
import MqttTopicList from './MqttTopicList';
import MqttTopicsRegister from './MqttTopicsRegister';
import PicoDeviceIDRegister from './PicoDeviceIDRegister';

interface UserIdScreenProps {
  onUserIdEntered: (userId: number) => void;
}

const UserIdScreen: React.FC<UserIdScreenProps> = ({ onUserIdEntered }) => {
  const [userId, setUserId] = useState('');
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  useEffect(() => {
    // Kullanıcı veritabanında kayıtlı mı kontrol edelim
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM devices WHERE user_id = ?',
        [parseInt(userId, 10)],
        (_, result) => {
          if (result.rows.length > 0) {
            setIsUserRegistered(true);
          } else {
            setIsUserRegistered(false);
          }
        },
        (error) => {
          console.error('Error while checking user in the database: ', error);
        },
      );
    });
  }, [userId]);

  const handleUserIdSubmit = () => {
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId) || parsedUserId <= 0) {
      console.error('Invalid User ID');
    } else {
      // Veritabanında kullanıcıyı kontrol etmek için işlem yapalım.
      setUserId(String(parsedUserId));
    }
  };

  return (
    <View style={styles.container}>
      {!isUserRegistered ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Your User ID"
            value={userId}
            onChangeText={setUserId}
            keyboardType="numeric"
          />
          <Button title="Submit" onPress={handleUserIdSubmit} />
        </>
      ) : (
        <>
          <PicoDeviceList userId={parseInt(userId, 10)} />
          <MqttTopicList userId={parseInt(userId, 10)} />
          <MqttTopicsRegister userId={parseInt(userId, 10)} deviceId="" />
          <PicoDeviceIDRegister
            userId={parseInt(userId, 10)}
            onDeviceIDRegistration={() => setIsUserRegistered(true)}
          />
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
  input: {
    width: '80%',
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default UserIdScreen;
