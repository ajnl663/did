import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCredentialEngine } from '../../context/CredentialEngineContext';
import { PinPad, PinDots } from '../../components/PinPad';
import { theme, typography, spacing, radii } from '../../theme/tokens';

const MAX_PIN = 6;

export default function PinScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm' | 'verify'>('create');
  const [walletChecked, setWalletChecked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const checkWallet = async () => {
      const wallet = await engine.getWallet();
      if (!mounted.current) return;
      if (wallet.pinSet) setStep('verify');
      setWalletChecked(true);
    };
    checkWallet();
    return () => { mounted.current = false; };
  }, [engine]);

  const handleKey = (key: string) => {
    setError(false);
    const current = step === 'confirm' ? confirmPin : pin;
    let next = current;
    if (key === 'back') {
      next = current.slice(0, -1);
    } else if (key && current.length < MAX_PIN) {
      next = current + key;
    }
    if (step === 'create') setPin(next);
    else if (step === 'confirm') setConfirmPin(next);
    else setPin(next);

    // Auto-advance when reaching 4+ digits
    if (key !== 'back' && next.length >= 4) {
      if (step === 'create') {
        setTimeout(() => { if (mounted.current) setStep('confirm'); }, 200);
      } else if (step === 'confirm') {
        setTimeout(() => handleConfirm(next), 200);
      } else if (step === 'verify') {
        setTimeout(() => handleVerify(next), 200);
      }
    }
  };

  const handleConfirm = async (entered: string) => {
    if (pin !== entered) {
      setError(true);
      Alert.alert('PINs do not match', 'Please try again.');
      setConfirmPin('');
      setTimeout(() => { if (mounted.current) setStep('create'); }, 100);
      return;
    }
    await engine.setPin(pin);
    setShowSuccess(true);
    setTimeout(() => {
      if (!mounted.current) return;
      setShowSuccess(false);
      router.replace('/(tabs)/wallet');
    }, 1200);
  };

  const handleVerify = async (entered: string) => {
    const valid = await engine.verifyPin(entered);
    if (valid) {
      router.replace('/(tabs)/wallet');
    } else {
      setError(true);
      Alert.alert('Invalid PIN', 'Please try again.');
      setPin('');
    }
  };

  if (!walletChecked) return <SafeAreaView style={styles.container} />;

  const dotLen = step === 'confirm' ? confirmPin.length : pin.length;

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={showSuccess} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={36} color={theme.success} />
            </View>
            <Text style={styles.successTitle}>PIN Set!</Text>
            <Text style={styles.successText}>Your wallet is now secured.</Text>
          </View>
        </View>
      </Modal>

      <View style={[styles.content, { paddingTop: insets.top + spacing['2xl'] }]}>
        <View style={styles.iconWrap}>
          <Ionicons name={step === 'verify' ? 'lock-closed' : 'lock-open'} size={40} color={theme.primary} />
        </View>
        <Text style={styles.title}>
          {step === 'create' ? 'Create PIN' : step === 'confirm' ? 'Confirm PIN' : 'Enter PIN'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'create'
            ? 'Enter a 4–6 digit PIN to secure your wallet'
            : step === 'confirm'
            ? 'Re-enter your PIN to confirm'
            : 'Enter your PIN to unlock your wallet'}
        </Text>

        <View style={styles.dotsWrap}>
          <PinDots length={dotLen} max={MAX_PIN} error={error} />
        </View>

        <PinPad onKeyPress={handleKey} maxLength={MAX_PIN} />

        {step === 'create' && (
          <Text style={styles.hint}>Tap Continue once you have 4 or more digits</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radii['2xl'],
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: theme.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.base,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  dotsWrap: {
    alignItems: 'center',
    marginVertical: spacing['2xl'],
  },
  hint: {
    fontSize: typography.sm,
    color: theme.textTertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  successCard: {
    backgroundColor: theme.surface,
    borderRadius: radii['2xl'],
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: theme.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: theme.text,
  },
  successText: {
    fontSize: typography.sm,
    color: theme.textSecondary,
    marginTop: spacing.xs,
  },
});
