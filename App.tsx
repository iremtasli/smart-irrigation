// App.tsx

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserIdScreen from './src/UserIdScreen';
import PicoDeviceIDRegister from './src/PicoDeviceIDRegister';
import MqttTopicsRegister from './src/MqttTopicsRegister';
import PicoDeviceList from './src/PicoDeviceList';
import MqttTopicList from './src/MqttTopicList';
import db, { initializeDatabase } from './src/database';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  // Veritabanını başlat
  initializeDatabase();

  const handleUserIdEntered = (enteredUserId: number) => {
    setUserId(enteredUserId);
    // Kullanıcı veritabanında kayıtlı mı kontrol edelim
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users WHERE user_id = ?',
        [enteredUserId],
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
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userId === null ? (
          <Stack.Screen
            name="UserIdScreen"
            options={{ headerShown: false }}
          >
            {(props) => <UserIdScreen {...props} onUserIdEntered={handleUserIdEntered} />}
          </Stack.Screen>
        ) : isUserRegistered ? (
          <>
            <Stack.Screen
              name="PicoDeviceList"
              getComponent={PicoDeviceList}
              initialParams={{ userId: userId }}
            />
            <Stack.Screen
              name="MqttTopicList"
              component={MqttTopicList}
              initialParams={{ userId: userId }} // Burada userId ekliyoruz
            />
            <Stack.Screen
              name="MqttTopicsRegister"
              component={MqttTopicsRegister}
              initialParams={{ userId: userId, deviceId: '' }} // Burada userId ve deviceId ekliyoruz
            />
          </>
        ) : (
          <Stack.Screen
            name="PicoDeviceIDRegister"
            options={{ headerShown: false }}
          >
            {(props) => (
              <PicoDeviceIDRegister
                {...props}
                userId={userId}
                onDeviceIDRegistration={() => setIsUserRegistered(true)}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
