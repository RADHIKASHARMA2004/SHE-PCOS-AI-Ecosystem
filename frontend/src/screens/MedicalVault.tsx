import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MedicalVault() {
  const reports = [
    { id: 1, date: 'Oct 15, 2026', type: 'Blood Test', title: 'Fasting Glucose & Insulin' },
    { id: 2, date: 'Sep 10, 2026', type: 'Ultrasound', title: 'Pelvic Ultrasound Report' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold text-blue-500 mb-6">Medical Vault</Text>

        <TouchableOpacity className="bg-blue-500 p-4 rounded-xl items-center mb-6 shadow-md">
          <Text className="text-white font-bold text-lg">📄 Upload New Lab Report</Text>
        </TouchableOpacity>

        <View className="bg-blue-50 p-6 rounded-2xl mb-6 shadow-sm border border-blue-100">
          <Text className="font-bold text-lg mb-4 text-blue-900">Glucose Tracking</Text>
          <View className="h-32 bg-white rounded-lg flex-row items-end justify-between p-4 border border-blue-200">
            {/* Mock Graph */}
            {[40, 60, 50, 80, 55, 60].map((height, i) => (
              <View key={i} style={{ height: `${height}%` }} className="w-6 bg-blue-400 rounded-t-sm" />
            ))}
          </View>
          <Text className="text-center mt-2 text-sm text-gray-500">Last 6 Months (Fasting mg/dL)</Text>
        </View>

        <Text className="font-bold text-xl mb-4">Past Reports</Text>
        {reports.map(report => (
          <View key={report.id} className="bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm flex-row items-center">
            <View className="bg-blue-100 p-3 rounded-full mr-4">
              <Text className="text-xl">📋</Text>
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-800">{report.title}</Text>
              <Text className="text-gray-500">{report.date} • {report.type}</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-blue-500 font-bold">View</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}
