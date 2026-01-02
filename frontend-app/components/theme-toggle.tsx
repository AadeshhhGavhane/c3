import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';

export function ThemeToggle() {
  const { colorScheme, toggleAppearance } = useAppearance();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      onPress={toggleAppearance}
      style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
      activeOpacity={0.7}
    >
      <MaterialIcons
        name={colorScheme === 'dark' ? 'dark-mode' : 'light-mode'}
        size={20}
        color={colors.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

