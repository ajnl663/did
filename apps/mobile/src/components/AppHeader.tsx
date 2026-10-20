import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, typography, spacing, radii } from '../theme/tokens';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightColor?: string;
  noSafeAreaTop?: boolean;
  transparent?: boolean;
  style?: ViewStyle;
}

export function AppHeader({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  rightColor = theme.textSecondary,
  noSafeAreaTop = false,
  transparent = false,
  style,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: noSafeAreaTop ? spacing.md : insets.top + spacing.md },
        transparent && { backgroundColor: 'transparent' },
        style,
      ]}
    >
      <View style={styles.row}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconButton} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
        <View style={styles.titles}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.iconButton} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name={rightIcon} size={24} color={rightColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: theme.surface,
    borderBottomColor: theme.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.xs,
  },
  titles: {
    flex: 1,
  },
  title: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: theme.text,
  },
  subtitle: {
    fontSize: typography.sm,
    color: theme.textSecondary,
    marginTop: 2,
  },
});
