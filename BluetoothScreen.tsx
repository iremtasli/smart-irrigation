import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [wifiName, setWifiName] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  const [picoDeviceId, setPicoDeviceId] = useState('');
  const [mqttTopics, setMqttTopics] = useState<string[]>(['']);

  const navigation = useNavigation(); // Use the navigation hook

  useEffect(() => {
    BluetoothSerial.isConnected().then((isConnected) => {
      if (!isConnected) {
        if (selectedDevice && selectedDevice.id) {
          BluetoothSerial.connect(selectedDevice.id)
            .then(() => {
              console.log('Connected to Bluetooth device');
              setConnectionStatus(`Bağlantı Başarılı: ${selectedDevice.name}`);
              BluetoothSerial.on('data', (data) => {
                console.log('Data received from Bluetooth:', data);
                
              });
            })
            .catch((err) => {
              console.error('Bluetooth connection error:', err);
            });
        }
      }
    });

    return () => {
      BluetoothSerial.disconnect();
    };
  }, [selectedDevice]);

  useEffect(() => {
    let interval;
  
    BluetoothSerial.on('data', (data) => {
      console.log('Bluetooth ile gelen veri:', data);
      if (data.trim() !== '') {
        setMessage(data);
      }
    });
  
    interval = setInterval(() => {
      BluetoothSerial.readFromDevice().then((data) => {
        if (data.trim() !== '') {
        console.log('Read data from device:', data);
        if (data.trim() !== '' && data.trim() !== message.trim()) {
          setMessage(data);
        }
        if (data.includes('\n')) {
          const receivedData = data.trim();
          const dataParts = receivedData.split(',');
          console.log('Received Pico Device ID:', dataParts[0]);
          console.log('Received MQTT Topics:', dataParts.slice(1));
          setPicoDeviceId(dataParts[0]);
          setMqttTopics(dataParts.slice(1));
          setMessage(receivedData);
        }
      }
      });
    }, 5000);
  
    return () => {
      BluetoothSerial.removeAllListeners('data'); 
      clearInterval(interval);
    };
  }, [message]);
  
  useEffect(() => {
    BluetoothSerial.list().then((devices) => {
      setAvailableDevices(devices);
    });
  }, [modalVisible]);

  const sendText = () => {
    if (wifiName !== '' && wifiPassword !== '') {
      const wifiData = `wifidata=${wifiName},${wifiPassword}\n`;
      console.log('Send WiFi data to device:', wifiData);
      BluetoothSerial.write(wifiData)
        .then(() => {
          console.log('WiFi data sent successfully');
          setWifiName('');
          setWifiPassword('');
        })
        .catch((err) => {
          console.error('Error sending WiFi data:', err);
        });
    }
  };

  useEffect(() => {
    console.log('picoDeviceId:', picoDeviceId);
    console.log('mqttTopics:', mqttTopics);

    if (mqttTopics.length > 0 && picoDeviceId !== '') {
      console.log('Navigating to ClientInsert:', picoDeviceId, mqttTopics);
      navigateToClientInsert();
    }
  }, [picoDeviceId, mqttTopics]);

  const navigateToClientInsert = () => {
    if (picoDeviceId !== '' && mqttTopics.length > 0) {
      navigation.navigate('ClientInsert', {
        picoDeviceId: picoDeviceId,
        mqttTopics: mqttTopics,
      });
    } else {
      console.warn('Invalid data to navigate');
    }
  };

  const openBluetoothModal = () => {
    setModalVisible(true);
  };

  const closeBluetoothModal = () => {
    setModalVisible(false);
  };

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    closeBluetoothModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.connectionStatus}>{connectionStatus}</Text>
      <Text style={styles.highlight}>{message.trim() !== '' ? message : 'No data received'}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="WiFi İsmi"
          value={wifiName}
          onChangeText={setWifiName}
        />
        <TextInput
          style={styles.input}
          placeholder="WiFi Şifresi"
          value={wifiPassword}
          onChangeText={setWifiPassword}
        />
      </View>
      <Button title="WiFi Verisini Gönder" onPress={sendText} />
      <Button title="Bluetooth Cihazları" onPress={openBluetoothModal} />
      

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.buttonContainer} onPress={closeBluetoothModal}>
            <Button title="Kapat" onPress={closeBluetoothModal} />
          </TouchableOpacity>
          <FlatList
            data={availableDevices}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.deviceItem} onPress={() => handleDeviceSelect(item)}>
                <Text style={styles.deviceName}>{item.name}</Text>
                <Text style={styles.deviceId}>{item.id}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  connectionStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  highlight: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    marginTop: 10,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 50,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 10,
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceId: {
    fontSize: 12,
    color: '#888',
  },
});

export default App;
