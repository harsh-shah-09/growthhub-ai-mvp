import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

// Replace 192.168.1.X with your actual IP!
const API_URL = 'http://192.168.29.239:8000/api/v1/chat/'; // Use your local IP or 10.0.2.2 for Android emulator

export default function ChatScreen({ token }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch chat history', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { sender_role: 'user', message: inputText, id: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        { sender_role: 'user', message: userMessage.message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // The backend returns an array with both the user message and AI response
      setMessages((prev) => [...prev.filter(m => m.id !== userMessage.id), ...response.data]);
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender_role === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
          {item.message}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />
      {loading && <ActivityIndicator size="small" color="#007bff" style={styles.loader} />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask for career advice..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  chatContainer: { padding: 15, paddingBottom: 20 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 15, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007bff', borderBottomRightRadius: 0 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#e5e5ea', borderBottomLeftRadius: 0 },
  messageText: { fontSize: 16 },
  userText: { color: '#fff' },
  aiText: { color: '#000' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
  input: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16 },
  sendButton: { justifyContent: 'center', alignItems: 'center', marginLeft: 10, paddingHorizontal: 15, backgroundColor: '#007bff', borderRadius: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  loader: { marginVertical: 10 }
});