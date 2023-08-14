import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';

export default class HomeScreen extends Component {
  state = {
    animationValue: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.timing(this.state.animationValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const animatedStyle = {
      opacity: this.state.animationValue,
      transform: [
        {
          translateY: this.state.animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
    };

    return (
      <View style={styles.container}>
        <Animated.Text style={[styles.text, animatedStyle]}>Daha önce kayıt oldunuz mu?</Animated.Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2196F3' }]}
            onPress={() => this.props.navigation.navigate('ClientSearch')}
          >
            <Text style={styles.buttonText}>Evet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FF5722' }]}
            onPress={() => this.props.navigation.navigate('ClientInsert')}
          >
            <Text style={styles.buttonText}>Hayır</Text>
          </TouchableOpacity>
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
    color:'black',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});