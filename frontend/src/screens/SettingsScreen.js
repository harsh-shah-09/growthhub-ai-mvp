import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import LoadingOverlay from '../components/LoadingOverlay';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [degreeField, setDegreeField] = useState('computer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>App Preferences</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="moon" size={24} color="#555" />
            <Text style={styles.rowText}>Dark Mode</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="notifications" size={24} color="#555" />
            <Text style={styles.rowText}>Push Notifications</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
      </View>

      <Text style={styles.header}>Academic Profile</Text>

      <View style={styles.section}>
        <View style={styles.pickerContainer}>
          <View style={styles.iconTextContainer}>
            <FontAwesome5 name="user-graduate" size={20} color="#555" />
            <Text style={styles.rowText}>B.Tech / M.Tech Specialization</Text>
          </View>
          <Picker
            selectedValue={degreeField}
            onValueChange={(itemValue) => setDegreeField(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Computer Engineering" value="computer" />
            <Picker.Item label="Information Technology (IT)" value="it" />
            <Picker.Item label="Artificial Intelligence & Data Science (AI/DS)" value="aids" />
            <Picker.Item label="Electronics & Telecommunication (EXTC)" value="extc" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#ffffff" />
        <Text style={styles.buttonText}>Save Preferences</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#ffffff" />
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      {isLoading && <LoadingOverlay message="Saving Preferences..." />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginLeft: 50,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  pickerContainer: {
    padding: 16,
  },
  picker: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#0056b3',
    padding: 16,
    borderRadius: 12,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  }
});

export default SettingsScreen;