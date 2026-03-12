import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ navigation }: any) {
  const { logout } = useAuth();
  const [healthScore, setHealthScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskScore();
  }, []);

  const fetchRiskScore = async () => {
    try {
      const res = await apiClient.post('/ai/predict-risk', {});
      
      if (res.data.error) {
         setRiskLevel("Model Untrained");
      } else {
         setHealthScore(res.data.hormone_health_score);
         setRiskLevel(res.data.pcos_risk_binary === 1 ? "HIGH RISK" : "LOW RISK");
      }
    } catch (e) {
      setRiskLevel("API Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">Hi, User 👋</Text>
          <TouchableOpacity onPress={logout}>
            <View className="bg-red-100 px-3 py-1 rounded-full items-center justify-center">
              <Text className="text-red-500 font-bold">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="bg-[#4ECDC4] p-6 rounded-2xl mb-6 shadow-md">
          <Text className="text-white text-lg font-semibold mb-2">Hormone Health Score</Text>
          <View className="flex-row items-end">
            {loading ? <ActivityIndicator color="white" /> : (
               <>
                 <Text className="text-white text-5xl font-bold">{healthScore}</Text>
                 <Text className="text-white text-xl mb-1 ml-1">/ 100</Text>
               </>
            )}
          </View>
          <Text className="text-white mt-2 opacity-90">Based on ML Model Predictions.</Text>
        </View>

        <View className="bg-white p-6 rounded-2xl mb-6 shadow-lg border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">PCOS Risk Meter</Text>
            <Text className="text-white bg-green-500 px-3 py-1 rounded-full font-bold">{riskLevel}</Text>
          </View>
          <Text className="text-gray-600">Based on your latest logs, your risk profile is stable. Keep up the good work and maintain your diet.</Text>
        </View>

        <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
        <View className="flex-row justify-between flex-wrap">
          <TouchableOpacity 
            className="w-[48%] bg-[#FF6B6B] p-4 rounded-xl mb-4 items-center shadow-sm"
            onPress={() => navigation.navigate('Cycle')}
          >
            <Text className="text-3xl mb-2">🩸</Text>
            <Text className="text-white font-bold">Log Period</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-[48%] bg-[#FFE66D] p-4 rounded-xl mb-4 items-center shadow-sm"
            onPress={() => navigation.navigate('Food')}
          >
            <Text className="text-3xl mb-2">🥗</Text>
            <Text className="text-gray-800 font-bold">Add Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-[48%] bg-[#a55eea] p-4 rounded-xl mb-4 items-center shadow-sm"
            onPress={() => navigation.navigate('AI Lab')}
          >
            <Text className="text-3xl mb-2">🤖</Text>
            <Text className="text-white font-bold">Ask Coach</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-[48%] bg-[#2d98da] p-4 rounded-xl mb-4 items-center shadow-sm"
            onPress={() => navigation.navigate('More', { screen: 'Fitness' })}
          >
            <Text className="text-3xl mb-2">🏃‍♀️</Text>
            <Text className="text-white font-bold">Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
