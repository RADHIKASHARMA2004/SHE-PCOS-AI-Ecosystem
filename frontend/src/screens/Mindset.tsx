import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SHE = { rose: '#FF6B9D', roseLight: '#FFE4EF', blush: '#FFF0F5', lavender: '#C084FC',
  lavenderLight: '#F3E8FF', textDark: '#1F1329', textMid: '#6B7280' };

export default function Mindset() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const moods = [
    { emoji: '😊', label: 'Happy',   color: '#FEF3C7' },
    { emoji: '😌', label: 'Calm',    color: '#ECFDF5' },
    { emoji: '😐', label: 'Neutral', color: '#F3F4F6' },
    { emoji: '😔', label: 'Sad',     color: '#EDE9FE' },
    { emoji: '😫', label: 'Tired',   color: '#FDF2F8' },
    { emoji: '😡', label: 'Angry',   color: '#FEE2E2' },
  ];

  const meditations = [
    { emoji: '🧘‍♀️', title: 'Anulom Vilom',       sub: '10 mins · Alternate Nostril', color: '#F3E8FF' },
    { emoji: '🌙',   title: 'Sleep Deeply',       sub: '20 mins · Yoga Nidra',        color: '#E0F2FE' },
    { emoji: '🌸',   title: 'Hormonal Harmony',   sub: '15 mins · Body Scan',         color: '#FDF2F8' },
    { emoji: '💆‍♀️', title: 'Stress Relief',       sub: '8 mins · Box Breathing',      color: '#ECFDF5' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: SHE.textDark }}>🧘‍♀️ Mindset</Text>
          <Text style={{ fontSize: 14, color: SHE.textMid, marginTop: 4 }}>Nurture your mind & spirit 💕</Text>
        </View>

        {/* Mood Selector */}
        <View style={{ marginHorizontal: 20, backgroundColor: 'white', borderRadius: 24, padding: 20, marginBottom: 16,
          shadowColor: '#FF6B9D', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
          <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 16, marginBottom: 14 }}>
            💜 How are you feeling?
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            {moods.map((m) => (
              <TouchableOpacity key={m.emoji} onPress={() => setSelectedMood(m.emoji)}
                style={{ alignItems: 'center', backgroundColor: selectedMood === m.emoji ? m.color : '#F9FAFB',
                  borderRadius: 16, padding: 10, borderWidth: 2,
                  borderColor: selectedMood === m.emoji ? SHE.lavender : 'transparent' }}>
                <Text style={{ fontSize: 28 }}>{m.emoji}</Text>
                <Text style={{ fontSize: 9, color: SHE.textMid, fontWeight: '600', marginTop: 2 }}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedMood && (
            <TouchableOpacity style={{ backgroundColor: SHE.lavender, paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: '800', fontSize: 15 }}>💾 Log Mood</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Meditations */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: SHE.textDark, marginBottom: 12 }}>
            🌸 Guided Sessions
          </Text>
          {meditations.map((m, i) => (
            <TouchableOpacity key={i}
              style={{ backgroundColor: m.color, borderRadius: 20, padding: 16, marginBottom: 12,
                flexDirection: 'row', alignItems: 'center',
                shadowColor: '#C084FC', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
              <View style={{ width: 58, height: 58, backgroundColor: 'white', borderRadius: 18,
                justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 28 }}>{m.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 15 }}>{m.title}</Text>
                <Text style={{ color: SHE.textMid, fontSize: 13, marginTop: 3 }}>{m.sub}</Text>
              </View>
              <Text style={{ fontSize: 22 }}>▶️</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
