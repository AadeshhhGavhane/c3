import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';

export default function TabLayout() {
  const { colorScheme } = useAppearance();
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          display: 'none', // Hide default tab bar since we're using custom BottomNav
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="restaurant-menu" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="weekly"
        options={{
          title: 'Weekly',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="view-week" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="apps" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
