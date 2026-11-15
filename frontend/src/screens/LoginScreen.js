import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axiosClient from '../api/axiosClient';

export default function LoginScreen() {
  const { login } = useAuth();
  const { isDarkMode } = useTheme();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    background: isDarkMode ? '#121212' : '#f4f6f8',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#333333',
    subText: isDarkMode ? '#aaaaaa' : '#777777',
    inputBg: isDarkMode ? '#2a2a2a' : '#ffffff',
    border: isDarkMode ? '#333333' : '#dddddd',
    button: '#0056b3',
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      // OAuth2PasswordRequestForm requires form-data format
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await axiosClient.post('/auth/login', formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      await login(res.data.access_token);
    } catch (error) {
      console.error('Login error:', error.response?.data);
      Alert.alert(
        'Login Failed',
        error.response?.data?.detail || 'Invalid credentials or server unavailable.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    try {
      // 1. Register the account
      await axiosClient.post('/auth/register', {
        full_name: fullName,
        email,
        password,
      });
      // 2. Auto-login after registration
      await handleLogin();
    } catch (error) {
      console.error('Register error:', error.response?.data);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.detail || 'Could not create account. Try a different email.'
      );
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          {mode === 'login'
            ? 'Sign in to access your roadmaps'
            : 'Join GrowthHub AI for free'}
        </Text>

        {mode === 'register' && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Full Name"
            placeholderTextColor={colors.subText}
            value={fullName}
            onChangeText={setFullName}
          />
        )}

        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
          placeholder="Email address"
          placeholderTextColor={colors.subText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
          placeholder="Password"
          placeholderTextColor={colors.subText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button }, isLoading && styles.buttonDisabled]}
          onPress={mode === 'login' ? handleLogin : handleRegister}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchMode}
          onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          <Text style={[styles.switchModeText, { color: colors.button }]}>
            {mode === 'login'
              ? "Don't have an account? Register"
              : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  card: {
    padding: 24, borderRadius: 16, borderWidth: 1,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  input: {
    height: 50, borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, marginBottom: 16, fontSize: 16,
  },
  button: {
    height: 50, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { backgroundColor: '#6c757d' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  switchMode: { marginTop: 20, alignItems: 'center' },
  switchModeText: { fontSize: 14, fontWeight: '500' },
});
