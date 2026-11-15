import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext'; // ✅ Fixed: token from context, not props

export default function PortfolioScreen() {
  const { userToken } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [form, setForm] = useState({
    project_title: '',
    description: '',
    github_url: '',
    tech_stack: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/portfolios/', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setPortfolios(response.data);
    } catch (error) {
      console.error('Error fetching portfolios', error);
    } finally {
      setLoading(false);
    }
  };

  const addPortfolio = async () => {
    if (!form.project_title || !form.description) {
      Alert.alert('Validation', 'Project title and description are required.');
      return;
    }
    setSaving(true);
    try {
      const response = await axiosClient.post('/portfolios/', form, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setPortfolios([...portfolios, response.data]);
      setForm({ project_title: '', description: '', github_url: '', tech_stack: '' });
    } catch (error) {
      console.error('Error creating portfolio entry', error);
      Alert.alert('Error', 'Failed to save project. Please try again.');
    } finally {
      setSaving(false);
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
      <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Add New Project</Text>
        <TextInput
          style={styles.input}
          placeholder="Project Title *"
          value={form.project_title}
          onChangeText={(text) => setForm({ ...form, project_title: text })}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description *"
          multiline
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Tech Stack (e.g., React Native, Python)"
          value={form.tech_stack}
          onChangeText={(text) => setForm({ ...form, tech_stack: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="GitHub URL"
          value={form.github_url}
          onChangeText={(text) => setForm({ ...form, github_url: text })}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.addButton, saving && styles.addButtonDisabled]}
          onPress={addPortfolio}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.addButtonText}>Save to Portfolio</Text>
          }
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.listHeader}>My Projects</Text>
      {loading
        ? <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        : (
          <FlatList
            data={portfolios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No projects yet. Add your first one above!</Text>
            }
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  formContainer: { padding: 20, backgroundColor: '#fff', marginBottom: 10, elevation: 3 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: {
    backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 12, marginBottom: 10,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  addButton: {
    backgroundColor: '#28a745', padding: 15, borderRadius: 8,
    alignItems: 'center', marginTop: 5,
  },
  addButtonDisabled: { backgroundColor: '#6c757d' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listHeader: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardDesc: { color: '#555', marginBottom: 10 },
  cardTech: { fontWeight: '600', color: '#333', marginBottom: 5 },
  cardLink: { color: '#007bff' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20, fontSize: 15 },
});
