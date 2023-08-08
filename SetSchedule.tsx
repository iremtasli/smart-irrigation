import React, { useEffect, useState } from 'react';
import init from 'react_native_mqtt';
import { Button, ScrollView, Switch, Modal, Text, View,StyleSheet,SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Toast} from 'react-native-toast-message/lib/src/Toast';


const SetSchedule = () => {
  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const initialHoursArray = daysOfWeek.map(() => Array(24).fill(false));
  const [selectedHours, setSelectedHours] = useState(initialHoursArray);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  
  const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'uname');
  client.onMessageArrived = onMessageArrived;
  client.onConnectionLost = onConnectionLost;
  
  useEffect(() => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {}
    });
    client.connect({ onSuccess: onConnect, useSSL: false });
    readTopics();
    loadSelectedHours();
  }, []);

  function onConnect() {
    console.log("onConnect");
    AsyncStorage.getItem('mqtt_topics')
      .then((mqtt_topics) => {
        if (mqtt_topics) {
          const topics = mqtt_topics.split(',').map((topic) => topic.trim());
          topics.forEach((topic) => client.subscribe(topic));
        } else {
          console.log('mqtt_topics not found in AsyncStorage');
        }
      })
      .catch((error) => {
        console.log('Error reading mqtt_topics from AsyncStorage:', error);
      });
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  function onMessageArrived(message) {
    var mqttMessage = message.payloadString;
    // Burada MQTT mesajının işlenmesi yapılabilir
    console.log(mqttMessage);
  }

  function readTopics() {
    AsyncStorage.getItem('mqtt_topics')
      .then((mqtt_topics) => {
        if (mqtt_topics) {
          topics = mqtt_topics.split(',').map((topic) => topic.trim());
        } else {
          console.log('mqtt_topics not found in AsyncStorage');
        }
      })
      .catch((error) => {
        console.log('Error reading mqtt_topics from AsyncStorage:', error);
      });
  }
  const loadSelectedHours = async () => {
    try {
      const savedSelectedHours = await AsyncStorage.getItem('selectedHours');
      if (savedSelectedHours !== null) {
        const parsedSelectedHours = JSON.parse(savedSelectedHours);
        setSelectedHours(parsedSelectedHours);
      }
    } catch (error) {
      console.log('Error loading selected hours:', error);
    }
  };
  const saveSelectedHours = async (hours: any[][]) => {
    try {
      const hoursToSave = JSON.stringify(hours);
      await AsyncStorage.setItem('selectedHours', hoursToSave);
    } catch (error) {
      console.log('Error saving selected hours:', error);
    }
  };
  const sendCleanMessage = () => {
    const cleanMessage = "clean";
    publishMessage(cleanMessage);
  };
  const [isProgramCleaned, setIsProgramCleaned] = useState(false);

  const clearSelectedHours = () => {
    const clearedHours = Array.from({ length: 7 }, () => Array(24).fill(false));
    setSelectedHours(clearedHours);
    sendCleanMessage();
    clearSavedSelectedHours(); 
    setIsProgramCleaned(true);
    Toast.show({
      type: 'info',
      text1: 'Hata',
      text2: 'Program zaten temiz.',
      visibilityTime: 3000,
    });
  };

    const clearSavedSelectedHours = async () => {
      try {
        await AsyncStorage.removeItem('selectedHours'); // Saklanan saatleri temizle
      } catch (error) {
        console.log('Error clearing selected hours:', error);
      }
    };

  const toggleHour = (hour: number) => {
    setSelectedHours((prevHours) => {
      const updatedHours = [...prevHours];
      updatedHours[currentDayIndex!][hour] = !updatedHours[currentDayIndex!][hour];
      saveSelectedHours(updatedHours);
      return updatedHours;
    });
  };

  const handleDayButtonPress = (dayIndex) => {
    setCurrentDayIndex(dayIndex);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentDayIndex(null);
  };
  
  const sendScheduleToMQTT = () => {
    const mqttMessages = [];
  
    for (let day = 0; day < daysOfWeek.length; day++) {
      const dayName = daysOfWeek[day];
      const daySchedule = [];
  
      for (let hour = 0; hour < hours.length; hour++) {
        if (selectedHours[day][hour]) {
          const startHour = hour;
          const endHour = hour + 1;
  
          daySchedule.push(`${dayName}:${startHour < 10 ? '0' : ''}${startHour}:00:${dayName}:${endHour < 10 ? '0' : ''}${endHour}:00`);
        }
      }
  
      if (daySchedule.length > 0) {
        mqttMessages.push(...daySchedule);
      }
    }
  
    const mqttMessage =`clean\n${mqttMessages.join('\n')}`;
    publishMessage(mqttMessage);
  };
  function publishMessage(message: string) {
    try {
      if (topics) {
        for (let topic = 0; topic < topics.length; topic++) {
          if (topic === 0) {
            var mqttMessage = new Paho.MQTT.Message(message);
            mqttMessage.destinationName = topics[0];
            client.send(mqttMessage);
          }
        }
      } else {
        console.log('mqtt_topics not found in AsyncStorage');
      }
    } catch (error) {
      onConnect();
      client.connect({onSuccess: onConnect, useSSL: false});
      Toast.show({
        type: 'info',
        text1: 'Hata',
        text2: 'Tekrar Deneyiniz',
        visibilityTime: 3000,
      });
    }
  }

  return (
    <>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={styles.container}>
            <Text style={styles.title}>Haftalık Program Ayarlama</Text>
            <View style={styles.daysContainer}>
              {daysOfWeek.map((day, dayIndex) => (
                <Button
                  key={dayIndex}
                  title={day}
                  onPress={() => handleDayButtonPress(dayIndex)}
                  color="blue"
                />
              ))}
            </View>
  
            <Modal visible={isModalVisible} animationType="slide">
              <View style={styles.modalContainer}>
                <Button title="Kapat" onPress={closeModal} color="blue" />
  
                <ScrollView>
                  {hours.map((hour, hourIndex) => (
                    <View key={hourIndex}>
                      <Text>{hour}:00 - {hour + 1}:00</Text>
                      <Switch
                        value={selectedHours[currentDayIndex]?.[hour] || false}
                        onValueChange={() => toggleHour(hour)}
                      />
                    </View>
                  ))}
  
                  <View style={styles.buttonContainer}>
                    <Button
                      title="Programı Kaydet"
                      onPress={sendScheduleToMQTT}
                      color="blue"
                    />
                    <Button title="Programı Temizle" onPress={clearSelectedHours} color="red" />
                  </View>
                </ScrollView>
              </View>
            </Modal>
          </View>
          <Toast />
        </ScrollView>
        
      </SafeAreaView>
    </>
  );
                  }

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  dayButton: {
    width: 100, 
    height: 100, 
    marginBottom: 10, 
  },
  modalContainer: {
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default SetSchedule;