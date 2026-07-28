import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// NOTE: If using an Android Emulator, localhost is 10.0.2.2
// If testing on a physical device, use your computer's Wi-Fi IPv4 address (e.g., 192.168.1.5)
const BASE_URL = 'http://192.168.29.239:8000/api/v1'; 

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Automatically attach the JWT token to every request if it exists
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;