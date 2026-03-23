import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

// 🎀 SHE Design Tokens
const SHE = {
  rose:          '#FF6B9D',
  roseDark:      '#E5528A',
  roseLight:     '#FFE4EF',
  blush:         '#FFF0F5',
  lavender:      '#C084FC',
  lavenderLight: '#F3E8FF',
  mint:          '#34D399',
  gold:          '#FBC74D',
  peach:         '#FB923C',
  textDark:      '#1F1329',
  textMid:       '#6B7280',
  white:         '#FFFFFF',
};

export default function Dashboard({ navigation }: any) {
  const { logout } = useAuth();
  const [healthScore, setHealthScore]       = useState(0);
  const [riskLevel, setRiskLevel]           = useState('Loading...');
  const [loading, setLoading]               = useState(true);
  const [pregnancyMode, setPregnancyMode]   = useState(false);
  const [birthControl, setBirthControl]     = useState('None');
  const [anomalies, setAnomalies]           = useState<any>(null);
  const [insights, setInsights]             = useState<any>(null);
  const [healthMetrics, setHealthMetrics]   = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [showHormoneInfo, setShowHormoneInfo] = useState(false);
  const [rotterdam, setRotterdam] = useState<any>(null);

  const fetchRotterdam = async () => {
    try {
      const res = await apiClient.get('/pcos/rotterdam');
      if (res.data) setRotterdam(res.data);
    } catch (e) {}
  };

  // ─── Per-metric personalised explainer ────────────────────────────────────
  const getMetricExplainer = (metric: any) => {
    switch (metric.id) {
      case 'bmi':
        return {
          what: 'BMI (Body Mass Index) measures if your weight is proportionate to your height. For PCOS, BMI is crucial because excess fat — especially around the belly — raises androgen (testosterone) levels, disrupts insulin, and makes periods more irregular.',
          how: `SHE calculated your BMI using your onboarding data:\n\n• Your weight: ${metric.value !== null ? String(metric.value).split(' ')[0] : '?'} kg/m²\n• Formula: Weight (kg) ÷ Height² (m)\n• Result: ${metric.value} kg/m² → ${metric.status}`,
          what_it_means: metric.status === 'Normal'
            ? '🟢 Your BMI is in a healthy range. This means your hormones have a better chance of staying balanced.'
            : metric.status === 'Overweight'
            ? '🟡 You are slightly overweight. Just 5–10% weight loss in people with PCOS can restore ovulation.'
            : metric.status === 'Obese'
            ? '🔴 Obesity is the biggest driver of insulin resistance in PCOS. Prioritise a low-glycaemic diet and daily movement.'
            : '🔵 You may be underweight. Low body fat can suppress oestrogen production.',
          data_used: ['Your height from signup', 'Your weight from signup'],
        };
      case 'acne':
        return {
          what: 'Acne is one of the 3 Rotterdam Criteria for PCOS. Androgens (like testosterone) stimulate excess oil (sebum) in skin, causing breakouts. High acne scores are a clinical sign of hyperandrogenism.',
          how: `SHE averaged your acne severity across all your logged cycles:\n\n• Logs analysed: all your period entries\n• Metric: Acne scale (0–10) per cycle\n• Your average: ${metric.value}/10 → ${metric.status}`,
          what_it_means: metric.status === 'Normal'
            ? '🟢 Your acne score is low. This suggests androgens are not significantly elevated for you.'
            : metric.status === 'Moderate'
            ? '🟡 Moderate acne is a soft signal of elevated androgens. Spearmint tea, zinc supplements, and low-GI diet can help.'
            : '🔴 Severe acne is a strong clinical sign of hyperandrogenism. An androgen blood panel (free testosterone, DHEA) is recommended.',
          data_used: ['Acne scale logged each cycle'],
        };
      case 'hair_loss':
        return {
          what: 'Hirsutism refers to excess male-pattern hair growth caused by high DHT (a potent androgen). Hair thinning on the scalp (androgenic alopecia) is its counterpart. Both signal the same hormonal imbalance.',
          how: `SHE averaged your hair loss severity across all logged cycles:\n\n• Your average hair loss score: ${metric.value}/10\n• Status: ${metric.status}`,
          what_it_means: metric.status === 'Normal'
            ? '🟢 Hair loss is within normal range — no hirsutism indicators.'
            : metric.status === 'Elevated'
            ? '🟡 Elevated hair loss may be DHT-related. Check ferritin and thyroid hormones too.'
            : '🔴 High hair loss combined with acne is a clinical hallmark of hirsutism. An anti-androgen prescription may be appropriate.',
          data_used: ['Hair loss scale logged each cycle'],
        };
      case 'insulin_resistance':
        return {
          what: "Insulin Resistance (IR) means your cells don't respond to insulin properly. Your pancreas compensates by making MORE insulin, which directly triggers the ovaries to produce excess androgens — worsening PCOS. Up to 70% of women with PCOS have IR.",
          how: `SHE scored your IR risk using these signals (each one adds to your score):\n\n${(metric.signals || []).length > 0
              ? (metric.signals || []).map((s: string) => `⚡ ${s}`).join('\n')
              : '✅ No IR signals detected'}\n\nYour composite score: ${metric.value} → ${metric.status}`,
          what_it_means: metric.status === 'Low Risk'
            ? '🟢 No significant insulin resistance signals. Keep your diet balanced and stay active!'
            : metric.status === 'Moderate Risk'
            ? '🟡 Some IR signals present. A low-GI diet (oats, lentils, vegetables), 30-min daily walks, and inositol supplements can significantly improve sensitivity.'
            : '🔴 High IR risk detected. A fasting glucose + insulin test (HOMA-IR) and consultation with an endocrinologist is strongly recommended.',
          data_used: ['Your BMI', 'Cycle regularity from logs', 'Insulin symptom logs', 'Activity level from signup'],
        };
      case 'hormonal_balance':
        return {
          what: "Hormonal Balance Index is SHE's composite score that combines cycle variability, androgen markers (acne, hair loss) into a single imbalance signal. It helps detect overall hormonal disruption even when individual tests are borderline.",
          how: `SHE scored your balance using:\n\n• Cycle length variability (higher std dev = more points)\n• Acne severity score\n• Hair loss severity score\n\nYour combined index: ${metric.value} → ${metric.status}`,
          what_it_means: metric.status === 'Balanced'
            ? '🟢 Your hormone markers look healthy! Keep logging consistently.'
            : metric.status === 'Mild Imbalance'
            ? '🟡 Mild imbalance detected. A full hormone panel (LH, FSH, AMH, testosterone) every 6 months is a good idea.'
            : '🔴 Strong imbalance detected. LH:FSH ratio, AMH, testosterone, DHEA-S, cortisol blood tests are recommended.',
          data_used: ['Cycle length history', 'Acne logs', 'Hair loss logs'],
        };
      case 'sleep':
        return {
          what: 'Sleep is deeply hormonal. Poor sleep raises cortisol (stress hormone), which in turn drives up androgens and insulin. PCOS and sleep disorders (like apnoea) are strongly linked.',
          how: `SHE uses the sleep hours you entered during onboarding:\n\n• Your sleep: ${metric.value} hrs/night\n• Ideal range: 7–9 hrs\n• Status: ${metric.status}`,
          what_it_means: metric.status === 'Normal'
            ? '🟢 Good sleep! This supports better cortisol rhythm and hormonal recovery.'
            : metric.status === 'Low' || metric.status === 'Poor'
            ? '🟡🔴 Insufficient sleep raises cortisol and worsens insulin resistance. Try a consistent sleep schedule and avoid screens for 30 min before bed.'
            : '🟡 Sleeping too much can signal hypothyroidism or adrenal fatigue. Mention it to your doctor.',
          data_used: ['Sleep hours from your profile'],
        };
      case 'activity':
        return {
          what: 'Physical activity is one of the most evidence-based treatments for PCOS. Exercise improves insulin sensitivity, lowers androgens, reduces stress, and can restore ovulation — without medication.',
          how: `SHE uses your activity level from your profile:\n\n• Your level: ${metric.value}\n• Ideal: Moderate or Active\n• Status: ${metric.status}`,
          what_it_means: metric.status === 'Good' || metric.status === 'Great'
            ? '🟢 Excellent! Regular movement is one of the best things for your cycle and hormones.'
            : metric.status === 'Low' || metric.status === 'Low-Moderate'
            ? '🟡 Low activity increases insulin resistance. Start with 20-min walks, then add 2 strength sessions per week.'
            : '🟡 Very high intensity can spike cortisol. Balance with rest days and gentle yoga.',
          data_used: ['Activity level from your profile'],
        };
      default:
        return { what: metric.tip, how: 'Based on your logged data.', what_it_means: metric.tip, data_used: [] };
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchRiskScore();
    fetchCycleAnomalies();
    fetchInsights();
    fetchHealthMetrics();
    fetchRotterdam();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await apiClient.get('/cycle/daily-insights');
      if (res.data) setInsights(res.data);
    } catch (e) {}
  };

  const fetchHealthMetrics = async () => {
    try {
      const res = await apiClient.get('/user/health-metrics');
      if (res.data) setHealthMetrics(res.data);
    } catch (e) {}
  };

  const fetchCycleAnomalies = async () => {
    try {
      const res = await apiClient.get('/cycle/predict');
      if (res.data && !res.data.msg?.includes('Not enough data')) setAnomalies(res.data);
    } catch (e) {}
  };

  const updateSettings = async (preg: boolean, bc: string) => {
    setPregnancyMode(preg);
    setBirthControl(bc);
    try {
      await apiClient.post('/user/settings', { pregnancy_mode: preg, birth_control: bc });
      fetchCycleAnomalies();
    } catch (e) {}
  };

  const fetchRiskScore = async () => {
    try {
      const res = await apiClient.post('/ai/predict-risk', {});
      if (res.data.error) {
        setRiskLevel('Model Untrained');
      } else {
        setHealthScore(res.data.hormone_health_score);
        setRiskLevel(res.data.pcos_risk_binary === 1 ? 'HIGH RISK' : 'LOW RISK');
      }
    } catch (e) {
      setRiskLevel('API Error');
    } finally {
      setLoading(false);
    }
  };

  const riskColor = riskLevel === 'LOW RISK' ? SHE.mint :
    riskLevel === 'HIGH RISK' ? SHE.rose : SHE.lavender;

  const QUICK_ACTIONS = [
    { emoji: '🩸', label: 'Log Period',  screen: 'Cycle',                      bg: SHE.roseLight,     text: SHE.roseDark  },
    { emoji: '🥗', label: 'Med Vault',   screen: 'Medical',                    bg: '#ECFDF5',         text: '#065F46'     },
    { emoji: '✨', label: 'Ask SHE AI', screen: 'AI Lab',                      bg: SHE.lavenderLight, text: '#6B21A8'     },
    { emoji: '🏃‍♀️', label: 'Workout',   screen: 'More',   sub: 'Fitness',      bg: '#FEF3C7',         text: '#92400E'     },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

        {/* ─── Header ─── */}
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8,
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '900', color: SHE.textDark }}>
              Hi, gorgeous 🌸
            </Text>
            <Text style={{ fontSize: 13, color: SHE.textMid, marginTop: 2 }}>How are you feeling today?</Text>
          </View>
          <TouchableOpacity onPress={logout}
            style={{ backgroundColor: SHE.roseLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99 }}>
            <Text style={{ color: SHE.roseDark, fontWeight: '700', fontSize: 13 }}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Health Score Card ─── */}
        <View style={{ marginHorizontal: 20, marginVertical: 12, borderRadius: 28, overflow: 'hidden',
          backgroundColor: SHE.rose, padding: 24,
          shadowColor: SHE.rose, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8 }}>
          {/* Decorative circles */}
          <View style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120,
            borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <View style={{ position: 'absolute', bottom: -30, right: 60, width: 80, height: 80,
            borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.07)' }} />

          {/* Label row with ⓘ button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' }}>
              🧬 Hormone Health Score
            </Text>
            <TouchableOpacity
              onPress={() => setShowHormoneInfo(true)}
              style={{ width: 28, height: 28, borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 15, color: 'white', fontWeight: '900' }}>ⓘ</Text>
            </TouchableOpacity>
          </View>
          {loading ? <ActivityIndicator color="white" size="small" style={{ marginVertical: 8 }} /> : (
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={{ color: 'white', fontSize: 64, fontWeight: '900', lineHeight: 72 }}>{healthScore}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22, marginBottom: 8, marginLeft: 4 }}>/100</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12,
              paddingVertical: 4, borderRadius: 99, marginRight: 8 }}>
              <Text style={{ color: 'white', fontWeight: '800', fontSize: 12 }}>{riskLevel}</Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Based on AI predictions</Text>
          </View>
        </View>

        {/* ─── Rotterdam PCOS Criteria Card ─── */}
        {rotterdam && (
          <View style={{ marginHorizontal: 20, marginBottom: 12, backgroundColor: 'white',
            borderRadius: 24, padding: 18, shadowColor: '#FF6B9D', shadowOpacity: 0.07, shadowRadius: 14, elevation: 3 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '900', color: SHE.textDark, fontSize: 15 }}>
                  🧙‍♀️ Rotterdam PCOS Criteria
                </Text>
                <Text style={{ color: SHE.textMid, fontSize: 11, marginTop: 2 }}>2 of 3 positive = High PCOS probability</Text>
              </View>
              <View style={{ backgroundColor: rotterdam.verdict_color + '22', paddingHorizontal: 10,
                paddingVertical: 5, borderRadius: 99 }}>
                <Text style={{ color: rotterdam.verdict_color, fontWeight: '900', fontSize: 18 }}>{rotterdam.verdict_icon}</Text>
              </View>
            </View>

            {/* 3 Pillars */}
            {['pillar_1', 'pillar_2', 'pillar_3'].map((pk, pi) => {
              const p = rotterdam.pillars?.[pk];
              if (!p) return null;
              const color = p.positive === true ? '#FF6B9D' : p.positive === false ? '#34D399' : '#9CA3AF';
              const icon  = p.positive === true ? '🚨' : p.positive === false ? '✅' : '❓';
              return (
                <View key={pk} style={{ flexDirection: 'row', borderRadius: 14,
                  backgroundColor: color + '11', padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: color }}>
                  <Text style={{ fontSize: 20, marginRight: 10 }}>{icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 12 }}>
                      Pillar {pi + 1}: {p.name}
                    </Text>
                    <Text style={{ color: SHE.textMid, fontSize: 11, marginTop: 2, lineHeight: 16 }}>{p.evidence}</Text>
                    <Text style={{ color: color, fontSize: 10, marginTop: 2, fontWeight: '700' }}>Threshold: {p.threshold}</Text>
                  </View>
                  <View style={{ backgroundColor: color + '22', paddingHorizontal: 8, paddingVertical: 3,
                    borderRadius: 99, alignSelf: 'flex-start' }}>
                    <Text style={{ color, fontWeight: '900', fontSize: 10 }}>
                      {p.positive === true ? 'Positive' : p.positive === false ? 'Negative' : 'Unknown'}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Verdict */}
            <View style={{ backgroundColor: rotterdam.verdict_color + '15', borderRadius: 16,
              padding: 14, marginTop: 4 }}>
              <Text style={{ fontWeight: '900', color: rotterdam.verdict_color, fontSize: 14, marginBottom: 4 }}>
                {rotterdam.verdict_icon} {rotterdam.verdict}
              </Text>
              <Text style={{ color: SHE.textMid, fontSize: 12, lineHeight: 18 }}>{rotterdam.recommendation}</Text>
            </View>

            {/* Disclaimer */}
            <Text style={{ color: '#9CA3AF', fontSize: 10, marginTop: 10, textAlign: 'center', lineHeight: 14 }}>
              {rotterdam.disclaimer}
            </Text>
          </View>
        )}

        {/* ─── Cycle Phase Card ─── */}
        {anomalies?.cycle_phase && (
          <View style={{ marginHorizontal: 20, marginBottom: 12, backgroundColor: SHE.lavenderLight,
            borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E9D5FF' }}>
            <Text style={{ fontSize: 12, color: SHE.lavender, fontWeight: '700', textTransform: 'uppercase',
              letterSpacing: 1, marginBottom: 6 }}>Current Phase</Text>
            <Text style={{ fontSize: 32, fontWeight: '900', color: '#6B21A8', marginBottom: 6 }}>
              {anomalies.cycle_phase === 'Menstrual' ? '🩸' :
               anomalies.cycle_phase === 'Follicular' ? '🌱' :
               anomalies.cycle_phase === 'Ovulation' ? '✨' : '🌙'} {anomalies.cycle_phase}
            </Text>
            <Text style={{ color: '#7C3AED', fontSize: 14 }}>
              Estrogen <Text style={{ fontWeight: '800' }}>{anomalies.hormone_state?.estrogen}</Text>
              {'  ·  '}Progesterone <Text style={{ fontWeight: '800' }}>{anomalies.hormone_state?.progesterone}</Text>
            </Text>
          </View>
        )}

        {/* ─── Alert Banners ─── */}
        {anomalies?.severe_pcos_flag && (
          <View style={{ marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FFF1F2',
            borderRadius: 18, padding: 16, borderLeftWidth: 4, borderLeftColor: SHE.rose, flexDirection: 'row' }}>
            <Text style={{ fontSize: 28, marginRight: 12 }}>🚨</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', color: SHE.roseDark, fontSize: 15 }}>PCOS Pattern Detected</Text>
              <Text style={{ color: '#9F1239', fontSize: 13, marginTop: 3 }}>
                Irregular cycles + acne. Please consult an Endocrinologist.
              </Text>
            </View>
          </View>
        )}

        {anomalies?.missed_period && (
          <View style={{ marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FFF7ED',
            borderRadius: 18, padding: 16, borderLeftWidth: 4, borderLeftColor: SHE.peach, flexDirection: 'row' }}>
            <Text style={{ fontSize: 28, marginRight: 12 }}>⏰</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', color: '#C2410C', fontSize: 15 }}>Missed Period Alert</Text>
              <Text style={{ color: '#9A3412', fontSize: 13, marginTop: 3 }}>
                {anomalies.days_since_last} days since last period. Consider taking a test.
              </Text>
            </View>
          </View>
        )}

        {anomalies?.irregular_cycle && !anomalies?.missed_period && (
          <View style={{ marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FFFBEB',
            borderRadius: 18, padding: 16, borderLeftWidth: 4, borderLeftColor: SHE.gold, flexDirection: 'row' }}>
            <Text style={{ fontSize: 28, marginRight: 12 }}>📈</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', color: '#92400E', fontSize: 15 }}>Irregular Cycle</Text>
              <Text style={{ color: '#78350F', fontSize: 13, marginTop: 3 }}>
                High cycle variability detected. Keep logging to train the AI!
              </Text>
            </View>
          </View>
        )}

        {/* ─── Quick Actions ─── */}
        <View style={{ marginHorizontal: 20, marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: SHE.textDark, marginBottom: 12 }}>
            💕 Quick Actions
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {QUICK_ACTIONS.map((a, i) => (
              <TouchableOpacity key={i}
                onPress={() => {
                  if (a.sub) navigation.navigate(a.screen, { screen: a.sub });
                  else navigation.navigate(a.screen);
                }}
                style={{ width: '46%', backgroundColor: a.bg, borderRadius: 20, padding: 20,
                  alignItems: 'center', shadowColor: '#FF6B9D',
                  shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}>
                <Text style={{ fontSize: 36, marginBottom: 8 }}>{a.emoji}</Text>
                <Text style={{ fontWeight: '800', color: a.text, fontSize: 13 }}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Health Metrics Panel ─── */}
        {healthMetrics && (
          <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: SHE.textDark, marginBottom: 12 }}>
              🧬 My Health Metrics
            </Text>

            {/* Overall Risk Banner */}
            {healthMetrics.overall && (
              <View style={{
                backgroundColor: healthMetrics.overall.color + '22',
                borderRadius: 18, padding: 16, marginBottom: 14,
                borderLeftWidth: 4, borderLeftColor: healthMetrics.overall.color,
              }}>
                <Text style={{ fontWeight: '800', color: healthMetrics.overall.color, fontSize: 15, marginBottom: 4 }}>
                  {healthMetrics.overall.level === 'Low Risk' ? '✅' :
                   healthMetrics.overall.level === 'Moderate Risk' ? '⚠️' : '🚨'}{' '}
                  {healthMetrics.overall.level}
                </Text>
                <Text style={{ color: SHE.textMid, fontSize: 13, lineHeight: 18 }}>{healthMetrics.overall.advice}</Text>
              </View>
            )}

            {/* Individual Metric Cards */}
            {(healthMetrics.metrics || []).map((metric: any, i: number) => (
              <View key={metric.id} style={{
                backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 10,
                shadowColor: '#FF6B9D', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
                borderLeftWidth: 4, borderLeftColor: metric.color,
              }}>
                {/* Top row: icon + name + status badge + ⓘ button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ width: 44, height: 44, backgroundColor: metric.color + '22', borderRadius: 14,
                    justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 22 }}>{metric.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 14 }}>{metric.name}</Text>
                    <Text style={{ color: SHE.textMid, fontSize: 11, marginTop: 1 }}>Normal range: {metric.range}</Text>
                  </View>
                  {/* ⓘ Info Button */}
                  <TouchableOpacity
                    onPress={() => setSelectedMetric(metric)}
                    style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: metric.color + '22',
                      justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                    <Text style={{ fontSize: 16, color: metric.color, fontWeight: '900' }}>ⓘ</Text>
                  </TouchableOpacity>
                  <View style={{ backgroundColor: metric.color + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
                    <Text style={{ color: metric.color, fontWeight: '800', fontSize: 11 }}>{metric.status}</Text>
                  </View>
                </View>

                {/* Value display */}
                <View style={{ backgroundColor: metric.color + '11', borderRadius: 12, padding: 12,
                  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ color: SHE.textMid, fontSize: 12 }}>Your value</Text>
                  <Text style={{ fontWeight: '900', color: metric.color, fontSize: 20 }}>
                    {String(metric.value)}{metric.unit ? ` ${metric.unit}` : ''}
                  </Text>
                </View>

                {/* Tip */}
                <View style={{ flexDirection: 'row', backgroundColor: metric.color + '11',
                  borderRadius: 10, padding: 10, alignItems: 'flex-start', gap: 6 }}>
                  <Text style={{ fontSize: 14 }}>💡</Text>
                  <Text style={{ fontSize: 11, color: SHE.textMid, flex: 1, lineHeight: 16 }}>{metric.tip}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ─── Daily Insights ─── */}
        {insights?.insights && insights.insights.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              marginHorizontal: 20, marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: SHE.textDark }}>💡 Daily Insights</Text>
              {insights.cycle_day && (
                <View style={{ backgroundColor: SHE.roseLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
                  <Text style={{ color: SHE.roseDark, fontWeight: '700', fontSize: 12 }}>Day {insights.cycle_day}</Text>
                </View>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
              {insights.insights.map((item: any, idx: number) => (
                <View key={idx} style={{
                  width: 160, padding: 16, borderRadius: 20,
                  backgroundColor: (item.color || SHE.roseLight) + '22',
                  borderWidth: 1.5, borderColor: (item.color || SHE.roseLight) + '55',
                }}>
                  <Text style={{ fontSize: 24, marginBottom: 6 }}>
                    {item.type === 'cycle_day' ? '📍' :
                     item.type === 'pregnancy_chance' ? '❤️' :
                     item.type === 'next_period' ? '🗓️' :
                     item.type === 'ovulation' ? '✨' :
                     item.type === 'hormones' ? '🧬' :
                     item.type === 'pcos_alert' ? '⚠️' : '💡'}
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: SHE.textDark, marginBottom: 4 }}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: item.color || SHE.rose, fontWeight: '700' }}>{item.subtitle}</Text>
                  <Text style={{ fontSize: 11, color: SHE.textMid, marginTop: 4, lineHeight: 16 }}>{item.description}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ─── Medical Settings ─── */}
        <View style={{ marginHorizontal: 20, marginBottom: 32, backgroundColor: 'white',
          borderRadius: 24, padding: 20, shadowColor: '#FF6B9D', shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: SHE.textDark, marginBottom: 16 }}>
            ⚙️ Medical Settings
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View>
              <Text style={{ fontWeight: '700', color: SHE.textDark }}>Pregnancy Mode</Text>
              <Text style={{ fontSize: 12, color: SHE.textMid }}>Switches AI to pregnancy tracking</Text>
            </View>
            <TouchableOpacity
              onPress={() => updateSettings(!pregnancyMode, birthControl)}
              style={{ width: 52, height: 30, borderRadius: 15,
                backgroundColor: pregnancyMode ? SHE.rose : '#E5E7EB',
                justifyContent: 'center', paddingHorizontal: 3 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'white',
                alignSelf: pregnancyMode ? 'flex-end' : 'flex-start',
                shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }} />
            </TouchableOpacity>
          </View>

          <Text style={{ fontWeight: '700', color: SHE.textDark, marginBottom: 10 }}>Birth Control</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {['None', 'Pill', 'IUD', 'Implant'].map(bc => (
              <TouchableOpacity key={bc} onPress={() => updateSettings(pregnancyMode, bc)}
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99,
                  backgroundColor: birthControl === bc ? SHE.rose : SHE.roseLight,
                  borderWidth: 1, borderColor: birthControl === bc ? SHE.roseDark : SHE.roseLight }}>
                <Text style={{ color: birthControl === bc ? 'white' : SHE.roseDark, fontWeight: '700', fontSize: 13 }}>
                  {bc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* ─── Hormone Health Score Info Modal ─── */}
      <Modal
        visible={showHormoneInfo}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHormoneInfo(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setShowHormoneInfo(false)}>
          <TouchableOpacity activeOpacity={1}>
            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28 }}>
              {/* Handle */}
              <View style={{ width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 99, alignSelf: 'center', marginBottom: 20 }} />

              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View style={{ width: 54, height: 54, backgroundColor: '#FFE4EF', borderRadius: 18,
                  justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                  <Text style={{ fontSize: 28 }}>🧬</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '900', color: SHE.textDark, fontSize: 18 }}>Hormone Health Score</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
                    <View style={{ backgroundColor: (
                        healthScore >= 75 ? '#ECFDF5' : healthScore >= 50 ? '#FFFBEB' : '#FFF1F2'
                      ), paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 }}>
                      <Text style={{ fontWeight: '800', fontSize: 12, color: (
                        healthScore >= 75 ? '#065F46' : healthScore >= 50 ? '#92400E' : '#BE185D'
                      )}}>
                        {healthScore}/100 · {riskLevel}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setShowHormoneInfo(false)}
                  style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6',
                    justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: SHE.textMid }}>{'✕'}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
                {/* What is the score */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 14, marginBottom: 8 }}>
                    {'🔍 What is the Hormone Health Score?'}
                  </Text>
                  <Text style={{ color: SHE.textMid, fontSize: 13, lineHeight: 20 }}>
                    {'Your Hormone Health Score (0–100) is SHE\'s AI-powered estimate of how balanced your hormonal environment is right now. A higher score means lower PCOS risk and more stable hormones. It is updated each time you open the app using your latest profile and cycle data.'}
                  </Text>
                </View>

                {/* How it is calculated */}
                <View style={{ backgroundColor: '#FFE4EF', borderRadius: 16, padding: 14, marginBottom: 16 }}>
                  <Text style={{ fontWeight: '800', color: SHE.rose, fontSize: 14, marginBottom: 10 }}>
                    {'🧮 How SHE calculates your score'}
                  </Text>

                  {/* Step 1 */}
                  <View style={{ marginBottom: 10, paddingLeft: 8, borderLeftWidth: 3, borderLeftColor: SHE.rose }}>
                    <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 13 }}>Step 1 — Feature extraction</Text>
                    <Text style={{ color: SHE.textMid, fontSize: 12, lineHeight: 18, marginTop: 2 }}>
                      SHE collects 6 clinical features from your profile:{'\n'}
                      {'• Age · BMI · Avg cycle length\n• Acne score · Hair loss score · Follicle estimate'}
                    </Text>
                  </View>

                  {/* Step 2 */}
                  <View style={{ marginBottom: 10, paddingLeft: 8, borderLeftWidth: 3, borderLeftColor: '#F59E0B' }}>
                    <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 13 }}>Step 2 — AI prediction</Text>
                    <Text style={{ color: SHE.textMid, fontSize: 12, lineHeight: 18, marginTop: 2 }}>
                      {'A RandomForest model (trained on 1,000 synthetic PCOS patients using the Rotterdam Criteria) predicts your PCOS probability. The health score = (1 − PCOS probability) × 100.'}
                    </Text>
                  </View>

                  {/* Step 3 */}
                  <View style={{ paddingLeft: 8, borderLeftWidth: 3, borderLeftColor: '#34D399' }}>
                    <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 13 }}>Step 3 — Rule-based refinement</Text>
                    <Text style={{ color: SHE.textMid, fontSize: 12, lineHeight: 18, marginTop: 2 }}>
                      {'If the AI model needs more data, SHE uses an evidence-based rule engine that deducts points for: high BMI, irregular cycles, elevated acne, hair loss, high follicle count, and sedentary lifestyle.'}
                    </Text>
                  </View>
                </View>

                {/* What your score means */}
                <View style={{ backgroundColor: (
                    healthScore >= 75 ? '#ECFDF5' : healthScore >= 50 ? '#FFFBEB' : '#FFF1F2'
                  ), borderRadius: 16, padding: 14, marginBottom: 16 }}>
                  <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 14, marginBottom: 8 }}>
                    {'💕 What your score of '}{healthScore}{' means'}
                  </Text>
                  <Text style={{ color: SHE.textDark, fontSize: 14, lineHeight: 22 }}>
                    {healthScore >= 75
                      ? '🟢 Excellent! Your hormonal environment looks balanced. Keep up your healthy habits and keep logging your cycles to maintain accurate predictions.'
                      : healthScore >= 55
                      ? '🟡 Moderate balance. Some PCOS risk factors are present. Focus on sleep, low-GI diet, regular movement, and consistent cycle logging.'
                      : '🔴 Multiple hormonal risk markers detected. We recommend seeing an endocrinologist for a full PCOS evaluation (LH, FSH, testosterone, insulin panel).'}
                  </Text>
                </View>

                {/* Data used */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 13, marginBottom: 8 }}>
                    {'📊 Data used in this calculation'}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {['Your age', 'BMI (height + weight)', 'Avg cycle length', 'Acne logs', 'Hair loss logs', 'Activity level'].map((d, i) => (
                      <View key={i} style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 }}>
                        <Text style={{ fontSize: 12, color: SHE.textMid, fontWeight: '600' }}>{'📎 '}{d}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ─── Metric Info Modal ─── */}
      <Modal
        visible={!!selectedMetric}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMetric(null)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setSelectedMetric(null)}>
          <TouchableOpacity activeOpacity={1}>
            {selectedMetric && (() => {
              const exp = getMetricExplainer(selectedMetric);
              return (
                <View style={{
                  backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32,
                  padding: 28, maxHeight: '90%'
                }}>
                  <View style={{ width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 99,
                    alignSelf: 'center', marginBottom: 20 }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <View style={{ width: 54, height: 54, backgroundColor: selectedMetric.color + '22',
                      borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                      <Text style={{ fontSize: 28 }}>{selectedMetric.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '900', color: SHE.textDark, fontSize: 18, lineHeight: 22 }}>
                        {selectedMetric.name}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
                        <View style={{ backgroundColor: selectedMetric.color + '22', paddingHorizontal: 10,
                          paddingVertical: 3, borderRadius: 99 }}>
                          <Text style={{ color: selectedMetric.color, fontWeight: '800', fontSize: 12 }}>
                            {selectedMetric.status}
                          </Text>
                        </View>
                        <Text style={{ color: SHE.textMid, fontSize: 12 }}>
                          Value: {String(selectedMetric.value)}{selectedMetric.unit}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => setSelectedMetric(null)}
                      style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6',
                        justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, color: SHE.textMid }}>{'✕'}</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: 16 }}>
                      <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 14, marginBottom: 8 }}>
                        {'🔍 What is this?'}
                      </Text>
                      <Text style={{ color: SHE.textMid, fontSize: 13, lineHeight: 20 }}>{exp.what}</Text>
                    </View>

                    <View style={{ backgroundColor: selectedMetric.color + '11', borderRadius: 16,
                      padding: 14, marginBottom: 16 }}>
                      <Text style={{ fontWeight: '800', color: selectedMetric.color, fontSize: 14, marginBottom: 8 }}>
                        {'🧮 How SHE calculated your score'}
                      </Text>
                      <Text style={{ color: SHE.textDark, fontSize: 13, lineHeight: 21 }}>
                        {exp.how}
                      </Text>
                    </View>

                    <View style={{ backgroundColor: selectedMetric.color + '18', borderRadius: 16,
                      padding: 14, marginBottom: 16 }}>
                      <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 14, marginBottom: 8 }}>
                        {'💕 What this means for you'}
                      </Text>
                      <Text style={{ color: SHE.textDark, fontSize: 14, lineHeight: 22 }}>
                        {exp.what_it_means}
                      </Text>
                    </View>

                    {exp.data_used && exp.data_used.length > 0 && (
                      <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: '800', color: SHE.textDark, fontSize: 13, marginBottom: 8 }}>
                          {'📊 Data points used'}
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                          {exp.data_used.map((d: string, i: number) => (
                            <View key={i} style={{ backgroundColor: '#F3F4F6',
                              paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 }}>
                              <Text style={{ fontSize: 12, color: SHE.textMid, fontWeight: '600' }}>
                                {'📎 '}{d}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 14, marginBottom: 8 }}>
                      <Text style={{ fontSize: 12, color: SHE.textMid, textAlign: 'center' }}>
                        {'🩺 Healthy range: '}<Text style={{ fontWeight: '700', color: SHE.textDark }}>{selectedMetric.range}</Text>
                        {'  ·  Your value: '}<Text style={{ fontWeight: '700', color: selectedMetric.color }}>
                          {String(selectedMetric.value)}{selectedMetric.unit}
                        </Text>
                      </Text>
                    </View>
                  </ScrollView>
                </View>
              );
            })()}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}
