import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android Emulator, localhost is 10.0.2.2. For iOS it's usually localhost or 127.0.0.1
// If testing on a physical device, this MUST be the IP address of your computer on the local Wi-Fi (e.g., 192.168.1.x)
// Dynamic base URL: uses current hostname on web, or local Wi-Fi IP for mobile/emulators
const getBaseUrl = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:8000`;
  }
  return 'http://192.168.1.6:8000';
};

const BASE_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // 5 seconds timeout to prevent hanging forever
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const getAuthTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      setAuthToken(token);
    }
    return token;
  } catch (e) {
    console.error("Error reading token from storage", e);
    return null;
  }
};
