import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login, signup } = useAuth();
  
  // App Mode State
  const [isLoginFlow, setIsLoginFlow] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Core Form State (Step 1)
  const [username, setUsername] = useState('user1');
  const [password, setPassword] = useState('password123');
  const [email, setEmail] = useState('');
  
  // Step 1: Baseline
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [country, setCountry] = useState('');

  // Step 2 & 3: Pregnancy & Mode
  const [pregnancyMode, setPregnancyMode] = useState(false);
  const [intent, setIntent] = useState('Track Period');

  // Step 4: Menstrual Baseline
  const [regularity, setRegularity] = useState('Unknown');
  
  // Step 5: (Implicitly gathered in CycleTracker, skipping date logging in Auth to prevent crash)

  // Step 6: Birth Control
  const [birthControl, setBirthControl] = useState('None');
  
  // Step 7: Health Conditions (Multiple)
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const toggleCondition = (c: string) => setHealthConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  // Step 8: Hormonal Impact
  const [hormonalImpacts, setHormonalImpacts] = useState<string[]>([]);
  const toggleImpact = (i: string) => setHormonalImpacts(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  // Step 9: Mental Health / PMS
  const [mentalHealth, setMentalHealth] = useState<string[]>([]);
  const toggleMental = (m: string) => setMentalHealth(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  // Step 10: Sexual Activity
  const [sexualActivity, setSexualActivity] = useState('Unknown');

  // Step 11: Sleep & Activity
  const [sleepHours, setSleepHours] = useState('7');
  const [activityLevel, setActivityLevel] = useState('Sedentary');

  const handleAuth = async () => {
    setLoading(true);
    if (isLoginFlow) {
      const success = await login(username, password);
      if (!success) {
         Alert.alert('Login Failed', 'Check your username and password.');
         setLoading(false);
      }
    } else {
      const payload = {
         username, password, email,
         age: parseInt(age) || 25,
         height: parseFloat(height) || 160,
         weight: parseFloat(weight) || 60,
         country, intent,
         cycle_regularity: regularity,
         pregnancy_mode: pregnancyMode,
         birth_control: birthControl,
         health_conditions: healthConditions,
         symptom_baseline: mentalHealth,
         sexual_activity: sexualActivity,
         sleep_hours: parseFloat(sleepHours) || 7.0,
         activity_level: activityLevel,
         lifestyle_habits: hormonalImpacts
      };
      
      try {
         const success = await signup(payload);
         if (!success) Alert.alert('Signup Failed', 'Could not complete registration.');
      } catch (err: any) {
         Alert.alert('Signup Failed', err.message);
      }
    }
    setLoading(false);
  };

  const renderStepIndicators = () => (
     <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
        <View className="flex-row space-x-2 px-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(s => (
            <View key={s} className={`h-2 w-4 rounded-full ${step >= s ? 'bg-[#FF6B6B]' : 'bg-gray-200'}`} />
            ))}
        </View>
     </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 pt-10">
        <Text className="text-4xl font-bold text-[#FF6B6B] mb-2">SHE</Text>
        <Text className="text-gray-500 mb-8">
           {isLoginFlow ? 'Your personalized PCOS Ecosystem' : 'Let\'s build your AI Health Profile'}
        </Text>
        
        {!isLoginFlow && renderStepIndicators()}

        {isLoginFlow ? (
          <View className="w-full">
            <Text className="font-bold text-gray-700 mb-2">Username</Text>
            <TextInput className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50" value={username} onChangeText={setUsername} autoCapitalize="none" />
            
            <Text className="font-bold text-gray-700 mb-2">Password</Text>
            <TextInput className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50" value={password} onChangeText={setPassword} secureTextEntry />

            <TouchableOpacity className="bg-[#4ECDC4] p-4 rounded-xl items-center shadow-sm mb-4" onPress={handleAuth} disabled={loading}>
              <Text className="text-white font-bold text-lg">{loading ? 'Logging in...' : 'Sign In'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setIsLoginFlow(false)} className="items-center">
               <Text className="text-gray-500 font-semibold">New to SHE? <Text className="text-[#FF6B6B]">Create an Account</Text></Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="w-full pb-20">
             {step === 1 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 1: Account Setup</Text>
                   <TextInput className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50" placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
                   <TextInput className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50" placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
                   <TextInput className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                   <TouchableOpacity className="bg-[#FF6B6B] p-4 rounded-xl items-center" onPress={() => setStep(2)}><Text className="text-white font-bold text-lg">Next Step →</Text></TouchableOpacity>
                </View>
             )}
             
             {step === 2 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 2: Physical Baseline</Text>
                   <Text className="text-sm text-gray-500 mb-4">Age affects hormonal balance and ovulation regularity.</Text>
                   <TextInput className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50" placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
                   <TextInput className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50" placeholder="Height (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
                   <TextInput className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50" placeholder="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
                   <TextInput className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50" placeholder="Country / Timezone" value={country} onChangeText={setCountry} />
                   <View className="flex-row space-x-4">
                      <TouchableOpacity className="bg-gray-200 p-4 rounded-xl items-center flex-1" onPress={() => setStep(1)}><Text className="text-gray-700 font-bold">← Back</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#FF6B6B] p-4 rounded-xl items-center flex-1" onPress={() => setStep(3)}><Text className="text-white font-bold">Next Step →</Text></TouchableOpacity>
                   </View>
                </View>
             )}

             {step === 3 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 3: Pregnancy Status</Text>
                   <Text className="text-sm text-gray-500 mb-4">Are you currently pregnant?</Text>
                   {[
                       { label: 'Yes, I am pregnant', val: true },
                       { label: 'No, but I want to get pregnant', val: false },
                       { label: 'No, I want to understand my body', val: false }
                   ].map(opt => (
                      <TouchableOpacity key={opt.label} onPress={() => setPregnancyMode(opt.val)} className={`p-4 rounded-xl mb-3 border ${pregnancyMode === opt.val ? 'bg-[#FF6B6B] border-[#FF6B6B]' : 'bg-white border-gray-300'}`}>
                         <Text className={pregnancyMode === opt.val ? 'text-white font-bold' : 'text-gray-700'}>{opt.label}</Text>
                      </TouchableOpacity>
                   ))}
                   <View className="flex-row space-x-4 mt-4">
                      <TouchableOpacity className="bg-gray-200 p-4 rounded-xl items-center flex-1" onPress={() => setStep(2)}><Text className="text-gray-700 font-bold">← Back</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#FF6B6B] p-4 rounded-xl items-center flex-1" onPress={() => setStep(4)}><Text className="text-white font-bold">Next Step →</Text></TouchableOpacity>
                   </View>
                </View>
             )}

             {step === 4 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 4: What's your main goal?</Text>
                   <Text className="text-sm text-gray-500 mb-4">This tells our AI what to prioritize.</Text>
                   {['Track Period', 'Detect PCOS / PCOD', 'Understand Hormones', 'Improve Fertility'].map(opt => (
                      <TouchableOpacity key={opt} onPress={() => setIntent(opt)} className={`p-4 rounded-xl mb-3 border ${intent === opt ? 'bg-[#FF6B6B] border-[#FF6B6B]' : 'bg-white border-gray-300'}`}>
                         <Text className={intent === opt ? 'text-white font-bold' : 'text-gray-700'}>{opt}</Text>
                      </TouchableOpacity>
                   ))}
                   <View className="flex-row space-x-4 mt-4">
                      <TouchableOpacity className="bg-gray-200 p-4 rounded-xl items-center flex-1" onPress={() => setStep(3)}><Text className="text-gray-700 font-bold">← Back</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#FF6B6B] p-4 rounded-xl items-center flex-1" onPress={() => setStep(5)}><Text className="text-white font-bold">Next Step →</Text></TouchableOpacity>
                   </View>
                </View>
             )}

             {step === 5 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 5: Menstrual Baseline</Text>
                   <Text className="text-sm text-gray-500 mb-4">Are your periods usually regular? (Every 21-35 days)</Text>
                   {['Yes', 'No', 'Unknown'].map(opt => (
                      <TouchableOpacity key={opt} onPress={() => setRegularity(opt)} className={`p-4 rounded-xl mb-3 border ${regularity === opt ? 'bg-[#FF6B6B] border-[#FF6B6B]' : 'bg-white border-gray-300'}`}>
                         <Text className={regularity === opt ? 'text-white font-bold' : 'text-gray-700'}>{opt}</Text>
                      </TouchableOpacity>
                   ))}
                   <View className="flex-row space-x-4 mt-6">
                      <TouchableOpacity className="bg-gray-200 p-4 rounded-xl items-center flex-1" onPress={() => setStep(4)}><Text className="text-gray-700 font-bold">← Back</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#FF6B6B] p-4 rounded-xl items-center flex-1" onPress={() => setStep(6)}><Text className="text-white font-bold">Next Step →</Text></TouchableOpacity>
                   </View>
                </View>
             )}
             
             {step === 6 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 6: Birth Control</Text>
                   <Text className="text-sm text-gray-500 mb-4">Are you using any birth control?</Text>
                   {['None', 'Pills', 'IUD', 'Implant', 'Injection', 'Emergency'].map(opt => (
                      <TouchableOpacity key={opt} onPress={() => setBirthControl(opt)} className={`p-4 rounded-xl mb-3 border ${birthControl === opt ? 'bg-[#FF6B6B] border-[#FF6B6B]' : 'bg-white border-gray-300'}`}>
                         <Text className={birthControl === opt ? 'text-white font-bold' : 'text-gray-700'}>{opt}</Text>
                      </TouchableOpacity>
                   ))}
                   <View className="flex-row space-x-4 mt-6">
                      <TouchableOpacity className="bg-gray-200 p-4 rounded-xl items-center flex-1" onPress={() => setStep(5)}><Text className="text-gray-700 font-bold">← Back</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#FF6B6B] p-4 rounded-xl items-center flex-1" onPress={() => setStep(7)}><Text className="text-white font-bold">Next Step →</Text></TouchableOpacity>
                   </View>
                </View>
             )}

             {step === 7 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 7: Health Conditions</Text>
                   <Text className="text-sm text-gray-500 mb-4">Do you have any of the following? (Select all that apply)</Text>
                   {['PCOS', 'PCOD', 'Endometriosis', 'Fibroids', 'Thyroid', 'UTI', 'Yeast Infection', 'Bacterial Vaginosis'].map(opt => (
                      <TouchableOpacity key={opt} onPress={() => toggleCondition(opt)} className={`p-4 rounded-xl mb-3 border ${healthConditions.includes(opt) ? 'bg-[#FF6B6B] border-[#FF6B6B]' : 'bg-white border-gray-300'}`}>
                         <Text className={healthConditions.includes(opt) ? 'text-white font-bold' : 'text-gray-700'}>{opt}</Text>
                      </TouchableOpacity>
                   ))}
                   <View className="flex-row space-x-4 mt-6">
                      <TouchableOpacity className="bg-gray-200 p-4 rounded-xl items-center flex-1" onPress={() => setStep(6)}><Text className="text-gray-700 font-bold">← Back</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#FF6B6B] p-4 rounded-xl items-center flex-1" onPress={() => setStep(8)}><Text className="text-white font-bold">Next Step →</Text></TouchableOpacity>
                   </View>
                </View>
             )}

             {step === 8 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 8: Hormonal Impact</Text>
                   <Text className="text-sm text-gray-500 mb-4">Does your cycle affect any of the following? (Select all that apply)</Text>
                   {['Sleep', 'Skin', 'Diet', 'Energy', 'Activity', 'Mental Health'].map(opt => (
                      <TouchableOpacity key={opt} onPress={() => toggleImpact(opt)} className={`p-4 rounded-xl mb-3 border ${hormonalImpacts.includes(opt) ? 'bg-[#FF6B6B] border-[#FF6B6B]' : 'bg-white border-gray-300'}`}>
                         <Text className={hormonalImpacts.includes(opt) ? 'text-white font-bold' : 'text-gray-700'}>{opt}</Text>
                      </TouchableOpacity>
                   ))}
                   <View className="flex-row space-x-4 mt-6">
                      <TouchableOpacity className="bg-gray-200 p-4 rounded-xl items-center flex-1" onPress={() => setStep(7)}><Text className="text-gray-700 font-bold">← Back</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#FF6B6B] p-4 rounded-xl items-center flex-1" onPress={() => setStep(9)}><Text className="text-white font-bold">Next Step →</Text></TouchableOpacity>
                   </View>
                </View>
             )}

             {step === 9 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 9: Mental Health</Text>
                   <Text className="text-sm text-gray-500 mb-4">Do you regularly experience: (Select all that apply)</Text>
                   {['Mood Swings', 'Anxiety', 'Irritability', 'Fatigue', 'Sadness'].map(opt => (
                      <TouchableOpacity key={opt} onPress={() => toggleMental(opt)} className={`p-4 rounded-xl mb-3 border ${mentalHealth.includes(opt) ? 'bg-[#FF6B6B] border-[#FF6B6B]' : 'bg-white border-gray-300'}`}>
                         <Text className={mentalHealth.includes(opt) ? 'text-white font-bold' : 'text-gray-700'}>{opt}</Text>
                      </TouchableOpacity>
                   ))}
                   <View className="flex-row space-x-4 mt-6">
                      <TouchableOpacity className="bg-gray-200 p-4 rounded-xl items-center flex-1" onPress={() => setStep(8)}><Text className="text-gray-700 font-bold">← Back</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#FF6B6B] p-4 rounded-xl items-center flex-1" onPress={() => setStep(10)}><Text className="text-white font-bold">Next Step →</Text></TouchableOpacity>
                   </View>
                </View>
             )}

             {step === 10 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 10: Sexual Activity</Text>
                   <Text className="text-sm text-gray-500 mb-4">Are you sexually active? (Affects fertility AI)</Text>
                   {['Yes', 'No', 'Prefer not to say'].map(opt => (
                      <TouchableOpacity key={opt} onPress={() => setSexualActivity(opt)} className={`p-4 rounded-xl mb-3 border ${sexualActivity === opt ? 'bg-[#FF6B6B] border-[#FF6B6B]' : 'bg-white border-gray-300'}`}>
                         <Text className={sexualActivity === opt ? 'text-white font-bold' : 'text-gray-700'}>{opt}</Text>
                      </TouchableOpacity>
                   ))}
                   <View className="flex-row space-x-4 mt-6">
                      <TouchableOpacity className="bg-gray-200 p-4 rounded-xl items-center flex-1" onPress={() => setStep(9)}><Text className="text-gray-700 font-bold">← Back</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#FF6B6B] p-4 rounded-xl items-center flex-1" onPress={() => setStep(11)}><Text className="text-white font-bold">Next Step →</Text></TouchableOpacity>
                   </View>
                </View>
             )}

             {step === 11 && (
                <View>
                   <Text className="text-xl font-bold mb-4">Step 11: Sleep & Activity</Text>
                   <Text className="text-sm text-gray-500 mb-4">Avg. Sleep Hours per night</Text>
                   <TextInput className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50" placeholder="7" keyboardType="numeric" value={sleepHours} onChangeText={setSleepHours} />
                   
                   <Text className="text-sm text-gray-500 mb-4">Physical Activity Level</Text>
                   {['Sedentary', 'Moderate activity', 'High activity'].map(opt => (
                      <TouchableOpacity key={opt} onPress={() => setActivityLevel(opt)} className={`p-4 rounded-xl mb-3 border ${activityLevel === opt ? 'bg-[#4ECDC4] border-[#4ECDC4]' : 'bg-white border-gray-300'}`}>
                         <Text className={activityLevel === opt ? 'text-white font-bold' : 'text-gray-700'}>{opt}</Text>
                      </TouchableOpacity>
                   ))}

                   <View className="flex-row space-x-4 mt-6">
                      <TouchableOpacity className="bg-gray-200 p-4 rounded-xl items-center flex-1" onPress={() => setStep(10)}><Text className="text-gray-700 font-bold">← Back</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#4ECDC4] p-4 rounded-xl items-center flex-1" onPress={handleAuth} disabled={loading}>
                         <Text className="text-white font-bold">{loading ? 'Saving Profile...' : 'Initialize AI →'}</Text>
                      </TouchableOpacity>
                   </View>
                </View>
             )}
             
             <TouchableOpacity onPress={() => setIsLoginFlow(true)} className="items-center mt-6 mb-10">
               <Text className="text-gray-500 font-semibold">Already have an account? <Text className="text-[#FF6B6B]">Sign In</Text></Text>
             </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
