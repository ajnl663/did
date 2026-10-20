import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, typography, radii, shadows } from '../theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const sizes: Record<ButtonSize, { paddingVertical: number; fontSize: number; iconSize: number }> = {
    sm: { paddingVertical: 10, fontSize: typography.sm, iconSize: 16 },
    md: { paddingVertical: 14, fontSize: typography.base, iconSize: 20 },
    lg: { paddingVertical: 16, fontSize: typography.lg, iconSize: 22 },
  };

  const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
    primary: { bg: theme.primary, text: '#fff' },
    secondary: { bg: theme.surfaceMuted, text: theme.text },
    outline: { bg: 'transparent', text: theme.primary, border: theme.border },
    ghost: { bg: 'transparent', text: theme.textSecondary },
    danger: { bg: theme.danger, text: '#fff' },
    success: { bg: theme.success, text: '#fff' },
  };

  const vs = variantStyles[variant];
  const sz = sizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.base,
        { backgroundColor: vs.bg, paddingVertical: sz.paddingVertical, borderRadius: radii.md },
        vs.border && { borderWidth: 1, borderColor: vs.border },
        fullWidth && { width: '100%' },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vs.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <Ionicons name={icon} size={sz.iconSize} color={vs.text} />}
          <Text style={[styles.label, { color: vs.text, fontSize: sz.fontSize }]}>{label}</Text>
          {icon && iconPosition === 'right' && <Ionicons name={icon} size={sz.iconSize} color={vs.text} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: typography.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
});
