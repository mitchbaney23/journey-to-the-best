import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the header for all tabs
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, // Use your project's theme color
        tabBarInactiveTintColor: '#888', // Inactive icon color (gray)
        tabBarStyle: {
          backgroundColor: '#1a1a1a', // Dark background for the tab bar
          borderTopColor: '#333',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="log-workout"
        options={{
          title: 'Log Workout',
          tabBarIcon: ({ color }) => <FontAwesome5 name="dumbbell" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
// This code defines a tab layout for a React Native app using Expo Router.
// It includes three tabs: Home, Log Workout, and Profile, each with its own icon.
// The tab bar is styled with a dark background and custom colors for active and inactive icons.  