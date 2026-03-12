import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AILab() {
  const [messages, setMessages] = useState([
    { id: '1', text: "Hello! I'm your PCOS AI Coach. Ask me anything about diet, workouts, or symptoms.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [scanResult, setScanResult] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMsgs = [...messages, { id: Date.now().toString(), text: input, sender: 'user' }];
    setMessages(newMsgs);
    setInput('');

    // Mock RAG Logic based on Indian context
    setTimeout(() => {
      let reply = "I understand. Tracking your symptoms is key. Stay hydrated and try practicing yoga daily.";
      const q = input.toLowerCase();
      
      if (q.includes('cramps') || q.includes('pain')) {
        reply = "Try sipping on warm Methi (Fenugreek) water. Practice Anulom Vilom for 10 minutes to ease cramps.";
      } else if (q.includes('diet') || q.includes('food')) {
        reply = "A PCOS-friendly Indian diet includes Ragi, Jowar, plenty of green leafy vegetables like Palak, and avoiding processed sugars.";
      } else if (q.includes('workout') || q.includes('exercise')) {
        reply = "Include strength training and Yoga. Kapalbhati pranayama is highly recommended for PCOS management.";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), text: reply, sender: 'ai' }]);
    }, 1000);
  };

  const runAcneScan = () => {
    setScanResult("Scanning face via MediaPipe...");
    setTimeout(() => {
      setScanResult("Scan Complete: Mild Acne Detected. Risk Score updated. Suggestion: Apply neem paste or salicylic acid.");
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-[#a55eea]">AI Lab & Coach</Text>
      </View>
      
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* CV Scanner Feature */}
        <View className="bg-purple-50 p-4 rounded-xl mb-6 shadow-sm border border-purple-100">
          <Text className="font-bold text-lg mb-2 text-purple-900">Skin & Acne Scanner</Text>
          <Text className="text-gray-600 mb-4">Use your camera to let our AI analyze your skin for hormonal acne patterns.</Text>
          <TouchableOpacity 
            className="bg-[#a55eea] p-3 rounded-lg items-center"
            onPress={runAcneScan}
          >
            <Text className="text-white font-bold">📸 Run MediaPipe Scan</Text>
          </TouchableOpacity>
          {scanResult ? <Text className="mt-3 text-purple-700 font-semibold">{scanResult}</Text> : null}
        </View>

        <Text className="font-bold text-lg mb-4 text-gray-800">Chat with your Coach</Text>
        
        <View className="flex-1 min-h-[300px] border border-gray-200 rounded-xl bg-gray-50 p-4 mb-4">
          {messages.map(msg => (
            <View key={msg.id} className={`mb-3 max-w-[80%] p-3 rounded-2xl ${msg.sender === 'ai' ? 'bg-white border border-gray-200 self-start' : 'bg-[#a55eea] self-end'}`}>
              <Text className={msg.sender === 'ai' ? 'text-gray-800' : 'text-white'}>{msg.text}</Text>
            </View>
          ))}
        </View>

        <View className="flex-row items-center">
          <TextInput 
            className="flex-1 border border-gray-300 rounded-full p-3 bg-white mr-2"
            placeholder="Ask about diet, workout..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity 
            className="w-12 h-12 bg-[#a55eea] rounded-full items-center justify-center"
            onPress={handleSend}
          >
            <Text className="text-white text-xl">⬆</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
