import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SHE = { rose: '#FF6B9D', roseLight: '#FFE4EF', blush: '#FFF0F5',
  lavender: '#C084FC', lavenderLight: '#F3E8FF', textDark: '#1F1329', textMid: '#6B7280' };

const STATS = [
  { label: 'Total Users',    value: '247',  emoji: '👩',  color: SHE.roseLight,      text: '#BE185D' },
  { label: 'Active Today',   value: '38',   emoji: '🌸',  color: '#FFFBEB',          text: '#92400E' },
  { label: 'Cycles Logged',  value: '1,204',emoji: '🩸',  color: '#EDE9FE',          text: '#6B21A8' },
  { label: 'AI Predictions', value: '918',  emoji: '✨',  color: '#ECFDF5',          text: '#065F46' },
];

const ERRORS = [
  { level: 'Warning', msg: 'ML model not trained. RandomForest fallback is active.', color: '#FEF3C7', text: '#92400E' },
  { level: 'Info',    msg: '38 new users signed up this week 🌸',                    color: '#ECFDF5', text: '#065F46' },
  { level: 'Error',   msg: 'LSTM stub model not loaded — predictions use mean only.', color: SHE.roseLight, text: '#BE185D' },
];

export default function Admin() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: SHE.textDark }}>📊 Analytics</Text>
          <Text style={{ fontSize: 14, color: SHE.textMid, marginTop: 4 }}>Developer dashboard · SHE v1.0 🌸</Text>
        </View>

        {/* Stats grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12, marginVertical: 12 }}>
          {STATS.map((s, i) => (
            <View key={i} style={{ width: '46%', backgroundColor: s.color, borderRadius: 20, padding: 18,
              shadowColor: '#FF6B9D', shadowOpacity: 0.07, shadowRadius: 10, elevation: 2 }}>
              <Text style={{ fontSize: 30, marginBottom: 6 }}>{s.emoji}</Text>
              <Text style={{ fontSize: 28, fontWeight: '900', color: s.text }}>{s.value}</Text>
              <Text style={{ fontSize: 12, color: s.text, opacity: 0.75, fontWeight: '600', marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* System Logs */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: SHE.textDark, marginBottom: 12 }}>
            🔍 System Logs
          </Text>
          {ERRORS.map((e, i) => (
            <View key={i} style={{ backgroundColor: e.color, borderRadius: 16, padding: 14, marginBottom: 10,
              borderLeftWidth: 4, borderLeftColor: e.text }}>
              <Text style={{ fontWeight: '800', color: e.text, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{e.level}</Text>
              <Text style={{ color: e.text, fontSize: 13 }}>{e.msg}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
