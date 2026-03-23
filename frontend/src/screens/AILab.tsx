import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, Dimensions, Animated, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../api/client';

// ── SHE Design Tokens ──────────────────────────────────────────────────────────
const SHE = {
  rose:     '#FF6B9D', roseDark: '#E5528A', roseLight: '#FFE4EF',
  blush:    '#FFF0F5', lavender: '#C084FC', lavLight:  '#F3E8FF',
  mint:     '#34D399', gold:     '#FBC74D', white:     '#FFFFFF',
  textDark: '#1F1329', textMid:  '#6B7280',
};

const { width } = Dimensions.get('window');

export default function AILab() {
  const [messages, setMessages] = useState([
    { id: '1', text: "Hello! I'm your SHE Clinical Coach. How can I support your PCOS journey today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // Ultrasound State
  const [uText, setUText]           = useState('');
  const [uLoading, setULoading]     = useState(false);
  const [uResult, setUResult]       = useState<any>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  // ── Chat Logic ──────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setChatLoading(true);

    try {
      const res = await apiClient.post('/ai/chat', { text: input });
      setMessages(prev => [...prev, { id: Date.now().toString() + 'ai', text: res.data.reply, sender: 'ai' }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: 'err', text: "Coach is offline. Checking connection...", sender: 'ai' }]);
    } finally {
      setChatLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  // ── Ultrasound Logic ───────────────────────────────────────────────────────
  const runUltrasoundScan = async () => {
    if (!uText.trim()) return;
    setULoading(true);
    setUResult(null);
    try {
      const res = await apiClient.post('/ai/scan-ultrasound', { text: uText });
      setUResult(res.data);
    } catch (e) {
    } finally {
      setULoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView 
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header */}
          <View style={{ padding: 24 }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: SHE.textDark }}>✨ AI Lab</Text>
            <Text style={{ color: SHE.textMid, marginTop: 4 }}>High-precision clinical AI diagnostics</Text>
          </View>

          {/* 🥚 Ultrasound Scanner */}
          <View style={s.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View>
                <Text style={s.cardTitle}>🩺 Ultrasound Scanner</Text>
                <Text style={s.cardSub}>Follicle count & Volumetric analysis</Text>
              </View>
              <Text style={{ fontSize: 24 }}>🥚</Text>
            </View>

            <TextInput
              style={s.uInput}
              multiline
              placeholder="Paste ultrasound report text here... (e.g. 14 follicles in right ovary, volume 12ml)"
              value={uText}
              onChangeText={setUText}
            />

            <TouchableOpacity 
              onPress={runUltrasoundScan} 
              disabled={uLoading}
              style={[s.mainBtn, { backgroundColor: SHE.lavender, marginTop: 12 }]}
            >
              {uLoading ? <ActivityIndicator color="white" /> : <Text style={s.btnText}>Analyze Scan Data</Text>}
            </TouchableOpacity>

            {uResult && (
              <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: '#F3E8FF', paddingTop: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={s.uBox}>
                    <Text style={s.uBoxLabel}>Follicles</Text>
                    <Text style={s.uBoxVal}>{uResult.follicles || '?'}</Text>
                  </View>
                  <View style={s.uBox}>
                    <Text style={s.uBoxLabel}>Volume</Text>
                    <Text style={s.uBoxVal}>{uResult.volume ? uResult.volume + 'mL' : '?'}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: uResult.is_pco_marker_present ? SHE.roseLight : '#E0F2FE', padding: 14, borderRadius: 16 }}>
                  <Text style={{ fontWeight: '900', color: uResult.is_pco_marker_present ? SHE.roseDark : '#0369A1' }}>
                    {uResult.verdict}
                  </Text>
                  <Text style={{ fontSize: 12, color: SHE.textDark, marginTop: 4 }}>{uResult.recommendation}</Text>
                </View>
              </View>
            )}
          </View>

          {/* 💬 Clinical Coach Chat */}
          <Text style={{ marginHorizontal: 24, marginBottom: 16, fontSize: 18, fontWeight: '900', color: SHE.textDark }}>
            💬 Personalized Coach
          </Text>

          <View style={s.chatContainer}>
            {(messages || []).map((m) => (
              <View key={m.id} style={[s.msgBubble, m.sender === 'ai' ? s.aiBubble : s.userBubble]}>
                <Text style={[s.msgText, m.sender === 'user' && { color: 'white' }]}>{m?.text}</Text>
              </View>
            ))}
            {chatLoading && (
              <View style={[s.msgBubble, s.aiBubble, { width: 60 }]}>
                <ActivityIndicator size="small" color={SHE.rose} />
              </View>
            )}
          </View>

          {/* Chat Input */}
          <View style={s.inputWrapper}>
            <TextInput
              style={s.textInput}
              placeholder="Ask about your scan, diet, or symptoms..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity onPress={handleSend} style={s.sendBtn}>
              <Text style={{ color: 'white', fontWeight: '900', fontSize: 20 }}>⬆</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: 'white', marginHorizontal: 24, borderRadius: 24, padding: 20, marginBottom: 16,
    shadowColor: '#FF6B9D', shadowOpacity: 0.1, shadowRadius: 15, elevation: 4,
  },
  cardTitle: { fontWeight: '900', color: SHE.textDark, fontSize: 16 },
  cardSub: { color: SHE.textMid, fontSize: 12, marginTop: 2 },
  mainBtn: { backgroundColor: SHE.rose, borderRadius: 16, padding: 16, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '900', fontSize: 14 },
  uInput: { 
    backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14, minHeight: 80, fontSize: 13, textAlignVertical: 'top', color: SHE.textDark 
  },
  uBox: { flex: 0.48, backgroundColor: '#F3E8FF', borderRadius: 14, padding: 12, alignItems: 'center' },
  uBoxLabel: { fontSize: 10, fontWeight: '700', color: SHE.lavender, textTransform: 'uppercase' },
  uBoxVal: { fontSize: 20, fontWeight: '900', color: SHE.textDark, marginTop: 2 },
  chatContainer: { marginHorizontal: 24, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 24, padding: 16, minHeight: 200, marginBottom: 12 },
  msgBubble: { padding: 14, borderRadius: 20, marginBottom: 10, maxWidth: '85%' },
  aiBubble: { backgroundColor: 'white', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: SHE.rose, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  msgText: { fontSize: 14, lineHeight: 20, color: SHE.textDark },
  inputWrapper: { flexDirection: 'row', marginHorizontal: 24, alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: 'white', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 14, fontSize: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: SHE.rose, marginLeft: 10, alignItems: 'center', justifyContent: 'center' },
});
