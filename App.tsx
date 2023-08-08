import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ClientInsert from './ClientInsert';
import ClientSearch from './ClientSearch';
import HomeScreen from './HomeScreen';
import SetScreen from './SetScreen';
import MqttManual from './MqttManual';
import SetSchedule from './SetSchedule';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa' }} />
        <Stack.Screen name="ClientInsert" component={ClientInsert} options={{ title: 'Kayıt Ekle' }} />
        <Stack.Screen name="ClientSearch" component={ClientSearch} options={{ title: 'Kayıt Ara' }} />
        <Stack.Screen name="SetScreen" component={SetScreen} options={{ title: 'sulama yöntemi seç' }} />
        <Stack.Screen name="MqttManual" component={MqttManual} options={{ title: 'verileri gör' }} />
        <Stack.Screen name="SetSchedule" component={SetSchedule} options={{ title: 'sulamayı planla' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
