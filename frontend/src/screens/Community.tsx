import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SHE = { rose: '#FF6B9D', roseDark: '#E5528A', roseLight: '#FFE4EF', blush: '#FFF0F5',
  lavender: '#C084FC', lavenderLight: '#F3E8FF', textDark: '#1F1329', textMid: '#6B7280' };

const INITIAL_POSTS = [
  { id: '1', user: '🐼 Anonymous_Panda',   time: '2 hours ago', content: 'Has anyone tried spearmint tea for hirsutism? It really helped me reduce facial hair over 3 months!', likes: 12, comments: 4, liked: false },
  { id: '2', user: '🌸 Cysters_Unite',      time: '5 hours ago', content: 'Just completed 30 days of consistent weight training. My energy levels are way better and my cycle is getting regular! 💪', likes: 35, comments: 8, liked: false },
  { id: '3', user: '🩷 PCOSWarrior',        time: '1 day ago',   content: 'Inositol + metformin combo changed my life. Always consult your doctor first though 💊', likes: 52, comments: 17, liked: false },
];

export default function Community() {
  const [post, setPost] = useState('');
  const [forum, setForum] = useState(INITIAL_POSTS);

  const handlePost = () => {
    if (!post.trim()) return;
    setForum([{
      id: Date.now().toString(), user: '🌺 You (Anonymous)', time: 'Just now',
      content: post, likes: 0, comments: 0, liked: false
    }, ...forum]);
    setPost('');
  };

  const toggleLike = (id: string) => {
    setForum(forum.map(f => f.id === id ? { ...f, likes: f.liked ? f.likes - 1 : f.likes + 1, liked: !f.liked } : f));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
        backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: SHE.roseLight }}>
        <Text style={{ fontSize: 26, fontWeight: '900', color: SHE.roseDark }}>💬 Cysterhood Forum</Text>
        <Text style={{ fontSize: 13, color: SHE.textMid, marginTop: 2 }}>A safe space for cysters 🌸</Text>
      </View>

      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">

        {/* Compose Box */}
        <View style={{ margin: 16, backgroundColor: 'white', borderRadius: 24, padding: 16,
          shadowColor: '#FF6B9D', shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 }}>
          <Text style={{ fontWeight: '800', color: SHE.textDark, marginBottom: 10, fontSize: 15 }}>
            🌺 Share Anonymously
          </Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: SHE.roseLight, borderRadius: 14, padding: 14,
              minHeight: 90, textAlignVertical: 'top', color: SHE.textDark, fontSize: 14,
              backgroundColor: SHE.blush, marginBottom: 12 }}
            placeholder="What's on your mind? 💕"
            placeholderTextColor="#FBAED2"
            multiline
            value={post}
            onChangeText={setPost}
          />
          <TouchableOpacity onPress={handlePost}
            style={{ backgroundColor: SHE.rose, paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: '800', fontSize: 15 }}>💌 Post</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '800', color: SHE.textDark, marginHorizontal: 20, marginBottom: 10 }}>
          🌸 Recent Posts
        </Text>

        {forum.map(item => (
          <View key={item.id} style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: 'white',
            borderRadius: 20, padding: 16, shadowColor: '#FF6B9D', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
              <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 14 }}>{item.user}</Text>
              <Text style={{ color: SHE.textMid, fontSize: 11 }}>{item.time}</Text>
            </View>
            <Text style={{ color: '#374151', fontSize: 14, lineHeight: 20, marginBottom: 12 }}>{item.content}</Text>
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: SHE.roseLight, paddingTop: 10, gap: 20 }}>
              <TouchableOpacity onPress={() => toggleLike(item.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 16 }}>{item.liked ? '🩷' : '🤍'}</Text>
                <Text style={{ color: item.liked ? SHE.rose : SHE.textMid, fontWeight: '700', fontSize: 13 }}>{item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 16 }}>💬</Text>
                <Text style={{ color: SHE.textMid, fontWeight: '700', fontSize: 13 }}>{item.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
