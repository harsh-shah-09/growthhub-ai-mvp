 import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screen imports
import SettingsScreen from './src/screens/SettingsScreen';
import RoadmapScreen from './src/screens/RoadmapScreen';
import LoginScreen from './src/screens/LoginScreen';

// Context & UI components
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoadingOverlay from './src/components/LoadingOverlay';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  const { isDarkMode } = useTheme();
  const { userToken, isLoading } = useAuth();

  // Show a loading screen while SecureStore checks for an existing saved session
  if (isLoading) {
    return <LoadingOverlay message="Loading GrowthHub..." />;
  }

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      {userToken === null ? (
        // Render Login Flow when unauthenticated
        <LoginScreen />
      ) : (
        // Render Main App Tabs when authenticated
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Roadmaps') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: isDarkMode ? '#66b3ff' : '#0056b3',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
              borderTopColor: isDarkMode ? '#333333' : '#eeeeee',
            },
            headerStyle: {
              backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            },
            headerTintColor: isDarkMode ? '#ffffff' : '#000000',
          })}
        >
          <Tab.Screen name="Roadmaps" component={RoadmapScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}