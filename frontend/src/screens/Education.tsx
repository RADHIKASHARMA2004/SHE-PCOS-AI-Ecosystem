import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SHE = { rose: '#FF6B9D', roseLight: '#FFE4EF', blush: '#FFF0F5',
  lavender: '#C084FC', lavenderLight: '#F3E8FF', textDark: '#1F1329', textMid: '#6B7280' };

const ARTICLES = [
  { emoji: '🩺', title: 'PCOS & Insulin Resistance',       sub: '5 min read · Medical',       color: '#FEE2E2' },
  { emoji: '🌿', title: 'Top 10 Foods for Hormone Balance', sub: '4 min read · Nutrition',      color: '#ECFDF5' },
  { emoji: '🧬', title: 'Understanding Your Hormones',      sub: '7 min read · Science',        color: '#EDE9FE' },
  { emoji: '💤', title: 'How Sleep Affects Your Cycle',     sub: '3 min read · Lifestyle',      color: '#E0F2FE' },
  { emoji: '🧘‍♀️', title: 'Yoga Poses for Period Pain',   sub: '6 min read · Wellness',       color: '#FDF2F8' },
];

export default function Education() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: SHE.textDark }}>📚 Education</Text>
          <Text style={{ fontSize: 14, color: SHE.textMid, marginTop: 4 }}>Science-backed knowledge for your health 🧬</Text>
        </View>

        {/* Featured Banner */}
        <View style={{ marginHorizontal: 20, marginVertical: 12, backgroundColor: SHE.lavender,
          borderRadius: 24, padding: 22, shadowColor: SHE.lavender, shadowOpacity: 0.3, shadowRadius: 16, elevation: 5 }}>
          <View style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100,
            borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>✨ Featured</Text>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 20, marginBottom: 6, lineHeight: 26 }}>
            Complete Guide to Understanding PCOS
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>10 min read · pinned by SHE team 🌸</Text>
          <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 12, padding: 10,
            marginTop: 14, alignSelf: 'flex-start' }}>
            <Text style={{ color: SHE.lavender, fontWeight: '800', fontSize: 13 }}>Read Now →</Text>
          </TouchableOpacity>
        </View>

        {/* Articles */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: SHE.textDark, marginBottom: 12 }}>
            🌸 Latest Articles
          </Text>
          {ARTICLES.map((a, i) => (
            <TouchableOpacity key={i}
              style={{ backgroundColor: a.color, borderRadius: 20, padding: 16, marginBottom: 12,
                flexDirection: 'row', alignItems: 'center',
                shadowColor: '#FF6B9D', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <View style={{ width: 54, height: 54, backgroundColor: 'white', borderRadius: 16,
                justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 26 }}>{a.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 14 }}>{a.title}</Text>
                <Text style={{ color: SHE.textMid, fontSize: 12, marginTop: 3 }}>{a.sub}</Text>
              </View>
              <Text style={{ fontSize: 18 }}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
