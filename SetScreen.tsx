import React from 'react';
import { View, StyleSheet, Button } from 'react-native';

const SetScreen = ({ navigation }) => {
  const handleManualClick = () => {
    navigation.navigate('MqttManual');
  };

  const handlePlanClick = () => {
    navigation.navigate('SetSchedule');
  };

  return (
    <View style={styles.container}>
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
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default SetScreen;
