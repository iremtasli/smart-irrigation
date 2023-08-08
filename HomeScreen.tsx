import React, { Component } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Daha önce kayıt oldunuz mu?</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Evet"
            onPress={() => this.props.navigation.navigate('ClientSearch')}
          />
          <Button
            title="Hayır"
            onPress={() => this.props.navigation.navigate('ClientInsert')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});
