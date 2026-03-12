import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Gamification() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold text-amber-500 mb-6">Badges & Challenges</Text>

        <View className="bg-amber-50 p-6 rounded-2xl mb-6 shadow-sm border border-amber-200">
          <Text className="text-xl font-bold mb-2 text-amber-900">Current Challenge</Text>
          <Text className="text-lg font-bold">30-Day Hormone Reset</Text>
          <View className="w-full bg-amber-200 h-4 rounded-full mt-4 mb-2 overflow-hidden">
            <View className="bg-amber-500 h-full w-[40%]" />
          </View>
          <Text className="text-right text-gray-600 font-bold">Day 12 / 30</Text>
        </View>

        <Text className="text-xl font-bold mb-4 text-gray-800">Your Badges</Text>
        
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] bg-white p-4 rounded-xl mb-4 items-center shadow-sm border border-gray-100">
            <Text className="text-4xl mb-2">🔥</Text>
            <Text className="font-bold text-center text-gray-800">7-Day Streak</Text>
            <Text className="text-xs text-green-500 mt-1">Unlocked</Text>
          </View>
          
          <View className="w-[48%] bg-white p-4 rounded-xl mb-4 items-center shadow-sm border border-gray-100">
            <Text className="text-4xl mb-2">🥗</Text>
            <Text className="font-bold text-center text-gray-800">Clean Eater</Text>
            <Text className="text-xs text-green-500 mt-1">Unlocked</Text>
          </View>

          <View className="w-[48%] bg-gray-50 p-4 rounded-xl mb-4 items-center border border-gray-200 opacity-60">
            <Text className="text-4xl mb-2">🧘‍♀️</Text>
            <Text className="font-bold text-center text-gray-800">Zen Master</Text>
            <Text className="text-xs text-gray-500 mt-1">Locked</Text>
          </View>
          
          <View className="w-[48%] bg-gray-50 p-4 rounded-xl mb-4 items-center border border-gray-200 opacity-60">
            <Text className="text-4xl mb-2">🏆</Text>
            <Text className="font-bold text-center text-gray-800">30-Day Champ</Text>
            <Text className="text-xs text-gray-500 mt-1">Locked</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
