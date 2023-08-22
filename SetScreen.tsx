import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const SetScreen = ({ route, navigation }) => {
  const { userData } = route.params;

  const handleManualClick = () => {
    navigation.navigate('MqttManual');
  };

  const handlePlanClick = () => {
   
    navigation.navigate('SetSchedule');
  };

  const handleDataClick = () => {
   
    navigation.navigate('data');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Information</Text>
      <Text style={styles.text}>User ID: {userData.user_id}</Text>
      <Text style={styles.text}>Picodevice ID: {userData.picodevice_id}</Text>
      <Text style={styles.text}>MQTT Topics: {userData.mqtt_topics.join(', ')}</Text>

      
      <View style={styles.buttonContainer}>
        <Button title="See Data" onPress={handleDataClick} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Do Manual" onPress={handleManualClick} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Plan Irrigation" onPress={handlePlanClick} />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color:'black',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '60%', 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', 
  },
});

export default SetScreen;