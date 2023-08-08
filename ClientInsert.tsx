import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Button, Alert } from 'react-native';
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
    this.state = { user_id: '', picodevices_id: '', mqtt_topics: '' };
  }
  
  handleSearchButtonClick = () => {
    this.props.navigation.navigate('SetScreen'); 
  };

  InsertRecord = () => {
    var user_id = this.state.user_id;
    var picodevices_id = this.state.picodevices_id;
    var mqtt_topics = this.state.mqtt_topics;
  
    if (user_id.length === 0 || picodevices_id.length === 0 || mqtt_topics.length === 0) {
      Alert.alert("Required field is missing");
    } else {
      var InsertAPIURL = "http://10.0.2.2:80/api/insert.php";
  
      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      var Data = {
        user_id: user_id,
        picodevices_id: picodevices_id,
        mqtt_topics: mqtt_topics
      };
  
      fetch(InsertAPIURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data)
      })
        .then((response) => response.json())
        .then((response) => {
          Alert.alert(response[0].Message);
        })
        .catch((error) => {
          Alert.alert("Error: " + error);
        });
  
      // Veriyi AsyncStorage'e kaydet
      AsyncStorage.setItem('mqtt_topics', mqtt_topics)
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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.ViewStyle}>
          <TextInput
            placeholder={"user_id"}
            placeholderTextColor="#f00"
            keyboardType={"numeric"}
            style={styles.txtSyle}
            onChangeText={(user_id) => this.setState({ user_id })}
          />
          <TextInput
            placeholder={"picodevices_id"}
            placeholderTextColor="#f00"
            style={styles.txtSyle}
            onChangeText={(picodevices_id) => this.setState({ picodevices_id })}
          />
          <TextInput
            placeholder={"mqtt_topics"}
            placeholderTextColor="#f00"
            style={styles.txtSyle}
            onChangeText={(mqtt_topics) => this.setState({ mqtt_topics })}
          />
          <Button title='Save Record' onPress={this.InsertRecord} />
        </View>
        
        <View style={styles.ViewStyle}>
          <Button title="Devam" onPress={this.handleSearchButtonClick} />
        </View>
      
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  ViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  txtSyle: {
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
