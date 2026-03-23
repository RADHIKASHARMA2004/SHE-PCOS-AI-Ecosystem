import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../api/client';

export default function Nutrition() {
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState<any>(null);
  const [todayLogs, setTodayLogs] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeMealType, setActiveMealType] = useState('Snack');
  
  // Custom Recipe AI state
  const [customRecipe, setCustomRecipe] = useState('');
  const [manualCal, setManualCal] = useState('');
  const [manualPro, setManualPro] = useState('');
  const [manualCarb, setManualCarb] = useState('');
  const [manualFat, setManualFat] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  // 10-Day Generative AI Planner
  const [showPlans, setShowPlans] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [generatingPlans, setGeneratingPlans] = useState(false);

  const handleGeneratePlans = async () => {
    setShowPlans(true);
    setGeneratingPlans(true);
    try {
      const res = await apiClient.get('/diet/plans/generate');
      setPlans(res.data);
    } catch(e) {
      Alert.alert('Error', 'Failed to generate constraints-based plans.');
      setShowPlans(false);
    } finally {
      setGeneratingPlans(false);
    }
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [targetsRes, logsRes, recRes] = await Promise.all([
        apiClient.get('/diet/targets'),
        apiClient.get('/diet/logs/today'),
        apiClient.get(`/diet/recommend/${activeMealType}`)
      ]);
      setTargets(targetsRes.data);
      setTodayLogs(logsRes.data);
      setRecommendations(recRes.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to fetch dietary data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeMealType]);

  const handleLogMeal = async (foodId: number) => {
    try {
      await apiClient.post('/diet/log', {
        food_item_id: foodId,
        meal_type: activeMealType,
        portion_size_grams: 100
      });
      fetchData(); // Refresh progress
    } catch (e) {
      Alert.alert('Error', 'Could not log meal');
    }
  };

  const handleAnalyzeRecipe = async () => {
    if (!customRecipe.trim()) return;
    setAnalyzing(true);
    try {
      const res = await apiClient.post('/diet/recipe/analyze', { 
          ingredients: customRecipe,
          manual_calories: manualCal ? parseFloat(manualCal) : null,
          manual_protein: manualPro ? parseFloat(manualPro) : null,
          manual_carbs: manualCarb ? parseFloat(manualCarb) : null,
          manual_fats: manualFat ? parseFloat(manualFat) : null
      });
      if (res.data.status === 'success') {
        const item = res.data.food_item;
        Alert.alert('Recipe Analyzed & Logged!', `Estimated: ${item.calories_per_100g} kcal | ${item.protein}g Protein.\nIt has been automatically logged.`);
        await handleLogMeal(item.id);
        setCustomRecipe('');
        setManualCal('');
        setManualPro('');
        setManualCarb('');
        setManualFat('');
      }
    } catch (e) {
      Alert.alert('Error', 'AI failed to analyze recipe. Try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading && !targets) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF6B9D" />
      </View>
    );
  }

  const calPercent = targets ? Math.min((todayLogs?.consumed_calories || 0) / targets.target_calories, 1) * 100 : 0;
  const proPercent = targets ? Math.min((todayLogs?.consumed_protein || 0) / targets.target_protein, 1) * 100 : 0;

  // Real-time Conditional Feedback Logic
  const currentHour = new Date().getHours();
  const isLate = currentHour >= 18; // 6 PM
  const underEating = targets && (todayLogs?.consumed_calories || 0) < targets.target_calories * 0.5 && isLate;
  const overEating = targets && (todayLogs?.consumed_calories || 0) > targets.target_calories * 1.1;
  const lowProtein = targets && (todayLogs?.consumed_protein || 0) < targets.target_protein * 0.7 && isLate;

  return (
    <SafeAreaView className="flex-1 bg-[#FFF0F5]">
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-black text-[#1F1329]">Diet Matrix</Text>
          <TouchableOpacity onPress={handleGeneratePlans} className="bg-[#1F1329] px-4 py-2 rounded-full">
            <Text className="text-white font-bold">✨ 10-Day Plan</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showPlans} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPlans(false)}>
          <SafeAreaView className="flex-1 bg-white p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-black text-[#1F1329]">Your 10-Day Protocol</Text>
              <TouchableOpacity onPress={() => setShowPlans(false)}>
                <Text className="text-[#C084FC] font-bold md text-lg">Close</Text>
              </TouchableOpacity>
            </View>
            {generatingPlans ? (
              <View className="flex-1 justify-center items-center">
                 <ActivityIndicator size="large" color="#FF6B9D" />
                 <Text className="text-gray-500 mt-4 text-center font-semibold">Our AI is mapping meals to your avoidances, biology, and goals...</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {plans.map((dayPlan, i) => (
                  <View key={i} className="bg-[#FFF0F5] p-4 rounded-3xl mb-4 border border-[#FFE4EF]">
                    <Text className="text-lg font-black text-[#1F1329] mb-3 border-b border-[#FFE4EF] pb-2">Day {dayPlan.day} • {dayPlan.total_calories} kcal • {dayPlan.total_protein}g Pro</Text>
                    {dayPlan.meals.map((m: any, j: number) => (
                      <View key={j} className="mb-3">
                        <Text className="font-bold text-[#FF6B9D] text-xs uppercase">{m.type}</Text>
                        <Text className="font-bold text-[#1F1329]">{m.name} <Text className="font-normal text-gray-500">({m.calories}kcal, {m.protein}g P)</Text></Text>
                        <Text className="text-xs text-[#6B7280] italic">{m.reason}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            )}
          </SafeAreaView>
        </Modal>

        {/* 1. Daily Progress Section */}
        <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-[#FFE4EF]">
          <Text className="text-[#6B7280] font-bold tracking-widest text-xs uppercase mb-4">Today's Macros</Text>
          
          <View className="flex-row justify-between mb-5">
            <View>
              <Text className="text-2xl font-black text-[#1F1329]">{Math.round(todayLogs?.consumed_calories || 0)} <Text className="text-sm font-semibold text-[#6B7280]">/ {Math.round(targets?.target_calories || 2000)} kcal</Text></Text>
              <View className="h-2 w-32 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <View className="h-full bg-[#FF6B9D] rounded-full" style={{ width: `${calPercent}%` }} />
              </View>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-black text-[#1F1329]">{Math.round(todayLogs?.consumed_protein || 0)}g <Text className="text-sm font-semibold text-[#6B7280]">/ {Math.round(targets?.target_protein || 80)}g PRO</Text></Text>
              <View className="h-2 w-24 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <View className="h-full bg-[#C084FC] rounded-full" style={{ width: `${proPercent}%` }} />
              </View>
            </View>
          </View>

          {/* AI Intelligence Conditional Alerts */}
          {underEating && (
            <View className="bg-[#FEF2F2] p-3 rounded-xl border border-[#FECACA] flex-row items-center mt-2">
              <Text className="text-lg mr-2">📉</Text>
              <Text className="text-[#DC2626] font-semibold flex-1 text-xs">Undereating alert: Skipping meals can slow down metabolism and disrupt hormones. Nourish your body!</Text>
            </View>
          )}
          {overEating && (
            <View className="bg-[#FFFBEB] p-3 rounded-xl border border-[#FDE68A] flex-row items-center mt-2">
              <Text className="text-lg mr-2">📈</Text>
              <Text className="text-[#D97706] font-semibold flex-1 text-xs">Calorie surplus detected. Overeating consistently may hinder your hormone balance and fat loss progress.</Text>
            </View>
          )}
          {lowProtein && (
            <View className="bg-[#F0FDF4] p-3 rounded-xl border border-[#DCFCE7] flex-row items-center mt-2">
              <Text className="text-lg mr-2">🥩</Text>
              <Text className="text-[#166534] font-semibold flex-1 text-xs">Protein is very low today! Check the recommendations below for high-protein options to stabilize blood sugar.</Text>
            </View>
          )}
        </View>

        {/* 2. Today's Logs */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#1F1329] mb-3">Logged Meals</Text>
          {todayLogs?.logs?.length === 0 ? (
            <Text className="text-[#6B7280] italic">No meals logged today yet.</Text>
          ) : (
            todayLogs?.logs?.map((log: any, idx: number) => (
              <View key={idx} className="bg-white px-4 py-3 rounded-2xl mb-2 flex-row justify-between items-center shadow-sm border border-[#F3E8FF]">
                <View>
                  <Text className="font-bold text-[#1F1329]">{log.food_name}</Text>
                  <Text className="text-xs text-[#C084FC] font-semibold">{log.meal_type} • {log.portion}g</Text>
                </View>
                <Text className="font-bold text-[#6B7280]">{Math.round(log.calories)} kcal</Text>
              </View>
            ))
          )}
        </View>

        {/* Custom Recipe AI Logger */}
        <View className="mb-8 bg-[#F3E8FF] rounded-3xl p-5 border border-[#E9D5FF]">
          <Text className="text-xl font-bold text-[#1F1329] mb-2">Log Custom Recipe 👩‍🍳</Text>
          <Text className="text-[#6B7280] text-xs mb-3">Paste ingredients. Our AI will estimate macros, or provide exact numbers below:</Text>
          <View className="flex-row mb-3">
            <TextInput 
              placeholder="e.g. 2 eggs, 50g paneer, 1tsp ghee"
              className="flex-1 bg-white border border-[#D8B4FE] rounded-xl p-3 text-[#1F1329]"
              value={customRecipe}
              onChangeText={setCustomRecipe}
            />
          </View>
          
          <Text className="text-[#6B7280] text-xs mb-2 font-bold uppercase tracking-widest">Optional Nutritional Overlay</Text>
          <View className="flex-row justify-between mb-3">
            <TextInput placeholder="Kcal" value={manualCal} onChangeText={setManualCal} keyboardType="numeric" className="bg-white border border-[#D8B4FE] rounded-xl p-2 w-[22%] text-center text-xs" />
            <TextInput placeholder="Pro (g)" value={manualPro} onChangeText={setManualPro} keyboardType="numeric" className="bg-white border border-[#D8B4FE] rounded-xl p-2 w-[22%] text-center text-xs" />
            <TextInput placeholder="Carb (g)" value={manualCarb} onChangeText={setManualCarb} keyboardType="numeric" className="bg-white border border-[#D8B4FE] rounded-xl p-2 w-[22%] text-center text-xs" />
            <TextInput placeholder="Fat (g)" value={manualFat} onChangeText={setManualFat} keyboardType="numeric" className="bg-white border border-[#D8B4FE] rounded-xl p-2 w-[22%] text-center text-xs" />
          </View>

          <TouchableOpacity 
            onPress={handleAnalyzeRecipe}
            disabled={analyzing}
            className={`mt-3 py-3 rounded-xl items-center ${analyzing ? 'bg-gray-400' : 'bg-[#C084FC]'}`}
          >
            {analyzing ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Analyze & Log Recipe</Text>}
          </TouchableOpacity>
        </View>

        {/* 3. Smart Recommendations */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-[#1F1329] mb-3">Smart Suggestions</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {mealTypes.map(m => (
              <TouchableOpacity
                key={m}
                onPress={() => setActiveMealType(m)}
                className={`px-5 py-2 rounded-full mr-2 ${activeMealType === m ? 'bg-[#FF6B9D]' : 'bg-white border border-[#FFE4EF]'}`}
              >
                <Text className={`font-bold ${activeMealType === m ? 'text-white' : 'text-[#FF6B9D]'}`}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {recommendations.length === 0 ? (
            <Text className="text-gray-500">No specific recommendations found.</Text>
          ) : (
            recommendations.map((rec, idx) => (
              <View key={idx} className="bg-white rounded-3xl p-4 mb-3 shadow-sm border border-[#FFE4EF]">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 pr-2">
                    <Text className="text-[17px] font-black text-[#1F1329] mb-1">{rec.food.name}</Text>
                    <Text className="text-[#6B7280] font-semibold text-xs">{rec.food.calories_per_100g} kcal • {rec.food.protein}g P • {rec.food.carbs}g C</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleLogMeal(rec.food.id)}
                    className="bg-[#C084FC] px-4 py-2 rounded-full"
                  >
                    <Text className="text-white font-bold text-xs">+ Log</Text>
                  </TouchableOpacity>
                </View>
                
                <View className="bg-[#F0FDF4] p-3 rounded-xl mt-2 border border-[#DCFCE7] flex-row items-center">
                  <Text className="mr-2">💡</Text>
                  <Text className="text-[#166534] font-medium text-xs flex-1">{rec.reason} {rec.food.tags?.includes('pcos_friendly') ? 'Great for PCOS!' : ''}</Text>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
