import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Nutrition() {
  const [meal, setMeal] = useState('');
  
  const suggestions = [
    { title: "Breakfast", meals: "Poha with peanuts, Moong Dal Chilla, Ragi Dosa" },
    { title: "Lunch", meals: "Bajra Roti with Palak Paneer, Brown Rice and Rajma" },
    { title: "Dinner", meals: "Light Khichdi, Grilled Paneer Salad" },
    { title: "Snacks", meals: "Roasted Makhana, Methi Water" }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold text-[#FFE66D] mb-6 text-gray-800">Nutrition Tracker</Text>

        <View className="bg-yellow-50 p-6 rounded-2xl mb-6 shadow-sm border border-yellow-100">
          <Text className="text-lg font-bold mb-2">Today's Intake</Text>
          <View className="flex-row justify-between mb-4 mt-2">
            <View className="items-center">
              <Text className="text-gray-500">Calories</Text>
              <Text className="text-xl font-bold">1200 <Text className="text-sm font-normal">/ 1800</Text></Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500">Protein</Text>
              <Text className="text-xl font-bold">45g <Text className="text-sm font-normal">/ 80g</Text></Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500">Carbs</Text>
              <Text className="text-xl font-bold">130g <Text className="text-sm font-normal">/ 150g</Text></Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-bold mb-4">Log a Meal</Text>
          <View className="flex-row">
            <TextInput 
              className="flex-1 border border-gray-300 rounded-l-xl p-3 bg-white"
              placeholder="e.g. 2 Besan Chilla"
              value={meal}
              onChangeText={setMeal}
            />
            <TouchableOpacity 
              className="bg-[#FFE66D] px-6 justify-center rounded-r-xl border border-[#FFE66D]"
              onPress={() => { setMeal(''); }}
            >
              <Text className="font-bold text-gray-800">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-xl font-bold mb-4">PCOS-Friendly Indian Meals</Text>
        {suggestions.map((item, index) => (
          <View key={index} className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100">
            <Text className="font-bold text-[#FF6B6B] mb-1">{item.title}</Text>
            <Text className="text-gray-700">{item.meals}</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}
