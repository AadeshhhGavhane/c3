import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { colorScheme } = useAppearance();
  const { t } = useTranslation();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const tabs = [
    { nameKey: 'common.today', path: '/(tabs)', icon: 'restaurant-menu' },
    { nameKey: 'common.weeklyMenu', path: '/(tabs)/weekly', icon: 'view-week' },
    { nameKey: 'common.catalog', path: '/(tabs)/catalog', icon: 'apps' },
  ];

  const isActive = (path: string) => {
    if (path === '/(tabs)') {
      return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/' || pathname === '/';
    }
    // Check if pathname matches the tab path or ends with it
    return pathname === path || pathname === path.replace('/(tabs)', '') || pathname?.includes(path.replace('/(tabs)/', ''));
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        return (
          <TouchableOpacity
            key={tab.path}
            onPress={() => router.push(tab.path as any)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={tab.icon as any}
              size={26}
              color={active ? colors.primary : colors.subtext}
            />
            <Text
              style={[
                styles.label,
                {
                  color: active ? colors.primary : colors.subtext,
                  fontWeight: active ? 'bold' : '500',
                },
              ]}
            >
              {t(tab.nameKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 72,
    paddingTop: 8,
    borderTopWidth: 1,
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
  },
});

