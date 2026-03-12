import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('user1'); // Default seeded user for demo
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (!success) {
      Alert.alert('Login Failed', 'Check your username and password.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
      <Text className="text-4xl font-bold text-[#FF6B6B] mb-2">SHE</Text>
      <Text className="text-gray-500 mb-8 text-center">Your personalized PCOS Ecosystem</Text>
      
      <View className="w-full">
        <Text className="font-bold text-gray-700 mb-2">Username</Text>
        <TextInput 
          className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <Text className="font-bold text-gray-700 mb-2">Password</Text>
        <TextInput 
          className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          className="bg-[#4ECDC4] p-4 rounded-xl items-center shadow-sm"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white font-bold text-lg">{loading ? 'Logging in...' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
