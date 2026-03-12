import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#FF6B6B' }}>
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Cycle" component={CycleTracker} />
      <Tab.Screen name="AI Lab" component={AILab} />
      <Tab.Screen name="Food" component={Nutrition} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}

// Stack for additional features not on main bottom tab
function MoreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MoreMenu" component={MoreMenuScreen} options={{ title: 'More Features' }} />
      <Stack.Screen name="Fitness" component={Fitness} />
      <Stack.Screen name="MedicalVault" component={MedicalVault} />
      <Stack.Screen name="Mindset" component={Mindset} />
      <Stack.Screen name="Education" component={Education} />
      <Stack.Screen name="Community" component={Community} />
      <Stack.Screen name="Gamification" component={Gamification} />
      <Stack.Screen name="Consult" component={Consult} />
      <Stack.Screen name="Admin" component={Admin} />
    </Stack.Navigator>
  );
}

// Temporary Menu Screen for "More" tab
function MoreMenuScreen({ navigation }: any) {
  const menus = ['Fitness', 'MedicalVault', 'Mindset', 'Education', 'Community', 'Gamification', 'Consult', 'Admin'];
  return (
    <View className="flex-1 bg-white p-4">
      {menus.map((item) => (
        <Text
          key={item}
          className="p-4 my-2 bg-gray-100 rounded-lg text-lg text-center font-bold text-gray-700 shadow-sm"
          onPress={() => navigation.navigate(item)}
        >
          {item}
        </Text>
      ))}
    </View>
  );
}

function RootNavigator() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF6B6B" />
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
