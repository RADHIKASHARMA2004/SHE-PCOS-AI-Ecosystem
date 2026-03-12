import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../api/client';

export default function CycleTracker() {
  const [flow, setFlow] = useState('');
  const [pain, setPain] = useState('');
  const [showLogged, setShowLogged] = useState(false);

  const [loading, setLoading] = useState(false);

  // Mock calendar days
  const days = Array.from({length: 30}, (_, i) => i + 1);

  const handleLog = async () => {
    setLoading(true);
    let dayToLog = 1; // Default to the 1st of the month for the MVP demo if no hard calendar selection exists
    const mockDate = new Date();
    mockDate.setDate(dayToLog);

    try {
      const res = await apiClient.post('/cycle/log', {
         start_date: mockDate.toISOString(),
         flow_intensity: flow || 'Medium',
         symptoms: ['cramps']
      });

      if (res.data.predicted_next_period) {
         Alert.alert("Period Logged", `Your next period is predicted around: ${res.data.predicted_next_period.substring(0, 10)}`);
      }

      setShowLogged(true);
      setTimeout(() => setShowLogged(false), 3000);
    } catch (e) {
      Alert.alert("Error", "Could not log cycle to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold text-[#FF6B6B] mb-2">Cycle Tracker</Text>
        <Text className="text-gray-600 mb-6">Predicted Ovulation: Day 14</Text>

        <View className="bg-gray-50 rounded-2xl p-4 mb-6 shadow-sm">
          <Text className="font-bold text-lg mb-4 text-center">October 2026</Text>
          <View className="flex-row flex-wrap justify-center">
            {days.map(day => (
              <View 
                key={day} 
                className={`w-10 h-10 m-1 rounded-full items-center justify-center ${
                  day >= 10 && day <= 14 ? 'bg-[#FF6B6B]' : 
                  day === 24 ? 'bg-[#4ECDC4]' : 'bg-white border border-gray-200'
                }`}
              >
                <Text className={day >= 10 && day <= 14 || day === 24 ? 'text-white font-bold' : 'text-gray-700'}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
          <View className="flex-row justify-center mt-4 space-x-4">
            <View className="flex-row items-center"><View className="w-3 h-3 rounded-full bg-[#FF6B6B] mr-2" /><Text>Period</Text></View>
            <View className="flex-row items-center ml-4"><View className="w-3 h-3 rounded-full bg-[#4ECDC4] mr-2" /><Text>Ovulation</Text></View>
          </View>
        </View>

        <Text className="text-xl font-bold mb-4">Log Today</Text>
        <View className="mb-4">
          <Text className="font-semibold mb-2">Flow Intensity (Light, Medium, Heavy)</Text>
          <TextInput 
            className="border border-gray-300 rounded-lg p-3 bg-white"
            placeholder="e.g. Medium"
            value={flow}
            onChangeText={setFlow}
          />
        </View>

        <View className="mb-6">
          <Text className="font-semibold mb-2">Pain Level (1-10)</Text>
          <TextInput 
            className="border border-gray-300 rounded-lg p-3 bg-white"
            placeholder="e.g. 5"
            keyboardType="numeric"
            value={pain}
            onChangeText={setPain}
          />
        </View>

        <TouchableOpacity 
          className="bg-[#FF6B6B] p-4 rounded-xl items-center"
          onPress={handleLog}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="white" />
          ) : (
             <Text className="text-white font-bold text-lg">Save Log</Text>
          )}
        </TouchableOpacity>

        {showLogged && (
          <Text className="text-green-500 font-bold text-center mt-4">Successfully logged today's cycle data!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
