import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const PORTFOLIO_API = 'http://192.168.29.239:8000/api/v1/portfolios/';

export default function PortfolioScreen({ token }) {
  const [portfolios, setPortfolios] = useState([]);
  const [form, setForm] = useState({ project_title: '', description: '', github_url: '', tech_stack: '' });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await axios.get(PORTFOLIO_API, { headers: { Authorization: `Bearer ${token}` } });
      setPortfolios(response.data);
    } catch (error) {
      console.error('Error fetching portfolios', error);
    }
  };

  const addPortfolio = async () => {
    if (!form.project_title || !form.description) return;
    try {
      const response = await axios.post(PORTFOLIO_API, form, { headers: { Authorization: `Bearer ${token}` } });
      setPortfolios([...portfolios, response.data]);
      setForm({ project_title: '', description: '', github_url: '', tech_stack: '' });
    } catch (error) {
      console.error('Error creating portfolio', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.project_title}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
      {item.tech_stack ? <Text style={styles.cardTech}>Stack: {item.tech_stack}</Text> : null}
      {item.github_url ? <Text style={styles.cardLink}>{item.github_url}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <Text style={styles.header}>Add New Project</Text>
        <TextInput style={styles.input} placeholder="Project Title" value={form.project_title} onChangeText={(text) => setForm({ ...form, project_title: text })} />
        <TextInput style={[styles.input, styles.textArea]} placeholder="Description" multiline value={form.description} onChangeText={(text) => setForm({ ...form, description: text })} />
        <TextInput style={styles.input} placeholder="Tech Stack (e.g., React, Python)" value={form.tech_stack} onChangeText={(text) => setForm({ ...form, tech_stack: text })} />
        <TextInput style={styles.input} placeholder="GitHub URL" value={form.github_url} onChangeText={(text) => setForm({ ...form, github_url: text })} />
        
        <TouchableOpacity style={styles.addButton} onPress={addPortfolio}>
          <Text style={styles.addButtonText}>Save to Portfolio</Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.listHeader}>My Projects</Text>
      <FlatList
        data={portfolios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  formContainer: { padding: 20, backgroundColor: '#fff', marginBottom: 10, elevation: 3 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10 },
  textArea: { height: 80, textAlignVertical: 'top' },
  addButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listHeader: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardDesc: { color: '#555', marginBottom: 10 },
  cardTech: { fontWeight: '600', color: '#333', marginBottom: 5 },
  cardLink: { color: '#007bff' }
});