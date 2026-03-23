import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SHE = { rose: '#FF6B9D', roseDark: '#E5528A', roseLight: '#FFE4EF', blush: '#FFF0F5',
  mint: '#34D399', textDark: '#1F1329', textMid: '#6B7280' };

const DOCTORS = [
  { emoji: '👩‍⚕️', name: 'Dr. Priya Sharma',   specialty: 'Gynecologist & PCOS Specialist',    avail: 'Available today',  rating: '4.9 ⭐', color: '#FDF2F8' },
  { emoji: '🩺',  name: 'Dr. Meera Nair',     specialty: 'Endocrinologist',                     avail: 'Tomorrow 10am',    rating: '4.8 ⭐', color: '#EDE9FE' },
  { emoji: '🧬',  name: 'Dr. Ananya Singh',   specialty: 'Reproductive Medicine',               avail: 'Available today',  rating: '5.0 ⭐', color: '#ECFDF5' },
];

export default function Consult() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: SHE.textDark }}>👩‍⚕️ Consult</Text>
          <Text style={{ fontSize: 14, color: SHE.textMid, marginTop: 4 }}>Talk to a specialist who gets it 💕</Text>
        </View>

        {/* Hero Banner */}
        <View style={{ marginHorizontal: 20, marginVertical: 12, backgroundColor: SHE.rose,
          borderRadius: 24, padding: 22, shadowColor: SHE.rose, shadowOpacity: 0.3, shadowRadius: 16, elevation: 5 }}>
          <View style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100,
            borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>💜 Free Consultation</Text>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 20, lineHeight: 26 }}>
            Your first session with a PCOS specialist is FREE 🩺
          </Text>
          <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 12, paddingVertical: 10,
            paddingHorizontal: 18, marginTop: 14, alignSelf: 'flex-start' }}>
            <Text style={{ color: SHE.roseDark, fontWeight: '800', fontSize: 13 }}>Book Now →</Text>
          </TouchableOpacity>
        </View>

        {/* Doctors */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: SHE.textDark, marginBottom: 12 }}>
            🌸 Available Specialists
          </Text>
          {DOCTORS.map((d, i) => (
            <View key={i} style={{ backgroundColor: d.color, borderRadius: 20, padding: 18, marginBottom: 12,
              shadowColor: '#FF6B9D', shadowOpacity: 0.07, shadowRadius: 10, elevation: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 54, height: 54, backgroundColor: 'white', borderRadius: 18,
                  justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                  <Text style={{ fontSize: 28 }}>{d.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 15 }}>{d.name}</Text>
                  <Text style={{ color: SHE.textMid, fontSize: 12, marginTop: 2 }}>{d.specialty}</Text>
                  <Text style={{ color: SHE.mint, fontSize: 12, fontWeight: '700', marginTop: 2 }}>{d.rating}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: SHE.textMid, fontSize: 12 }}>🕒 {d.avail}</Text>
                <TouchableOpacity style={{ backgroundColor: SHE.rose, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 99 }}>
                  <Text style={{ color: 'white', fontWeight: '800', fontSize: 13 }}>Book 💕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
