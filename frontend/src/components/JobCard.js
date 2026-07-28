import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function JobCard({ title, company, location, type, url }) {
  const openLink = () => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.company}>{company}</Text>
      {location && <Text style={styles.details}>📍 {location}</Text>}
      {type && <Text style={styles.details}>💼 {type}</Text>}
      
      <TouchableOpacity style={styles.button} onPress={openLink}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  company: { fontSize: 16, color: '#666', marginBottom: 5 },
  details: { fontSize: 14, color: '#888', marginTop: 2 },
  button: {
    marginTop: 15,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});