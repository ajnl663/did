import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCredentialEngine } from '../../context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#171717', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#737373', textAlign: 'center', marginTop: 8, lineHeight: 24 },
  pinContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 32 },
  pinDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#e5e5e5' },
  pinDotFilled: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  key: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  keyText: { fontSize: 28, fontWeight: '600', color: '#171717' },
  keyAction: { backgroundColor: '#fef2f2' },
  keyActionText: { color: '#ef4444' },
  biometricButton: { marginTop: 24, paddingVertical: 16, alignItems: 'center' },
  biometricText: { color: '#0ea5e9', fontSize: 16, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center' },
  modalIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#171717', marginBottom: 8 },
  modalText: { fontSize: 16, color: '#737373', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  modalButton: { backgroundColor: '#0ea5e9', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

const keys = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '', '0', '⌫',
];

export default function PinScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm' | 'verify'>('create');
  const [walletReady, setWalletReady] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      const wallet = await engine.getWallet();
      if (wallet.pinSet) {
        setStep('verify');
      }
    };
    checkWallet();
  }, [engine]);

  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      if (step === 'create') setPin(pin.slice(0, -1));
      else if (step === 'confirm') setConfirmPin(confirmPin.slice(0, -1));
    } else if (key && (step === 'create' ? pin.length < 6 : confirmPin.length < 6)) {
      if (step === 'create') setPin(pin + key);
      else if (step === 'confirm') setConfirmPin(confirmPin + key);
    }

    // Auto-advance
    if (step === 'create' && pin.length >= 4) {
      setTimeout(() => setStep('confirm'), 300);
    } else if (step === 'confirm' && confirmPin.length >= 4) {
      handleConfirm();
    } else if (step === 'verify' && pin.length >= 4) {
      handleVerify();
    }
  };

  const handleConfirm = async () => {
    if (pin !== confirmPin) {
      Alert.alert('PINs do not match', 'Please try again');
      setPin('');
      setConfirmPin('');
      setStep('create');
      return;
    }
    await engine.setPin(pin);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setWalletReady(true);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleVerify = async () => {
    const valid = await engine.verifyPin(pin);
    if (valid) {
      setWalletReady(true);
      router.replace('/(tabs)');
    } else {
      Alert.alert('Invalid PIN', 'Please try again');
      setPin('');
    }
  };

  if (walletReady) {
    return null; // Router will handle navigation
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={showSuccess} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="checkmark" size={40} color="#22c55e" />
            </View>
            <Text style={styles.modalTitle}>PIN Set Successfully!</Text>
            <Text style={styles.modalText}>Your wallet is now secure. Biometric unlock is available.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => {}}>
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name={step === 'verify' ? 'lock-closed' : 'lock-open'} size={40} color="#0ea5e9" />
          </View>
          <Text style={styles.title}>
            {step === 'create' ? 'Create PIN' : step === 'confirm' ? 'Confirm PIN' : 'Enter PIN'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'create' ? 'Enter a 4-6 digit PIN to secure your wallet' :
             step === 'confirm' ? 'Re-enter your PIN to confirm' :
             'Enter your PIN to unlock your wallet'}
          </Text>
        </View>

        <View style={styles.pinContainer}>
          {[0,1,2,3,4,5].map(i => (
            <View key={i} style={[
              styles.pinDot,
              (step === 'create' ? pin.length : step === 'confirm' ? confirmPin.length : pin.length) > i && styles.pinDotFilled
            ]} />
          ))}
        </View>

        <View style={styles.keypad}>
          {keys.map(key => (
            <TouchableOpacity key={key} style={[styles.key, key === '⌫' && styles.keyAction]} onPress={() => handleKeyPress(key)}>
              <Text style={[styles.keyText, key === '⌫' && styles.keyActionText]}>
                {key === '⌫' ? <Ionicons name="backspace-outline" size={28} color="#ef4444" /> : key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {step !== 'verify' && (
          <TouchableOpacity style={styles.biometricButton}>
            <Text style={styles.biometricText}>
              {step === 'create' ? 'Skip PIN, use biometric only' : 'Use biometric instead'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}