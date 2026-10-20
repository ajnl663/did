import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, typography, spacing, radii, shadows } from '../theme/tokens';

type StatColor = 'primary' | 'success' | 'warning' | 'danger';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color?: StatColor;
  style?: ViewStyle;
}

const colorMap: Record<StatColor, { icon: string; bg: string }> = {
  primary: { icon: theme.primary, bg: theme.primaryBg },
  success: { icon: theme.success, bg: theme.successBg },
  warning: { icon: theme.warning, bg: theme.warningBg },
  danger: { icon: theme.danger, bg: theme.dangerBg },
};

export function StatCard({ icon, label, value, color = 'primary', style }: StatCardProps) {
  const c = colorMap[color];
  return (
    <View style={[styles.card, shadows.sm, style]}>
      <View style={[styles.icon, { backgroundColor: c.bg }]}>
        <Ionicons name={icon} size={20} color={c.icon} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: theme.text,
  },
  label: {
    fontSize: typography.xs,
    color: theme.textSecondary,
    marginTop: 2,
  },
});
