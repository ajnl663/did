import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, typography, spacing, radii } from '../theme/tokens';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

interface PinPadProps {
  onKeyPress: (key: string) => void;
  maxLength?: number;
}

export function PinPad({ onKeyPress, maxLength = 6 }: PinPadProps) {
  return (
    <View style={styles.pad}>
      {KEYS.map((key, idx) => {
        if (key === '') return <View key={`empty-${idx}`} style={styles.key} />;
        const isBack = key === 'back';
        return (
          <TouchableOpacity
            key={key}
            style={styles.key}
            onPress={() => onKeyPress(isBack ? 'back' : key)}
            activeOpacity={0.6}
          >
            {isBack ? (
              <Ionicons name="backspace-outline" size={26} color={theme.text} />
            ) : (
              <Text style={styles.keyText}>{key}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

interface PinDotsProps {
  length: number;
  max: number;
  error?: boolean;
}

export function PinDots({ length, max, error = false }: PinDotsProps) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: max }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i < length && styles.dotFilled, error && styles.dotError]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: theme.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 28,
    fontWeight: typography.medium,
    color: theme.text,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: theme.border,
  },
  dotFilled: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  dotError: {
    borderColor: theme.danger,
    backgroundColor: theme.danger,
  },
});
