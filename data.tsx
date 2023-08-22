import React, { useEffect, useState } from 'react';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PropsWithChildren } from 'react';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

let topics: string | any[]

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [message, setMessage] = useState('Sensor Data');
  const [TimeMessage, setTimeMessage] = useState('Time');
  const [weatherMessage, setweatherMessage] = useState('Weather');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {}
  });

  const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'uname');
  client.onMessageArrived = onMessageArrived;
  client.onConnectionLost = onConnectionLost;

  useEffect(() => {
    console.log('useEffect');
    client.connect({ onSuccess: onConnect, useSSL: false });
    readTopics();
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
        readTopics();
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
    
    AsyncStorage.getItem('mqtt_topics')
    .then((mqtt_topics) => {
      if (mqtt_topics) {
        const topics = mqtt_topics.split(',').map((topic) => topic.trim());
        
        if (message.destinationName === topics[1]) {
          setMessage(mqttMessage);
        }
        if (message.destinationName === topics[4]) {
          setTimeMessage(mqttMessage);
        }
        if (message.destinationName === topics[3]) {
          setweatherMessage(mqttMessage);
        }

      } else {
        console.log('mqtt_topics not found in AsyncStorage');
      }
    })

    console.log(mqttMessage);
  }

  function readTopics(){
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
      client.connect({ onSuccess: onConnect, useSSL: false });
    });
  }



  return (
    <SafeAreaView style={[styles.container, styles.backgroundWhite]}>
    <StatusBar
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={Colors.white} />
    <View style={styles.contentContainer}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.backgroundWhite}>
        <View style={styles.sectionContainer}>
            <Section title='FARM DATA'>
              <Text style={styles.highlight}>{message}</Text>
              <Text style={styles.highlight}>{weatherMessage}</Text>
              <Text style={styles.highlight}>{TimeMessage}</Text>
            </Section>
          </View>
        </ScrollView>
      </View>
      <Toast />
    </SafeAreaView>
  );}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    sectionContainer: {
      marginTop: 50,
      paddingHorizontal: 24,
      backgroundColor: Colors.white, 
    },
    backgroundWhite: {
      backgroundColor: Colors.white,
    },
  

  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 10,
  },
  topicText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default App;