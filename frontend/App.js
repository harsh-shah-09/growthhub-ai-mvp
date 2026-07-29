import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import ChatScreen from './src/screens/ChatScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import RoadmapScreen from './src/screens/RoadmapScreen';
import LoginScreen from './src/screens/LoginScreen'; // <-- Now actively imported
import SettingsScreen from './src/screens/SettingsScreen';


const Tab = createBottomTabNavigator();

export default function App() {
  const [token, setToken] = useState(null);

  // Dynamic Routing: If no token exists, lock the user out and show Login
  if (!token) {
    return <LoginScreen setToken={setToken} />;
  }

  // If the token exists, grant access to the main application
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{
            headerStyle: { backgroundColor: '#007bff' },
            headerTintColor: '#fff',
            tabBarActiveTintColor: '#007bff',
            tabBarInactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen 
            name="AI Counselor" 
            children={() => <ChatScreen token={token} />} 
          />
          <Tab.Screen 
            name="Portfolio" 
            children={() => <PortfolioScreen token={token} />} 
          />
          <Tab.Screen 
            name="Roadmaps" 
            children={() => <RoadmapScreen token={token} />} 
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} 
          />
        ),
        }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}