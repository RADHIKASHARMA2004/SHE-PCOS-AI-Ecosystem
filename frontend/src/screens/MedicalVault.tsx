import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator,
  Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../api/client';

// ── SHE Design Tokens ──────────────────────────────────────────────────────────
const SHE = {
  rose:     '#FF6B9D', roseDark: '#E5528A', roseLight: '#FFE4EF',
  blush:    '#FFF0F5', lavender: '#C084FC', lavLight:  '#F3E8FF',
  mint:     '#34D399', gold:     '#FBC74D', peach:     '#FB923C',
  textDark: '#1F1329', textMid:  '#6B7280', white:     '#FFFFFF',
};

const TABS = ['🧪 Lab Results', '📋 Scan Report', '🔗 Gynac AI'];

// ── Status icon helper ─────────────────────────────────────────────────────────
const statusIcon = (s: string) =>
  s?.includes('High') ? '⬆' : s?.includes('Low') ? '⬇' : s?.includes('Normal') ? '✓' : '?';

export default function MedicalVault() {
  const [tab, setTab]                   = useState(0);
  const [reports, setReports]           = useState<any[]>([]);
  const [correlations, setCorrelations] = useState<any[]>([]);
  const [reportDate, setReportDate]     = useState<string | null>(null);
  const [reportText, setReportText]     = useState('');
  const [parsing, setParsing]           = useState(false);
  const [parsedPanel, setParsedPanel]   = useState<any[]>([]);
  const [parsedMeta, setParsedMeta]     = useState<any>(null);
  const [loading, setLoading]           = useState(false);

  useEffect(() => { fetchHistory(); fetchCorrelations(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/reports/history');
      setReports(res.data.reports || []);
    } catch (e) {}
  };

  const fetchCorrelations = async () => {
    try {
      const res = await apiClient.get('/reports/correlate');
      setCorrelations(res.data.insights || []);
      setReportDate(res.data.report_date || null);
    } catch (e) {}
  };

  const parseReport = async () => {
    if (!reportText.trim()) {
      Alert.alert('Empty', 'Please paste your lab report text first.');
      return;
    }
    setParsing(true);
    try {
      const res = await apiClient.post('/reports/parse-text', { text: reportText });
      setParsedPanel(res.data.panel || []);
      setParsedMeta(res.data);
      await fetchHistory();
      await fetchCorrelations();
      Alert.alert('✅ Report Parsed', `Extracted ${res.data.extracted_count} lab values. Check Lab Results and Gynac AI tabs!`);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.detail || 'Could not parse report.');
    } finally {
      setParsing(false);
    }
  };

  // ── Tab: Lab Results ─────────────────────────────────────────────────────────
  const renderLabResults = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {reports.length === 0 ? (
        <View style={{ alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48 }}>🔬</Text>
          <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 17, marginTop: 16 }}>No reports yet</Text>
          <Text style={{ color: SHE.textMid, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
            Go to the Scan Report tab to paste your lab report text and extract values automatically.
          </Text>
        </View>
      ) : (
        (reports || []).map((report, ri) => (
          <View key={report.id} style={{ marginBottom: 20 }}>
            {/* Report header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#F3E8FF' }} />
              <Text style={{ color: SHE.lavender, fontWeight: '700', fontSize: 12, marginHorizontal: 10 }}>
                📅 {report.date}
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#F3E8FF' }} />
            </View>

            {(!report.panel || report.panel.length === 0) ? (
              <Text style={{ color: SHE.textMid, fontSize: 13, textAlign: 'center' }}>No extracted values in this report.</Text>
            ) : (
              (report.panel || []).map((item: any) => (
                <View key={item.id} style={{
                  backgroundColor: SHE.white, borderRadius: 18, padding: 16, marginBottom: 10,
                  borderLeftWidth: 4, borderLeftColor: item.color,
                  shadowColor: '#FF6B9D', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 14 }}>{item.name}</Text>
                    </View>
                    <Text style={{ fontWeight: '900', fontSize: 20, color: item.color }}>
                      {item.value}
                      <Text style={{ fontSize: 11, fontWeight: '400', color: SHE.textMid }}> {item.unit}</Text>
                    </Text>
                    <View style={{ backgroundColor: item.color + '22', paddingHorizontal: 8, paddingVertical: 3,
                      borderRadius: 99, marginLeft: 8 }}>
                      <Text style={{ color: item.color, fontWeight: '800', fontSize: 11 }}>{item.status}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        ))
      )}
    </ScrollView>
  );

  // ── Tab: Scan Report ─────────────────────────────────────────────────────────
  const renderScanReport = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Instructions */}
        <View style={{ backgroundColor: SHE.lavLight, borderRadius: 20, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontWeight: '800', color: '#6B21A8', fontSize: 14, marginBottom: 8 }}>
            📋 How to use
          </Text>
          <Text style={{ color: '#7C3AED', fontSize: 13, lineHeight: 20 }}>
            1. Take a photo of your blood test report{'\n'}
            2. Use Google Lens, Notes, or any OCR app to extract the text{'\n'}
            3. Paste the text below and tap Parse{'\n\n'}
            SHE will automatically find: LH, FSH, Prolactin, Testosterone, AMH, Insulin, Glucose, Vitamin D3, B12, Ferritin, Follicle count
          </Text>
        </View>

        {/* Sample format hint */}
        <TouchableOpacity
          style={{ backgroundColor: SHE.roseLight, borderRadius: 16, padding: 12, marginBottom: 14 }}
          onPress={() => setReportText(
            'LH: 8.5 mIU/mL\nFSH: 3.2 mIU/mL\nProlactin: 18 ng/mL\nTestosterone: 62 ng/dL\nAMH: 4.1 ng/mL\nFasting Insulin: 14 μIU/mL\nFasting Glucose: 95 mg/dL\nVitamin D3: 18 ng/mL\nB12: 190 pg/mL\nFerritin: 8 ng/mL\nFollicle count: 14\nOvarian Volume: 12 mL'
          )}>
          <Text style={{ color: SHE.rose, fontWeight: '700', fontSize: 13, textAlign: 'center' }}>
            📎 Load example report (to test the app)
          </Text>
        </TouchableOpacity>

        {/* Text input */}
        <TextInput
          style={{
            borderWidth: 1.5, borderColor: reportText ? SHE.rose : '#E5E7EB',
            borderRadius: 20, padding: 16, color: SHE.textDark, fontSize: 13,
            lineHeight: 22, minHeight: 200, backgroundColor: SHE.white,
            textAlignVertical: 'top', marginBottom: 14,
          }}
          multiline
          value={reportText}
          onChangeText={setReportText}
          placeholder={"Paste your lab report text here...\n\nExample:\nLH: 8.5\nFSH: 4.2\nTestosterone: 58\nFasting Insulin: 12\n..."}
          placeholderTextColor="#9CA3AF"
        />

        {/* Parse button */}
        <TouchableOpacity
          onPress={parseReport}
          disabled={parsing}
          style={{
            backgroundColor: SHE.rose, borderRadius: 20, padding: 18,
            alignItems: 'center', marginBottom: 20,
            opacity: parsing ? 0.7 : 1,
          }}>
          {parsing
            ? <ActivityIndicator color="white" />
            : <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>🔬 Parse Lab Report</Text>
          }
        </TouchableOpacity>

        {/* Parsed results */}
        {parsedPanel.length > 0 && (
          <View>
            <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 16, marginBottom: 12 }}>
              ✅ Extracted {parsedMeta?.extracted_count} Values
            </Text>
            {parsedMeta?.computed?.lh_fsh_ratio && (
              <View style={{ backgroundColor: '#FFE4EF', borderRadius: 14, padding: 12, marginBottom: 12 }}>
                <Text style={{ color: SHE.roseDark, fontWeight: '700', fontSize: 13 }}>
                  🧮 LH:FSH Ratio = {parsedMeta.computed.lh_fsh_ratio}
                  {parsedMeta.computed.lh_fsh_ratio > 2 ? '  ⬆ High (PCOS marker)' : '  ✓ Normal'}
                </Text>
              </View>
            )}
            {parsedMeta?.computed?.homa_ir && (
              <View style={{ backgroundColor: '#FFF7ED', borderRadius: 14, padding: 12, marginBottom: 12 }}>
                <Text style={{ color: '#C2410C', fontWeight: '700', fontSize: 13 }}>
                  🩺 HOMA-IR (Insulin Resistance) = {parsedMeta.computed.homa_ir}
                  {parsedMeta.computed.homa_ir > 1.9 ? '  ⬆ Elevated (>1.9)' : '  ✓ Normal'}
                </Text>
              </View>
            )}
            {(parsedPanel || []).filter(p => p.value !== null).map((item: any) => (
              <View key={item.id} style={{
                backgroundColor: SHE.white, borderRadius: 16, padding: 14, marginBottom: 8,
                borderLeftWidth: 3, borderLeftColor: item.color,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 13 }}>{item.name}</Text>
                    <Text style={{ color: SHE.textMid, fontSize: 11 }}>Range: {item.range}</Text>
                  </View>
                  <Text style={{ fontWeight: '900', fontSize: 18, color: item.color, marginRight: 8 }}>
                    {item.value} <Text style={{ fontSize: 10 }}>{item.unit}</Text>
                  </Text>
                  <View style={{ backgroundColor: item.color + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 }}>
                    <Text style={{ color: item.color, fontWeight: '800', fontSize: 11 }}>{item.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // ── Tab: Gynac AI ────────────────────────────────────────────────────────────
  const renderCorrelations = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {reportDate && (
        <Text style={{ color: SHE.textMid, fontSize: 12, marginBottom: 14 }}>
          Based on your lab report from {reportDate}
        </Text>
      )}
      {correlations.length === 0 ? (
        <View style={{ alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48 }}>🩺</Text>
          <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 17, marginTop: 16 }}>
            No Gynac AI insights yet
          </Text>
          <Text style={{ color: SHE.textMid, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
            Upload your lab report in the Scan Report tab to see how your labs correlate with your logged symptoms.
          </Text>
        </View>
      ) : (
        (correlations || []).map((item: any) => (
          <View key={item.id} style={{
            backgroundColor: SHE.white, borderRadius: 22, padding: 18, marginBottom: 14,
            borderLeftWidth: 5, borderLeftColor: item.color,
            shadowColor: '#FF6B9D', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
          }}>
            {/* Title */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
              <Text style={{ fontSize: 28, marginRight: 12 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '900', color: SHE.textDark, fontSize: 15, lineHeight: 20 }}>
                  {item.title}
                </Text>
                <View style={{ backgroundColor: item.color + '22', paddingHorizontal: 8, paddingVertical: 3,
                  borderRadius: 99, alignSelf: 'flex-start', marginTop: 4 }}>
                  <Text style={{ color: item.color, fontWeight: '800', fontSize: 10, textTransform: 'uppercase' }}>
                    {item.severity === 'high' ? '⚠ Action Needed' :
                     item.severity === 'moderate' ? '💛 Watch Out' : '✅ Normal'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Lab finding */}
            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 10 }}>
              <Text style={{ fontWeight: '700', color: SHE.textDark, fontSize: 12, marginBottom: 3 }}>🔬 Lab Finding</Text>
              <Text style={{ color: SHE.textMid, fontSize: 12, lineHeight: 18 }}>{item.finding}</Text>
            </View>

            {/* Symptom link */}
            <View style={{ backgroundColor: SHE.lavLight, borderRadius: 12, padding: 12, marginBottom: 10 }}>
              <Text style={{ fontWeight: '700', color: '#6B21A8', fontSize: 12, marginBottom: 3 }}>🔗 Your Symptom Connection</Text>
              <Text style={{ color: '#7C3AED', fontSize: 12, lineHeight: 18 }}>{item.symptom_link}</Text>
            </View>

            {/* Doctor advice */}
            <View style={{ backgroundColor: item.color + '11', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontWeight: '700', color: item.color, fontSize: 12, marginBottom: 3 }}>💊 What to Do</Text>
              <Text style={{ color: SHE.textDark, fontSize: 12, lineHeight: 18 }}>{item.advice}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  // ── Layout ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      {/* Header */}
      <View style={{ marginHorizontal: 20, marginTop: 16, marginBottom: 8 }}>
        <Text style={{ fontWeight: '900', color: SHE.textDark, fontSize: 24 }}>🏥 Medical Vault</Text>
        <Text style={{ color: SHE.textMid, fontSize: 13, marginTop: 2 }}>
          Lab reports · Gynac AI insights · Report analysis
        </Text>
      </View>

      {/* Tab Bar */}
      <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 16,
        backgroundColor: '#F3E8FF', borderRadius: 18, padding: 4 }}>
        {TABS.map((label, i) => (
          <TouchableOpacity key={i} onPress={() => setTab(i)} style={{
            flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: 'center',
            backgroundColor: tab === i ? SHE.rose : 'transparent',
          }}>
            <Text style={{ fontSize: 11, fontWeight: '800',
              color: tab === i ? SHE.white : SHE.textMid }}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        {tab === 0 && renderLabResults()}
        {tab === 1 && renderScanReport()}
        {tab === 2 && renderCorrelations()}
      </View>
    </SafeAreaView>
  );
}
