// MqttTopicList.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import db from './database';

interface MqttTopicListProps {
  userId: number;
}

const MqttTopicList: React.FC<MqttTopicListProps> = ({ userId }) => {
  const [mqttTopics, setMqttTopics] = useState<string[]>([]);

  useEffect(() => {
    // Veritabanından MqttTopic'leri getir
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT mqtt_topic FROM users WHERE user_id = ?',
        [userId],
        (_, result) => {
          const topics: string[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            topics.push(result.rows.item(i).mqtt_topic);
          }
          setMqttTopics(topics);
        },
        (error) => {
          console.error('Error while fetching MqttTopics from the database: ', error);
        },
      );
    });
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MqttTopic List</Text>
      {mqttTopics.length === 0 ? (
        <Text>No MqttTopics found for this user.</Text>
      ) : (
        <FlatList
          data={mqttTopics}
          renderItem={({ item }) => <Text>{item}</Text>}
          keyExtractor={(item) => item}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default MqttTopicList;
