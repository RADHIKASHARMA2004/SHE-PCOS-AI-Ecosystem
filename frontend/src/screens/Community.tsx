import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Community() {
  const [post, setPost] = useState('');
  const [forum, setForum] = useState([
    { id: '1', user: 'Anonymous_Panda', time: '2 hours ago', content: 'Has anyone tried spearmint tea for hirsutism?', likes: 12, comments: 4 },
    { id: '2', user: 'Cysters_Unite', time: '5 hours ago', content: 'Just completed 30 days of consistent weight training. My energy levels are way better!', likes: 35, comments: 8 }
  ]);

  const handlePost = () => {
    if(!post) return;
    setForum([{ id: Date.now().toString(), user: 'Me (Anonymous)', time: 'Just now', content: post, likes: 0, comments: 0 }, ...forum]);
    setPost('');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200 shadow-sm z-10">
        <Text className="text-2xl font-bold text-pink-500">Cysterhood Forum</Text>
      </View>

      <ScrollView className="p-4" keyboardShouldPersistTaps="handled">
        <View className="bg-white p-4 rounded-xl mb-6 shadow-sm border border-gray-200">
          <Text className="font-bold text-gray-800 mb-2">Share Anonymously</Text>
          <TextInput 
            className="border border-gray-200 rounded-lg p-3 min-h-[80px] text-black mb-3 text-top"
            placeholder="What's on your mind?"
            multiline
            value={post}
            onChangeText={setPost}
            style={{ textAlignVertical: 'top' }}
          />
          <TouchableOpacity 
            className="bg-pink-500 py-2 rounded-lg items-center"
            onPress={handlePost}
          >
            <Text className="text-white font-bold">Post</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-bold mb-4 text-gray-800">Recent Posts</Text>
        
        {forum.map(item => (
          <View key={item.id} className="bg-white p-4 rounded-xl mb-4 border border-gray-100 shadow-sm">
            <View className="flex-row justify-between mb-2">
              <Text className="font-bold text-gray-800">{item.user}</Text>
              <Text className="text-gray-500 text-xs">{item.time}</Text>
            </View>
            <Text className="text-gray-700 mb-4">{item.content}</Text>
            <View className="flex-row border-t border-gray-100 pt-3">
              <TouchableOpacity className="flex-row items-center mr-6">
                <Text className="text-gray-500 mr-1">👍</Text>
                <Text className="text-gray-600 font-semibold">{item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-gray-500 mr-1">💬</Text>
                <Text className="text-gray-600 font-semibold">{item.comments} Comments</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
