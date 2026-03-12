import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Mindset() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const moods = ['😊', '😌', '😐', '😔', '😫', '😡'];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold text-purple-500 mb-6">Mindset & Mood</Text>

        <View className="bg-purple-50 p-6 rounded-2xl mb-6 shadow-sm border border-purple-100">
          <Text className="font-bold text-lg mb-4 text-purple-900 text-center">How are you feeling today?</Text>
          <View className="flex-row justify-between mb-4">
            {moods.map((mood, idx) => (
              <TouchableOpacity 
                key={idx}
                className={`p-2 rounded-full ${selectedMood === mood ? 'bg-purple-200' : ''}`}
                onPress={() => setSelectedMood(mood)}
              >
                <Text className="text-3xl">{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedMood && (
             <TouchableOpacity className="bg-purple-500 py-3 rounded-lg items-center">
               <Text className="text-white font-bold">Log Mood</Text>
             </TouchableOpacity>
          )}
        </View>

        <Text className="text-xl font-bold mb-4">Guided Meditations</Text>

        <TouchableOpacity className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200 shadow-sm flex-row items-center">
          <View className="w-16 h-16 bg-purple-200 rounded-lg justify-center items-center mr-4">
            <Text className="text-2xl">🧘‍♀️</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-lg mb-1">Anulom Vilom</Text>
            <Text className="text-gray-600">10 mins • Alternate Nostril Breathing</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200 shadow-sm flex-row items-center">
          <View className="w-16 h-16 bg-purple-200 rounded-lg justify-center items-center mr-4">
            <Text className="text-2xl">🌙</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-lg mb-1">Sleep Deeply</Text>
            <Text className="text-gray-600">20 mins • Yoga Nidra</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
