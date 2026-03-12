import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Consult() {
  const doctors = [
    { id: 1, name: 'Dr. Anjali Sharma', spec: 'Gynecologist', rating: '4.9', exp: '12 yrs' },
    { id: 2, name: 'Dr. Ritu Desai', spec: 'Endocrinologist', rating: '4.8', exp: '15 yrs' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold text-teal-600 mb-6">Consult Expert</Text>

        <View className="bg-teal-50 p-6 rounded-2xl mb-6 shadow-sm border border-teal-100">
          <Text className="font-bold text-lg mb-2 text-teal-900">Virtual Consultation</Text>
          <Text className="text-gray-600 mb-4">Book a 1-on-1 video call with our verified PCOS specialists.</Text>
          <TouchableOpacity className="bg-teal-600 py-3 rounded-lg items-center">
             <Text className="text-white font-bold text-lg">Book Now</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-bold mb-4 text-gray-800">Available Specialists</Text>
        
        {doctors.map(doc => (
          <View key={doc.id} className="bg-white p-4 rounded-xl mb-4 border border-gray-200 shadow-sm flex-row items-center">
            <View className="w-16 h-16 bg-gray-200 rounded-full justify-center items-center mr-4">
              <Text className="text-2xl">👩‍⚕️</Text>
            </View>
            <View className="flex-1">
              <Text className="font-bold text-lg text-gray-800">{doc.name}</Text>
              <Text className="text-gray-500 mb-1">{doc.spec} • {doc.exp} Exp</Text>
              <View className="flex-row items-center">
                <Text className="text-yellow-500 mr-1">⭐</Text>
                <Text className="font-semibold text-gray-700">{doc.rating}</Text>
              </View>
            </View>
            <TouchableOpacity className="border border-teal-600 px-4 py-2 rounded-lg">
              <Text className="text-teal-600 font-bold">View</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}
