import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Admin() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold text-white mb-6">Developer Analytics</Text>

        <View className="flex-row flex-wrap justify-between mb-6">
          <View className="w-[48%] bg-gray-800 p-4 rounded-xl mb-4 border border-gray-700">
            <Text className="text-gray-400 mb-1 font-semibold">Total Users</Text>
            <Text className="text-3xl font-bold text-white">1,245</Text>
            <Text className="text-green-400 text-xs mt-1">↑ 12% this week</Text>
          </View>
          
          <View className="w-[48%] bg-gray-800 p-4 rounded-xl mb-4 border border-gray-700">
            <Text className="text-gray-400 mb-1 font-semibold">Active Models</Text>
            <Text className="text-2xl font-bold text-white mt-1">RandomForest</Text>
            <Text className="text-green-400 text-xs mt-1">Accuracy: 92%</Text>
          </View>

          <View className="w-[48%] bg-gray-800 p-4 rounded-xl mb-4 border border-gray-700">
             <Text className="text-gray-400 mb-1 font-semibold">API Health</Text>
             <Text className="text-2xl font-bold text-green-400 mt-1">100% UP</Text>
          </View>

          <View className="w-[48%] bg-gray-800 p-4 rounded-xl mb-4 border border-gray-700">
             <Text className="text-gray-400 mb-1 font-semibold">DB Size</Text>
             <Text className="text-2xl font-bold text-white mt-1">2.4 GB</Text>
          </View>
        </View>

        <Text className="text-xl font-bold mb-4 text-white">System Actions</Text>
        
        <TouchableOpacity className="bg-blue-600 p-4 rounded-xl mb-4 items-center">
          <Text className="text-white font-bold text-lg">Retrain ML Models</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-red-600 p-4 rounded-xl mb-4 items-center">
          <Text className="text-white font-bold text-lg">Clear Cache</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
