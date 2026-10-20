import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, typography, spacing, radii } from '../theme/tokens';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Section({ title, children, style }: SectionProps) {
  return (
    <View style={[styles.container, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

interface RowProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
  style?: ViewStyle;
}

export function Row({
  icon,
  iconColor = theme.primary,
  iconBg = theme.primaryBg,
  title,
  subtitle,
  right,
  onPress,
  showChevron = false,
  danger = false,
  style,
}: RowProps) {
  const text = danger ? theme.danger : theme.text;
  return (
    <View style={[styles.row, onPress && styles.rowPressable, style]}>
      {icon && (
        <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={20} color={danger ? theme.danger : iconColor} />
        </View>
      )}
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: text }]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
      {showChevron && <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: theme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.border,
  },
  rowPressable: {},
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  rowSubtitle: {
    fontSize: typography.sm,
    color: theme.textSecondary,
    marginTop: 1,
  },
});
