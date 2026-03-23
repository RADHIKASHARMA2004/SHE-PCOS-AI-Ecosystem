import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert,
  Dimensions, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../api/client';

const { width } = Dimensions.get('window');

const PHASE_COLORS: Record<string, string> = {
  Menstrual: '#FF6B6B',
  Follicular: '#FFD93D',
  Ovulation: '#4ECDC4',
  Luteal: '#A78BFA',
};

const PHASE_ICONS: Record<string, string> = {
  Menstrual: '🩸',
  Follicular: '🌱',
  Ovulation: '✨',
  Luteal: '🌙',
};

export default function CycleTracker() {
  // === STATE ===
  const [activeTab, setActiveTab] = useState<'overview' | 'log' | 'history'>('overview');
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(false);

  // Insights & history from API
  const [insights, setInsights] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [totalCycles, setTotalCycles] = useState(0);

  // Calendar state
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());

  // Log form state
  const [flow, setFlow] = useState('Medium');
  const [pain, setPain] = useState('3');
  const [bbt, setBbt] = useState('');
  const [cervicalMucus, setCervicalMucus] = useState('');
  const [clots, setClots] = useState(false);
  const [spotting, setSpotting] = useState(false);
  const [lhTest, setLhTest] = useState('');
  const [acne, setAcne] = useState('');
  const [hairLoss, setHairLoss] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [endDate, setEndDate] = useState('');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [insightsRes, historyRes] = await Promise.all([
        apiClient.get('/cycle/daily-insights'),
        apiClient.get('/cycle/history'),
      ]);
      if (insightsRes.data) setInsights(insightsRes.data);
      if (historyRes.data) {
        setHistory(historyRes.data.history || []);
        setTotalCycles(historyRes.data.total_cycles || 0);
      }
    } catch (e) {
      console.log('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleLog = async () => {
    setLogLoading(true);
    const mockDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate);
    const dateStr = mockDate.toISOString().split('T')[0];

    try {
      await apiClient.post('/cycle/log', {
        start_date: dateStr,
        end_date: endDate || null,
        flow_intensity: flow,
        pain_level: parseInt(pain) || 3,
        bbt: bbt ? parseFloat(bbt) : null,
        cervical_mucus: cervicalMucus || null,
        symptoms: symptoms,
        clots,
        spotting,
        lh_test_result: lhTest || null,
        acne_scale: acne ? parseInt(acne) : null,
        hair_loss_scale: hairLoss ? parseInt(hairLoss) : null,
        insulin_symptoms: [],
      });
      Alert.alert('✅ Logged!', `Period for ${dateStr} has been saved.`);
      fetchAll();
      setActiveTab('overview');
    } catch (e) {
      Alert.alert('Error', 'Could not log cycle.');
    } finally {
      setLogLoading(false);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }, (_, i) => i + 1);
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const symptomOptions = ['Cramps', 'Bloating', 'Headache', 'Mood Swings', 'Fatigue', 'Back Pain'];
  const toggleSymptom = (s: string) => setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const phaseColor = insights?.phase_color || '#FF6B6B';
  const phase = insights?.phase || 'Unknown';

  // === RENDER HELPERS ===
  const renderDaysUntilBadge = () => {
    if (!insights) return null;
    const days = insights.days_until_period;
    if (days === null || days === undefined) return null;
    if (days > 0) {
      return (
        <View style={{ alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 4 }}>Next period in</Text>
          <Text style={{ fontSize: 56, fontWeight: '900', color: '#FF6B6B', lineHeight: 64 }}>{days}</Text>
          <Text style={{ fontSize: 20, color: '#FF6B6B', fontWeight: '700' }}>days</Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8 }}>
            Expected {new Date(insights.next_period).toDateString()}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Text style={{ fontSize: 18, color: '#F97316', fontWeight: '700' }}>Period may be starting! 🩸</Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>
            Expected {Math.abs(days)} day(s) ago
          </Text>
        </View>
      );
    }
  };

  const renderInsightCard = (item: any, idx: number) => (
    <View key={idx} style={{
      width: 160, marginRight: 12, padding: 16, borderRadius: 20,
      backgroundColor: item.color + '22', borderWidth: 1.5, borderColor: item.color + '55',
    }}>
      <Text style={{ fontSize: 24, marginBottom: 6 }}>
        {item.type === 'cycle_day' ? '📍' :
         item.type === 'pregnancy_chance' ? '❤️' :
         item.type === 'next_period' ? '🗓️' :
         item.type === 'ovulation' ? '✨' :
         item.type === 'hormones' ? '🧬' :
         item.type === 'pcos_alert' ? '⚠️' : '💡'}
      </Text>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#1F2937', marginBottom: 4 }}>{item.title}</Text>
      <Text style={{ fontSize: 12, color: item.color, fontWeight: '600' }}>{item.subtitle}</Text>
      <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 4, lineHeight: 16 }}>{item.description}</Text>
    </View>
  );

  const renderHistoryItem = (item: any, idx: number) => {
    const start = new Date(item.start_date);
    const cycleLen = item.cycle_length;
    const duration = item.duration_days;
    return (
      <View key={item.id} style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12,
        borderLeftWidth: 4, borderLeftColor: '#FF6B6B',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', color: '#1F2937', fontSize: 15 }}>
            {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 6, gap: 12 }}>
            {duration !== null && duration !== undefined && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>🩸 </Text>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>{duration}d period</Text>
              </View>
            )}
            {cycleLen && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>🔄 </Text>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>{cycleLen}d cycle</Text>
              </View>
            )}
          </View>
          {item.flow_intensity && (
            <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              Flow: {item.flow_intensity} · Pain: {item.pain_level}/10
            </Text>
          )}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ backgroundColor: '#FF6B6B22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
            <Text style={{ fontSize: 11, color: '#FF6B6B', fontWeight: '700' }}>Cycle #{totalCycles - idx}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF5F5' }}>
      {/* === HEADER PHASE BANNER === */}
      <View style={{ backgroundColor: phaseColor, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: '900' }}>
              {PHASE_ICONS[phase] || '🩸'} {phase} Phase
            </Text>
            {insights?.cycle_day && (
              <Text style={{ color: 'white', opacity: 0.85, fontSize: 14, marginTop: 2 }}>
                Day {insights.cycle_day} of ~{insights.avg_cycle_length || 28} day cycle
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setActiveTab('log')}
            style={{ backgroundColor: 'white', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99 }}
          >
            <Text style={{ color: phaseColor, fontWeight: '700', fontSize: 13 }}>+ Log Period</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* === TABS === */}
      <View style={{ flexDirection: 'row', backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        {(['overview', 'log', 'history'] as const).map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}
            style={{ flex: 1, alignItems: 'center', paddingBottom: 10,
              borderBottomWidth: 2, borderBottomColor: activeTab === tab ? phaseColor : 'transparent' }}>
            <Text style={{ fontWeight: '700', color: activeTab === tab ? phaseColor : '#9CA3AF', textTransform: 'capitalize' }}>
              {tab === 'overview' ? 'Overview' : tab === 'log' ? 'Log Period' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color="#FF6B6B" size="large" style={{ marginTop: 48 }} />
        ) : activeTab === 'overview' ? (
          <View style={{ paddingBottom: 32 }}>

            {/* Countdown */}
            {renderDaysUntilBadge()}

            {/* Cycle Summary Card */}
            {insights && (
              <View style={{ marginHorizontal: 16, backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16,
                shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                <Text style={{ fontWeight: '800', fontSize: 17, color: '#1F2937', marginBottom: 14 }}>📊 Cycle Summary</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {[
                    { label: 'Avg Cycle', value: `${insights.avg_cycle_length}d`, color: '#FF6B6B' },
                    { label: 'Avg Period', value: `${insights.avg_period_duration}d`, color: '#EC4899' },
                    { label: 'Next Ovulation', value: insights.days_until_ovulation > 0 ? `In ${insights.days_until_ovulation}d` : 'Now', color: '#4ECDC4' },
                    { label: 'Pregnancy', value: insights.pregnant_chance, color: '#8B5CF6' },
                  ].map((stat, i) => (
                    <View key={i} style={{ flex: 1, minWidth: '45%', backgroundColor: stat.color + '11',
                      padding: 14, borderRadius: 14, borderWidth: 1, borderColor: stat.color + '33' }}>
                      <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{stat.label}</Text>
                      <Text style={{ fontSize: 18, fontWeight: '800', color: stat.color }}>{stat.value}</Text>
                    </View>
                  ))}
                </View>
                {insights.irregular_cycles && (
                  <View style={{ backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12, marginTop: 12,
                    borderLeftWidth: 3, borderLeftColor: '#F59E0B' }}>
                    <Text style={{ color: '#92400E', fontWeight: '700', fontSize: 13 }}>⚠️ Irregular cycles detected</Text>
                    <Text style={{ color: '#78350F', fontSize: 12, marginTop: 2 }}>
                      Your cycles are irregular. Consider logging symptoms consistently for better AI predictions.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Mini Calendar */}
            <View style={{ marginHorizontal: 16, backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 16,
              shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontWeight: '800', fontSize: 16, color: '#1F2937' }}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Text>
              </View>
              {/* Day headers */}
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '600' }}>{d}</Text>
                  </View>
                ))}
              </View>
              {/* Calendar grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {Array(firstDayOfMonth).fill(null).map((_, i) => (
                  <View key={`empty-${i}`} style={{ width: `${100/7}%`, height: 40 }} />
                ))}
                {days.map(day => {
                  const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                  const isSelected = day === selectedDate;
                  // Mark period start from history
                  const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isPeriod = history.some(h => {
                    const start = new Date(h.start_date);
                    const end = h.end_date ? new Date(h.end_date) : new Date(h.start_date);
                    end.setDate(end.getDate() + (h.duration_days || 4));
                    return dayDate >= start && dayDate <= end;
                  });
                  // Mark ovulation
                  const isOvulation = insights?.ovulation_date &&
                    dayDate.toDateString() === new Date(insights.ovulation_date).toDateString();

                  return (
                    <TouchableOpacity key={day}
                      onPress={() => { setSelectedDate(day); setActiveTab('log'); }}
                      style={{ width: `${100/7}%`, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{
                        width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: isPeriod ? '#FF6B6B' : isOvulation ? '#4ECDC4' :
                          isToday ? '#F3F4F6' : 'transparent',
                        borderWidth: isSelected && !isPeriod ? 2 : 0,
                        borderColor: phaseColor,
                      }}>
                        <Text style={{
                          fontWeight: isToday || isPeriod ? '800' : '400',
                          color: isPeriod || isOvulation ? 'white' : isToday ? '#1F2937' : '#374151',
                          fontSize: 13,
                        }}>{day}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {/* Legend */}
              <View style={{ flexDirection: 'row', gap: 16, marginTop: 12, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF6B6B' }} />
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>Period</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#4ECDC4' }} />
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>Ovulation</Text>
                </View>
              </View>
            </View>

            {/* Daily Insights */}
            {insights?.insights && insights.insights.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: '800', fontSize: 17, color: '#1F2937', marginHorizontal: 16, marginBottom: 12 }}>
                  💡 My Daily Insights
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                  {insights.insights.map((insight: any, i: number) => renderInsightCard(insight, i))}
                </ScrollView>
              </View>
            )}

            {/* Hormone Snapshot */}
            {insights?.hormone_state && (
              <View style={{ marginHorizontal: 16, backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16,
                shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                <Text style={{ fontWeight: '800', fontSize: 17, color: '#1F2937', marginBottom: 14 }}>🧬 Hormone State</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {[
                    { name: 'Estrogen', value: insights.hormone_state.estrogen, color: '#EC4899' },
                    { name: 'Progesterone', value: insights.hormone_state.progesterone, color: '#8B5CF6' },
                  ].map((h, i) => (
                    <View key={i} style={{ flex: 1, backgroundColor: h.color + '11', padding: 14,
                      borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: h.color + '33' }}>
                      <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{h.name}</Text>
                      <Text style={{ fontSize: 20, fontWeight: '800', color: h.color, marginTop: 4 }}>{h.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          </View>

        ) : activeTab === 'log' ? (
          <View style={{ padding: 16, paddingBottom: 40 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 16 }}>Log Period</Text>

            {/* Date Selector from Calendar */}
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16,
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ fontWeight: '700', color: '#374151', marginBottom: 8 }}>Start Date</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                  <TouchableOpacity key={d} onPress={() => setSelectedDate(d)}
                    style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
                      backgroundColor: selectedDate === d ? '#FF6B6B' : '#F9FAFB',
                      borderWidth: 1, borderColor: selectedDate === d ? '#FF6B6B' : '#E5E7EB' }}>
                    <Text style={{ color: selectedDate === d ? 'white' : '#374151', fontWeight: '600', fontSize: 13 }}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Flow */}
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12,
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ fontWeight: '700', color: '#374151', marginBottom: 10 }}>🩸 Flow Intensity</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['Light', 'Medium', 'Heavy'].map(f => (
                  <TouchableOpacity key={f} onPress={() => setFlow(f)}
                    style={{ flex: 1, alignItems: 'center', padding: 12, borderRadius: 12,
                      backgroundColor: flow === f ? '#FF6B6B' : '#FFF5F5',
                      borderWidth: 1, borderColor: flow === f ? '#FF6B6B' : '#FFE4E6' }}>
                    <Text style={{ color: flow === f ? 'white' : '#FF6B6B', fontWeight: '700' }}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Pain */}
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12,
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ fontWeight: '700', color: '#374151', marginBottom: 10 }}>😣 Pain Level: {pain}/10</Text>
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <TouchableOpacity key={n} onPress={() => setPain(String(n))}
                    style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
                      backgroundColor: parseInt(pain) === n ? '#FF6B6B' : '#F9FAFB',
                      borderWidth: 1, borderColor: parseInt(pain) === n ? '#FF6B6B' : '#E5E7EB' }}>
                    <Text style={{ color: parseInt(pain) === n ? 'white' : '#374151', fontWeight: '600' }}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Symptoms Multi-Select */}
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12,
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ fontWeight: '700', color: '#374151', marginBottom: 10 }}>💊 Symptoms</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {symptomOptions.map(s => (
                  <TouchableOpacity key={s} onPress={() => toggleSymptom(s)}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99,
                      backgroundColor: symptoms.includes(s) ? '#FF6B6B' : '#F9FAFB',
                      borderWidth: 1, borderColor: symptoms.includes(s) ? '#FF6B6B' : '#E5E7EB' }}>
                    <Text style={{ color: symptoms.includes(s) ? 'white' : '#374151', fontWeight: '600', fontSize: 13 }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Cervical Mucus */}
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12,
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ fontWeight: '700', color: '#374151', marginBottom: 10 }}>💧 Cervical Mucus</Text>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {['Dry', 'Sticky', 'Creamy', 'Egg White'].map(cm => (
                  <TouchableOpacity key={cm} onPress={() => setCervicalMucus(cm)}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99,
                      backgroundColor: cervicalMucus === cm ? '#4ECDC4' : '#F0FDFA',
                      borderWidth: 1, borderColor: cervicalMucus === cm ? '#4ECDC4' : '#CCFBF1' }}>
                    <Text style={{ color: cervicalMucus === cm ? 'white' : '#0F766E', fontWeight: '600', fontSize: 13 }}>{cm}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Clots / Spotting */}
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12,
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => setClots(!clots)} style={{ flex: 1, alignItems: 'center', padding: 12, borderRadius: 12,
                backgroundColor: clots ? '#FF6B6B' : '#FFF5F5', borderWidth: 1, borderColor: clots ? '#FF6B6B' : '#FFE4E6' }}>
                <Text style={{ color: clots ? 'white' : '#FF6B6B', fontWeight: '700' }}>🩸 Clots {clots ? '✓' : ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSpotting(!spotting)} style={{ flex: 1, alignItems: 'center', padding: 12, borderRadius: 12,
                backgroundColor: spotting ? '#FF6B6B' : '#FFF5F5', borderWidth: 1, borderColor: spotting ? '#FF6B6B' : '#FFE4E6' }}>
                <Text style={{ color: spotting ? 'white' : '#FF6B6B', fontWeight: '700' }}>💧 Spotting {spotting ? '✓' : ''}</Text>
              </TouchableOpacity>
            </View>

            {/* BBT */}
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12,
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ fontWeight: '700', color: '#374151', marginBottom: 8 }}>🌡️ Basal Body Temp (BBT)</Text>
              <TextInput style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, backgroundColor: '#F9FAFB' }}
                placeholder="e.g. 98.60" keyboardType="decimal-pad" value={bbt} onChangeText={setBbt} />
            </View>

            {/* Save Button */}
            <TouchableOpacity onPress={handleLog} disabled={logLoading}
              style={{ backgroundColor: '#FF6B6B', padding: 18, borderRadius: 18, alignItems: 'center', marginTop: 8 }}>
              {logLoading ? <ActivityIndicator color="white" /> : (
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 17 }}>💾 Save Period Log</Text>
              )}
            </TouchableOpacity>
          </View>

        ) : (
          /* === HISTORY TAB === */
          <View style={{ padding: 16, paddingBottom: 40 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#1F2937' }}>Cycle History</Text>
              <View style={{ backgroundColor: '#FF6B6B22', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99 }}>
                <Text style={{ color: '#FF6B6B', fontWeight: '700' }}>{totalCycles} cycles</Text>
              </View>
            </View>

            {history.length > 0 ? (
              history.map((item, i) => renderHistoryItem(item, i))
            ) : (
              <View style={{ alignItems: 'center', paddingTop: 48 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>🗓️</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#374151' }}>No cycles logged yet</Text>
                <Text style={{ color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>
                  Log your first period to start building your cycle history and unlock AI predictions!
                </Text>
                <TouchableOpacity onPress={() => setActiveTab('log')}
                  style={{ backgroundColor: '#FF6B6B', padding: 14, borderRadius: 14, marginTop: 20, paddingHorizontal: 24 }}>
                  <Text style={{ color: 'white', fontWeight: '700' }}>Log My First Period</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
