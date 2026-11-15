import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext'; // ✅ Fixed: token from context, not props

export default function ChatScreen() {
  const { userToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axiosClient.get('/chat/', {
        headers: { Authorization: `Bearer ${userToken}` },
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
      const response = await axiosClient.post(
        '/chat/',
        { sender_role: 'user', message: userMessage.message },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      // Backend returns [userMsg, aiMsg] — replace the optimistic entry with real data
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== userMessage.id),
        ...response.data,
      ]);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
  inputContainer: {
    flexDirection: 'row', padding: 10,
    backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd',
  },
  input: {
    flex: 1, backgroundColor: '#f9f9f9', borderRadius: 20,
    paddingHorizontal: 15, paddingVertical: 10, fontSize: 16,
  },
  sendButton: {
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 10, paddingHorizontal: 15,
    backgroundColor: '#007bff', borderRadius: 20,
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  loader: { marginVertical: 10 },
});
