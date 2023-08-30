import React, { Component } from 'react';
import { View, StyleSheet, Text, Button, Alert, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';

export default class ClientInsert extends Component {
  constructor(props: {} | Readonly<{}>) {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {},
    });
    super(props);
    this.state = {
      user_id: '', // get from user
    };
  }

  handleSearchButtonClick = () => {
    this.props.navigation.navigate('ClientSearch'); 
  };

  InsertRecord = () => {
    var user_id = this.state.user_id;

    if (user_id.length === 0) {
      Alert.alert('Required field is missing');
    } else {
      var InsertAPIURL = 'http://192.168.31.232:80/api/insert.php';

      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      var Data = {
        user_id: user_id,
        picodevices_id: this.props.route.params.picoDeviceId, // get from bluetooth
        mqtt_topics: this.props.route.params.mqttTopics.join(', '), // get from bluetooth
      };

      fetch(InsertAPIURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log('Parsed JSON Response:', response);
          Alert.alert(response[0].Message);
        })
        .catch((error) => {
          Alert.alert('Error: ' + error);
        });

      // save data in AsyncStorage
      AsyncStorage.setItem('mqtt_topics', this.props.route.params.mqttTopics.join(', '))
        .then(() => {
          console.log('mqtt_topics saved to AsyncStorage');
        })
        .catch((error) => {
          console.log('Error saving mqtt_topics to AsyncStorage:', error);
        });
    }
  };

  render() {
    return (
      <GestureHandlerRootView style={styles.container}>
        <Text style={styles.label}>USER ID: {this.state.user_id}</Text>

        <Text style={styles.label}>PICO DEVICE ID: {this.props.route.params.picoDeviceId}</Text>
        <Text style={styles.label}>MQTT TOPICS: {this.props.route.params.mqttTopics.join(', ')}</Text>
        <TextInput
        placeholder="USER ID"
        placeholderTextColor='black'
        keyboardType='default'
        style={styles.input}
        onChangeText={(user_id) => this.setState({user_id})}
      />
        <View style={styles.buttonContainer}>
          <Button title="Save Record" onPress={this.InsertRecord} />
        </View>
       
        <View style={styles.buttonContainer}>
          <Button title="Devam" onPress={this.handleSearchButtonClick} />
        </View>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  input:{
    borderColor:'gray',
    borderWidth:1,
    width:200,
    height:40,
    marginBottom:16,
    paddingHorizontal:8,
  },
  buttonContainer: {
    width: 200,
    marginVertical: 10,
  },
});