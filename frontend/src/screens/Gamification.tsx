import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SHE = { rose: '#FF6B9D', roseLight: '#FFE4EF', blush: '#FFF0F5',
  gold: '#FBC74D', goldLight: '#FFFBEB', textDark: '#1F1329', textMid: '#6B7280', mint: '#34D399' };

const BADGES = [
  { emoji: '🔥', label: '7-Day Streak',   unlocked: true,  color: '#FEE2E2' },
  { emoji: '🥗', label: 'Clean Eater',     unlocked: true,  color: '#ECFDF5' },
  { emoji: '🧘‍♀️', label: 'Zen Master',   unlocked: false, color: '#F3E8FF' },
  { emoji: '🏆', label: '30-Day Champ',    unlocked: false, color: '#FEF3C7' },
  { emoji: '💊', label: 'Med Tracker',     unlocked: true,  color: '#EDE9FE' },
  { emoji: '🌸', label: 'PCOS Warrior',    unlocked: false, color: '#FDF2F8' },
];

export default function Gamification() {
  const progressPct = 40;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: SHE.textDark }}>🏆 Challenges</Text>
          <Text style={{ fontSize: 14, color: SHE.textMid, marginTop: 4 }}>You're a PCOS warrior! 💪🩷</Text>
        </View>

        {/* Active Challenge */}
        <View style={{ marginHorizontal: 20, marginVertical: 12, backgroundColor: SHE.gold,
          borderRadius: 24, padding: 22, shadowColor: SHE.gold, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 }}>
          <View style={{ position: 'absolute', top: -15, right: -15, width: 80, height: 80,
            borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: 1, marginBottom: 6 }}>🌟 Active Challenge</Text>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 22, marginBottom: 4 }}>30-Day Hormone Reset</Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 16 }}>
            Log symptoms daily and hit your wellness goals!
          </Text>
          {/* Progress bar */}
          <View style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 99, height: 10, marginBottom: 8 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 99, height: 10, width: `${progressPct}%` }} />
          </View>
          <Text style={{ color: 'white', fontWeight: '800', fontSize: 13, textAlign: 'right' }}>
            Day 12 / 30 ({progressPct}%)
          </Text>
        </View>

        {/* Badges */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: SHE.textDark, marginBottom: 12 }}>
            💕 Your Badges
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {BADGES.map((b, i) => (
              <View key={i} style={{
                width: '46%', backgroundColor: b.unlocked ? b.color : '#F9FAFB',
                borderRadius: 20, padding: 18, alignItems: 'center',
                opacity: b.unlocked ? 1 : 0.5,
                shadowColor: '#FF6B9D', shadowOpacity: b.unlocked ? 0.1 : 0, shadowRadius: 8, elevation: b.unlocked ? 2 : 0,
                borderWidth: 1, borderColor: b.unlocked ? 'transparent' : '#E5E7EB'
              }}>
                <Text style={{ fontSize: 38, marginBottom: 8 }}>{b.emoji}</Text>
                <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 13, textAlign: 'center' }}>
                  {b.label}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '700', marginTop: 4,
                  color: b.unlocked ? SHE.mint : SHE.textMid }}>
                  {b.unlocked ? '✅ Unlocked' : '🔒 Locked'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
