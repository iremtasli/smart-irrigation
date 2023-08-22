import React, { Component } from 'react';
import { TextInput, View, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ClientSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Finduser_id: '',
      user_id: '',
      picodevice_id: '',
      mqtt_topics: '',
    };
  }

  SearchRecord = () => {
    const { Finduser_id } = this.state;

    if (Finduser_id.length === 0) {
      Alert.alert('Required field is missing');
    } else {
      const SerachAPIURL = 'http://192.168.31.232:80/api/search.php';

      const header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      const Data = {
        Finduser_id: Finduser_id,
      };

      fetch(SerachAPIURL, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response && response.length > 0) {
            const mqtt_topics = response[0].mqtt_topics; // MQTT Topics verisini al

            if (mqtt_topics) {
              const topicsArray = mqtt_topics.split(',').map((topic) => topic.trim());

              // Veriyi AsyncStorage'e kaydet
              AsyncStorage.setItem('mqtt_topics', mqtt_topics)
                .then(() => {
                  console.log('mqtt_topics saved to AsyncStorage');
                })
                .catch((error) => {
                  console.log('Error saving mqtt_topics to AsyncStorage:', error);
                });

              // userData nesnesini oluştur
              const userData = {
                user_id: response[0].user_id,
                picodevice_id: response[0].picodevice_id,
                mqtt_topics: topicsArray,
              };

              this.props.navigation.navigate('SetScreen', {
                userData: userData,
              });
            } else {
              Alert.alert('No MQTT Topics found for the user.');
            }
          } else {
            Alert.alert('User not found.');
          }
        })
        .catch((error) => {
          Alert.alert('Error: ' + error);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Enter your username"
          placeholderTextColor="black"
          keyboardType="default"
          style={styles.input}
          onChangeText={(Finduser_id) => this.setState({ Finduser_id })}
        />
        <Button title="Find Record" onPress={this.SearchRecord} />
        <TextInput
          style={styles.resultText}
          value={`User ID: ${this.state.user_id}`}
          editable={false}
        />
        <TextInput
          style={styles.resultText}
          value={`Device ID: ${this.state.picodevice_id}`}
          editable={false}
        />
        <TextInput
          style={styles.resultText}
          value={`MQTT Topics: ${this.state.mqtt_topics}`}
          editable={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
});