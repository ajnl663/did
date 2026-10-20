import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme, typography, spacing, radii } from '../theme/tokens';

interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export function LoadingState({ message = 'Loading…', style }: LoadingStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radii.full,
    backgroundColor: theme.primary,
    opacity: 0.4,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1 },
  message: {
    fontSize: typography.sm,
    color: theme.textSecondary,
  },
});
