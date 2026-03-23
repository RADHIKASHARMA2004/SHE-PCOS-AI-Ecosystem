import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SHE = { rose: '#FF6B9D', roseLight: '#FFE4EF', blush: '#FFF0F5',
  mint: '#34D399', mintLight: '#ECFDF5', textDark: '#1F1329', textMid: '#6B7280' };

const WORKOUTS = [
  { emoji: '🧘‍♀️', title: 'Yoga for PCOS',      sub: '15 mins · Beginner · Low Intensity',    color: '#F3E8FF', bg: '#EDE9FE' },
  { emoji: '🏋️‍♀️', title: 'Strength Training',  sub: '30 mins · Intermediate · Medium',        color: '#FFF0F5', bg: '#FFE4EF' },
  { emoji: '🏃‍♀️', title: 'Cardio Blast',        sub: '20 mins · Advanced · High Intensity',    color: '#FEF3C7', bg: '#FFFBEB' },
  { emoji: '🚶‍♀️', title: 'Gentle Walk',         sub: '30 mins · Beginner · Very Low',          color: '#ECFDF5', bg: '#D1FAE5' },
];

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function Fitness() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: SHE.textDark }}>🏃‍♀️ Fitness</Text>
          <Text style={{ fontSize: 14, color: SHE.textMid, marginTop: 4 }}>Move with your cycle 💪💕</Text>
        </View>

        {/* Steps Card */}
        <View style={{ marginHorizontal: 20, marginVertical: 12, backgroundColor: SHE.mint,
          borderRadius: 24, padding: 22, shadowColor: SHE.mint, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 }}>
          <View style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100,
            borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600', marginBottom: 4 }}>
            👣 Today's Steps
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={{ color: 'white', fontSize: 52, fontWeight: '900', lineHeight: 58 }}>6,432</Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginBottom: 6, marginLeft: 4 }}>/10,000</Text>
          </View>
          {/* Mini bar */}
          <View style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 99, height: 8, marginTop: 12 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 99, height: 8, width: '64%' }} />
          </View>
        </View>

        {/* Weekly Streak */}
        <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: 'white',
          borderRadius: 24, padding: 20, shadowColor: '#FF6B9D', shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }}>
          <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 16, marginBottom: 14 }}>
            🔥 Weekly Streak
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {DAYS.map((day, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18,
                  backgroundColor: i < 4 ? SHE.rose : '#F3F4F6',
                  alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: i < 4 ? 'white' : SHE.textMid, fontWeight: '800', fontSize: 13 }}>{day}</Text>
                </View>
                <Text style={{ fontSize: 10, marginTop: 4, color: i < 4 ? SHE.rose : '#D1D5DB' }}>
                  {i < 4 ? '✓' : '·'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Workouts */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: SHE.textDark, marginBottom: 12 }}>
            💕 PCOS Workouts
          </Text>
          {WORKOUTS.map((w, i) => (
            <TouchableOpacity key={i}
              style={{ backgroundColor: w.color, borderRadius: 20, padding: 16, marginBottom: 12,
                flexDirection: 'row', alignItems: 'center',
                shadowColor: '#FF6B9D', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
              <View style={{ width: 58, height: 58, backgroundColor: w.bg, borderRadius: 18,
                justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 28 }}>{w.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 15 }}>{w.title}</Text>
                <Text style={{ color: SHE.textMid, fontSize: 12, marginTop: 3 }}>{w.sub}</Text>
              </View>
              <Text style={{ fontSize: 22 }}>▶️</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
