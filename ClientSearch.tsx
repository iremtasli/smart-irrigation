import React, { Component } from 'react';
import { TextInput, View, Button, StyleSheet, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default class ClientSearch extends Component {
  styles: any;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = { Finduser_id: '', user_id: '', picodevice_id: '', mqtt_topics: '' };
  }

  handleInsertButtonClick = () => {
    this.props.navigation.navigate('SetScreen'); // ClientInsert ekranına yönlendirme
  };

  SearchRecord = () => {
    var Finduser_id = this.state.Finduser_id;
    if (Finduser_id.length === 0) {
      Alert.alert('Required field is missing');
    } else {
      var SerachAPIURL = "http://10.0.2.2:80/api/search.php";

      var header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      var Data = {
        Finduser_id: Finduser_id
      };
      fetch(
        SerachAPIURL,
        {
          method: 'POST',
          headers: header,
          body: JSON.stringify(Data)
        }
      )
        .then((response) => response.json())
        .then((response) => {
          this.setState({ user_id: response[0].user_id });
          this.setState({ picodevice_id: response[0].picodevice_id });
          this.setState({ mqtt_topics: response[0].mqtt_topics });
        })
        .catch((error) => {
          Alert.alert("Error: " + error);
        });
    }
  };

  render() {
    return (
      <View style={styles.ViewStyle}>
        <TextInput
          placeholder={'Enter user id'}
          placeholderTextColor="#f00"
          keyboardType="numeric"
          style={styles.txtStyle}
          onChangeText={(Finduser_id) => this.setState({ Finduser_id })}
        />
        <Button
          title="Find Record"
          onPress={this.SearchRecord}
        />
        <TextInput
          style={styles.txtStyle}
          value={this.state.user_id}
        />
        <TextInput
          style={styles.txtStyle}
          value={this.state.picodevice_id}
        />
        <TextInput
          style={styles.txtStyle}
          value={this.state.mqtt_topics}
        />
        
        <View style={styles.ViewStyle}>
          <Button title="Devam" onPress={this.handleInsertButtonClick} />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  ViewStyle: {
    flex: 1,
    padding: 1,
    marginTop: 10,
  },
  txtStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    marginBottom: 20,
  },
});