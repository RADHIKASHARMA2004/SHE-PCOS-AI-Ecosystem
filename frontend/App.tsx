import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';

// Import Screens
import Dashboard from './src/screens/Dashboard';
import CycleTracker from './src/screens/CycleTracker';
import AILab from './src/screens/AILab';
import Nutrition from './src/screens/Nutrition';
import Fitness from './src/screens/Fitness';
import MedicalVault from './src/screens/MedicalVault';
import Mindset from './src/screens/Mindset';
import Education from './src/screens/Education';
import Community from './src/screens/Community';
import Gamification from './src/screens/Gamification';
import Consult from './src/screens/Consult';
import Admin from './src/screens/Admin';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 🎀 SHE Design Tokens
const SHE = {
  rose: '#FF6B9D',
  roseDark: '#E5528A',
  roseLight: '#FFE4EF',
  blush: '#FFF0F5',
  lavender: '#C084FC',
  lavenderLight: '#F3E8FF',
  mint: '#34D399',
  gold: '#FBC74D',
  textDark: '#1F1329',
  textMid: '#6B7280',
  white: '#FFFFFF',
};

const TabIcons: Record<string, string> = {
  Home: '🏠',
  Cycle: '🩸',
  'AI Lab': '✨',
  Medical: '🏥',
  More: '💜',
};

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: SHE.rose,
        tabBarInactiveTintColor: '#C9B8CB',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#FF6B9D',
          shadowOpacity: 0.15,
          shadowRadius: 20,
          height: 68,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: focused ? 24 : 20 }}>{TabIcons[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Cycle" component={CycleTracker} />
      <Tab.Screen name="AI Lab" component={AILab} />
      <Tab.Screen name="Medical" component={MedicalVault} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: SHE.blush },
        headerTintColor: SHE.roseDark,
        headerTitleStyle: { fontWeight: '800', color: SHE.textDark },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="MoreMenu" component={MoreMenuScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Nutrition" component={Nutrition} options={{ title: '🥗 Diet Matrix' }} />
      <Stack.Screen name="Fitness" component={Fitness} />
      <Stack.Screen name="MedicalVault" component={MedicalVault} options={{ title: '🏥 Medical Vault' }} />
      <Stack.Screen name="Mindset" component={Mindset} />
      <Stack.Screen name="Education" component={Education} />
      <Stack.Screen name="Community" component={Community} />
      <Stack.Screen name="Gamification" component={Gamification} options={{ title: '🏆 Challenges' }} />
      <Stack.Screen name="Consult" component={Consult} />
      <Stack.Screen name="Admin" component={Admin} options={{ title: '📊 Developer Analytics' }} />
    </Stack.Navigator>
  );
}

const MORE_ITEMS = [
  { screen: 'Nutrition',    emoji: '🥗', label: 'Diet Matrix',     color: '#DCFCE7' },
  { screen: 'Fitness',      emoji: '🏃‍♀️', label: 'Fitness',        color: '#FEE2E2' },
  { screen: 'MedicalVault', emoji: '🏥', label: 'Medical Vault',   color: '#EDE9FE' },
  { screen: 'Mindset',      emoji: '🧘‍♀️', label: 'Mindset',        color: '#ECFDF5' },
  { screen: 'Education',    emoji: '📚', label: 'Education',       color: '#FEF3C7' },
  { screen: 'Community',    emoji: '💬', label: 'Community',       color: '#FDF2F8' },
  { screen: 'Gamification', emoji: '🏆', label: 'Achievements',    color: '#FFF7ED' },
  { screen: 'Consult',      emoji: '👩‍⚕️', label: 'Consult a Doctor',color: '#F0FDF4' },
  { screen: 'Admin',        emoji: '📊', label: 'Analytics',       color: '#F8FAFC' },
];

function MoreMenuScreen({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SHE.blush }}>
      {/* Decorative header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: SHE.roseDark }}>✨ More</Text>
        <Text style={{ fontSize: 14, color: SHE.textMid, marginTop: 4 }}>Explore everything SHE has to offer 💕</Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 }}>
        {MORE_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.screen}
            onPress={() => navigation.navigate(item.screen)}
            style={{
              width: '46%',
              backgroundColor: item.color,
              borderRadius: 20,
              padding: 20,
              alignItems: 'center',
              shadowColor: '#FF6B9D',
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
              borderWidth: 1,
              borderColor: '#FFF0F5',
            }}
          >
            <Text style={{ fontSize: 36, marginBottom: 8 }}>{item.emoji}</Text>
            <Text style={{ fontSize: 13, fontWeight: '800', color: SHE.textDark, textAlign: 'center' }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

function RootNavigator() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: SHE.blush }}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>🌸</Text>
        <ActivityIndicator size="large" color={SHE.rose} />
        <Text style={{ color: SHE.rose, fontWeight: '700', marginTop: 12 }}>Loading SHE...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="MainTabs" component={BottomTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
