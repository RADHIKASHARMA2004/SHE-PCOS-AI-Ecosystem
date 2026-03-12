import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Fitness() {
  const workouts = [
    { id: 1, title: 'Yoga for PCOS', duration: '15 mins', level: 'Beginner', intensity: 'Low' },
    { id: 2, title: 'Strength Training', duration: '30 mins', level: 'Intermediate', intensity: 'Medium' },
    { id: 3, title: 'Cardio Blast', duration: '20 mins', level: 'Advanced', intensity: 'High' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold text-[#4ECDC4] mb-6">Fitness & Movement</Text>

        <View className="bg-[#4ECDC4] bg-opacity-10 p-6 rounded-2xl mb-6 flex-row justify-between items-center shadow-sm">
          <View>
            <Text className="text-gray-600 font-semibold mb-1">Daily Steps</Text>
            <Text className="text-3xl font-bold text-[#4ECDC4]">6,432<Text className="text-sm font-normal text-gray-500"> / 10,000</Text></Text>
          </View>
          <View className="bg-white p-3 rounded-full">
            <Text className="text-2xl">🔥</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-bold mb-4 text-gray-800">10k Step Streak</Text>
          <View className="flex-row justify-between">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <View key={i} className={`w-10 h-10 rounded-full items-center justify-center ${i < 4 ? 'bg-[#FF6B6B]' : 'bg-gray-200'}`}>
                <Text className={i < 4 ? 'text-white font-bold' : 'text-gray-500'}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text className="text-xl font-bold mb-4 text-gray-800">PCOS-Specific Workouts</Text>
        {workouts.map(video => (
          <TouchableOpacity key={video.id} className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200 shadow-sm flex-row items-center">
            <View className="w-16 h-16 bg-gray-300 rounded-lg justify-center items-center mr-4">
              <Text className="text-2xl">▶️</Text>
            </View>
            <View className="flex-1">
              <Text className="font-bold text-lg mb-1">{video.title}</Text>
              <Text className="text-gray-600">{video.duration} • {video.level}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
