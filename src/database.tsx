import SQLite from 'react-native-sqlite-storage';

const databaseName = 'SmartIrrigation.db';
const databaseVersion = '1.0';
const databaseDisplayname = 'Smart Irrigation Database';
const databaseSize = 200000; // 200KB

const db = SQLite.openDatabase(
  {
    name: databaseName,
    location: 'default',
  },
  () => {
    console.log('Database opened successfully.');
  },
  (error) => {
    console.error('Error while opening database: ', error);
  },
);

const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        device_id TEXT NOT NULL,
        mqtt_topic TEXT NOT NULL
      );`,
      [],
      () => {
        console.log('Devices table created successfully.');
      },
      (error) => {
        console.error('Error while creating Devices table: ', error);
      },
    );
  });
};

export const initializeDatabase = () => {
  createTables();
};

export default db;