import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ROADMAP_API = 'http://192.168.29.239:8000/api/v1/roadmaps/';

export default function RoadmapScreen({ token }) {
  const { isDarkMode } = useTheme();
  
  const colors = {
    background: isDarkMode ? '#121212' : '#f0f2f5',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#333333',
    subText: isDarkMode ? '#aaaaaa' : '#666666',
    borderColor: isDarkMode ? '#333333' : '#e0e0e0',
    accent: isDarkMode ? '#66b3ff' : '#0056b3',
    button: isDarkMode ? '#333333' : '#e6f0fa', // Button background color
  };

  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await axios.get(ROADMAP_API, { headers: { Authorization: `Bearer ${token}` } });
      setRoadmaps(response.data);
    } catch (error) {
      console.error('Error fetching roadmaps', error);
    }
  };

  // NEW: Handle native PDF download and sharing
  const handleDownloadPDF = async (roadmapId) => {
    try {
      const url = `http://192.168.29.239:8000/api/v1/roadmaps/${roadmapId}/export-pdf`;
      const fileUri = `${FileSystem.documentDirectory}Roadmap_${roadmapId}.pdf`;

      // Download directly to device storage, passing the secure token
      const { uri } = await FileSystem.downloadAsync(url, fileUri, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Trigger the native iOS/Android share sheet
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Download Complete', `File saved to: ${uri}`);
      }
    } catch (error) {
      console.error('Error downloading PDF', error);
      Alert.alert('Download Failed', 'Could not save the PDF.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.roadmapCard, { backgroundColor: colors.card }]}>
      
      <View style={[styles.cardHeader, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.targetCareer, { color: colors.accent }]}>
          {item.target_career}
        </Text>
        {item.degree_program && (
          <Text style={[styles.degree, { color: colors.subText }]}>
            {item.degree_program}
          </Text>
        )}
      </View>
      
      <Text style={[styles.description, { color: colors.text }]}>
        {item.description}
      </Text>
      
      {/* NEW: Native Download Button */}
      <TouchableOpacity 
        style={[styles.downloadButton, { backgroundColor: colors.button }]} 
        onPress={() => handleDownloadPDF(item.id)}
      >
        <Text style={[styles.downloadButtonText, { color: colors.accent }]}>
          Export as PDF
        </Text>
      </TouchableOpacity>
      
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Career Roadmaps</Text>
      <FlatList
        data={roadmaps}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.subText }]}>
            No roadmaps generated yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    padding: 20 
  },
  listContainer: { 
    paddingHorizontal: 20, 
    paddingBottom: 20 
  },
  roadmapCard: { 
    borderRadius: 12, 
    padding: 20, 
    marginBottom: 15, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5 
  },
  cardHeader: { 
    borderBottomWidth: 1, 
    paddingBottom: 10, 
    marginBottom: 10 
  },
  targetCareer: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  degree: { 
    fontSize: 14, 
    marginTop: 5 
  },
  description: { 
    fontSize: 15, 
    lineHeight: 22 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 16 
  },
  // NEW: Button Styles
  downloadButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});