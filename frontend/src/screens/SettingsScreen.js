import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import LoadingOverlay from '../components/LoadingOverlay';
import { useTheme } from '../context/ThemeContext'; // Import the custom hook

const SettingsScreen = () => {
  // Replace local state with global context
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [degreeField, setDegreeField] = useState('computer');
  const [isLoading, setIsLoading] = useState(false);

  const handleNotificationToggle = (value) => {
    setNotifications(value);
    if (value) {
      Alert.alert("Notifications Enabled", "You will now receive alerts for your academic roadmap.");
    } else {
      Alert.alert("Notifications Muted", "You will no longer receive push notifications.");
    }
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Your preferences have been saved!");
    }, 2000);
  };

  // Dynamic color palette based on global isDarkMode state
  const colors = {
    background: isDarkMode ? '#121212' : '#f4f6f8',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#333333',
    subText: isDarkMode ? '#aaaaaa' : '#888888',
    divider: isDarkMode ? '#333333' : '#eeeeee',
    pickerBg: isDarkMode ? '#2c2c2c' : '#f9f9f9',
    icon: isDarkMode ? '#cccccc' : '#555555'
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.subText }]}>App Preferences</Text>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.row}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="moon" size={24} color={colors.icon} />
            <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme} 
            trackColor={{ false: "#767577", true: "#0056b3" }}
            thumbColor={"#ffffff"}
          />
        </View>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <View style={styles.row}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="notifications" size={24} color={colors.icon} />
            <Text style={[styles.rowText, { color: colors.text }]}>Push Notifications</Text>
          </View>
          <Switch 
            value={notifications} 
            onValueChange={handleNotificationToggle}
            trackColor={{ false: "#767577", true: "#0056b3" }}
            thumbColor={"#ffffff"}
          />
        </View>
      </View>

      <Text style={[styles.header, { color: colors.subText }]}>Academic Profile</Text>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.pickerContainer}>
          <View style={styles.iconTextContainer}>
            <FontAwesome5 name="user-graduate" size={20} color={colors.icon} />
            <Text style={[styles.rowText, { color: colors.text }]}>B.Tech / M.Tech Specialization</Text>
          </View>
          <Picker
            selectedValue={degreeField}
            onValueChange={(itemValue) => setDegreeField(itemValue)}
            style={[styles.picker, { backgroundColor: colors.pickerBg, color: colors.text }]}
            dropdownIconColor={colors.icon}
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
    padding: 20,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
  },
  section: {
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
    marginLeft: 50,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 16,
    marginLeft: 12,
  },
  pickerContainer: {
    padding: 16,
  },
  picker: {
    marginTop: 10,
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