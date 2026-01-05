import { Colors } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Brain, Calendar as CalendarIcon, Dumbbell, QrCode } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.icon,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#333',
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: 'Karakod',
          tabBarIcon: ({ color }) => <QrCode size={24} color={color} />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <CalendarIcon size={24} color={color} />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'Yapay Zeka',
          tabBarIcon: ({ color }) => <Brain size={24} color={color} />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}
