import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const ROADMAP_API = 'http://192.168.29.239:8000/api/v1/roadmaps/';

export default function RoadmapScreen({ token }) {
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
    <View style={styles.roadmapCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.targetCareer}>{item.target_career}</Text>
        {item.degree_program && <Text style={styles.degree}>{item.degree_program}</Text>}
      </View>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Career Roadmaps</Text>
      <FlatList
        data={roadmaps}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No roadmaps generated yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  title: { fontSize: 22, fontWeight: 'bold', padding: 20, color: '#333' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  roadmapCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardHeader: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 10 },
  targetCareer: { fontSize: 20, fontWeight: 'bold', color: '#0056b3' },
  degree: { fontSize: 14, color: '#666', marginTop: 5 },
  description: { fontSize: 15, color: '#444', lineHeight: 22 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 50, fontSize: 16 }
});