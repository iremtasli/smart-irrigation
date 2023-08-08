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
  const [message, setMessage] = useState('No Message Received');

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
    readTopics()
  }, []);

  function onConnect() {
    console.log("onConnect");
    // AsyncStorage'tan mqtt_topics değerini alıyoruz
    AsyncStorage.getItem('mqtt_topics')
      .then((mqtt_topics) => {
        if (mqtt_topics) {
          // Abonelik işlemini gerçekleştiriyoruz
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
    setMessage(mqttMessage);
    console.log(mqttMessage);
  }
  function readTopics(){
    AsyncStorage.getItem('mqtt_topics')
    .then((mqtt_topics) => {
      if (mqtt_topics) {
        // Abonelik işlemini gerçekleştiriyoruz
        topics = mqtt_topics.split(',').map((topic) => topic.trim());

      } else {
        console.log('mqtt_topics not found in AsyncStorage');
      }
    })
    .catch((error) => {
      console.log('Error reading mqtt_topics from AsyncStorage:', error);
    });
  }

  function publishMessage(message: string) {
    try {
      // AsyncStorage'tan mqtt_topics değerini alıyoruz
          if (topics) {
            // Abonelik işlemini gerçekleştiriyoruz
            // Mesajı alınan konulara gönderiyoruz
            for (let topic = 0; topic < topics.length; topic++) {
              if(topic===0){
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
      // publishMessage(message);
      Toast.show({
        type: 'info',
        text1: 'Hata',
        text2: 'Tekrar Deneyiniz'
      });
    }
  }


  return (
    <><SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title='FARM DATAS'>
            <Text style={styles.highlight}>{message}</Text>
          </Section>

          <Section title='CONTROL YOUR FARM'>
            <View style={styles.buttonContainer}>
              <Button title='START IRRIGATION' onPress={() => publishMessage('OPEN')} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title='STOP IRRIGATION' onPress={() => publishMessage('CLOSE')} />
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView><Toast /></>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
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
});

export default App;
