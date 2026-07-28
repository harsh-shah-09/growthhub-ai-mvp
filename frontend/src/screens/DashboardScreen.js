import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { careerApi } from '../api/careerApi';
import JobCard from '../components/JobCard';

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch jobs from the backend
      const jobsData = await careerApi.getJobs(0, 10);
      setJobs(jobsData);
      setError(null);
    } catch (err) {
      setError('Failed to load career data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.welcome}>Welcome back, {user?.full_name}!</Text>
      <Text style={styles.subtitle}>Recommended Opportunities</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logoText}>GrowthHub AI</Text>
        <Button title="Logout" color="#ff4444" onPress={() => dispatch(logout())} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <JobCard 
              title={item.title} 
              company={item.company} 
              location={item.location}
              type={item.job_type}
              url={item.url} 
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#007bff' },
  headerContainer: { padding: 16 },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5, marginBottom: 10 },
  errorText: { color: 'red', marginTop: 10 },
  loader: { flex: 1, justifyContent: 'center' }
});