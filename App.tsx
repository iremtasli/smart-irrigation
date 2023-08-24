import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ClientInsert from './ClientInsert';
import ClientSearch from './ClientSearch';
import HomeScreen from './HomeScreen';
import SetScreen from './SetScreen';
import MqttManual from './MqttManual';
import SetSchedule from './SetSchedule';
import BluetoothScreen from './BluetoothScreen';

import data from './data';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="ClientInsert" component={ClientInsert} options={{ title: 'Insert Registration' }} />
        <Stack.Screen name="ClientSearch" component={ClientSearch} options={{ title: 'Search Registration' }} />
        <Stack.Screen name="SetScreen" component={SetScreen} options={{ title: 'Choose Irrigation Method' }} />
        <Stack.Screen name="MqttManual" component={MqttManual} options={{ title: 'Manual Irrigation' }} />
        <Stack.Screen name="SetSchedule" component={SetSchedule} options={{ title: 'Automatic Irrigation' }} />
        <Stack.Screen name="data" component={data} options={{ title: 'View Data' }} />
        <Stack.Screen name="BluetoothScreen" component={BluetoothScreen} options={{ title: 'BluetoothScreen' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
