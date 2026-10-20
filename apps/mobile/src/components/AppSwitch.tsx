import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, typography, spacing, radii } from '../theme/tokens';

type SwitchSize = 'sm' | 'md';

interface AppSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  style?: ViewStyle;
}

export function AppSwitch({ value, onValueChange, disabled = false, size = 'md', style }: AppSwitchProps) {
  const dims = size === 'sm' ? { trackW: 40, trackH: 22, thumb: 18, pad: 2 } : { trackW: 52, trackH: 28, thumb: 24, pad: 2 };

  return (
    <TouchableOpacity
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.track,
        {
          width: dims.trackW,
          height: dims.trackH,
          borderRadius: radii.full,
          backgroundColor: value ? theme.primary : theme.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.thumb,
          {
            width: dims.thumb,
            height: dims.thumb,
            transform: [{ translateX: value ? dims.trackW - dims.thumb - dims.pad : dims.pad }],
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: '#fff',
    borderRadius: radii.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
