import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Education() {
  const articles = [
    { id: 1, title: 'Understanding Insulin Resistance', category: 'Health', readTime: '5 min' },
    { id: 2, title: 'Seed Cycling for Hormonal Balance', category: 'Nutrition', readTime: '4 min' },
    { id: 3, title: 'Managing Cortisol Levels naturally', category: 'Mindset', readTime: '6 min' },
    { id: 4, title: 'The Role of Myo-Inositol', category: 'Supplements', readTime: '5 min' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold text-green-600 mb-6">Education Hub</Text>

        <View className="bg-green-50 p-6 rounded-2xl mb-6 shadow-sm border border-green-100">
          <Text className="font-bold text-lg mb-2 text-green-900">Featured Article</Text>
          <Text className="text-xl font-bold mb-2">PCOS and the Indian Diet</Text>
          <Text className="text-gray-600 mb-4">Learn how traditional Indian spices like turmeric and cinnamon can aid in PCOS management.</Text>
          <TouchableOpacity className="bg-green-600 py-2 px-4 rounded-lg self-start">
            <Text className="text-white font-bold">Read Now</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-bold mb-4">Recent Articles</Text>
        
        {articles.map(article => (
          <TouchableOpacity key={article.id} className="bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm">
            <Text className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">{article.category}</Text>
            <Text className="font-bold text-lg mb-2 text-gray-800">{article.title}</Text>
            <Text className="text-gray-500 text-sm">Read Time: {article.readTime}</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}
