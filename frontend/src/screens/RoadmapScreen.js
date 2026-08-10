import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const downloadPDF = (roadmapId) => {
  const url = `http://192.168.29.239:8000/api/v1/roadmaps/${roadmapId}/export-pdf`;
  Linking.openURL(url);
};

const ROADMAP_API = 'http://192.168.29.239:8000/api/v1/roadmaps/';

export default function RoadmapScreen({ token }) {
  const { isDarkMode } = useTheme();
  
  // Dynamic color palette based on global isDarkMode state
  const colors = {
    background: isDarkMode ? '#121212' : '#f0f2f5',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',         // The background of the roadmap card
    text: isDarkMode ? '#ffffff' : '#333333',         // The main text color
    subText: isDarkMode ? '#aaaaaa' : '#666666',      // The secondary text color
    borderColor: isDarkMode ? '#333333' : '#e0e0e0',  // The border of the card
    accent: isDarkMode ? '#66b3ff' : '#0056b3',       // The title highlight color
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

  const renderItem = ({ item }) => (
    // Apply dynamic card background here
    <View style={[styles.roadmapCard, { backgroundColor: colors.card }]}>
      
      {/* Apply dynamic border color here */}
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
      
      {/* Apply dynamic text colors here */}
      <Text style={[styles.description, { color: colors.text }]}>
        {item.description}
      </Text>
      
    </View>
  );

  return (
    // Apply dynamic screen background here
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

// I removed the hardcoded colors from the stylesheet below 
// since they are now being handled dynamically by the arrays above.
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
  }
});