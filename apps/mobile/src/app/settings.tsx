import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCredentialEngine } from '../context/CredentialEngineContext';
import { setLanguage, getAvailableLanguages } from '@did-workers/i18n';
import { AppSwitch } from '../components/AppSwitch';
import { PinPad, PinDots } from '../components/PinPad';
import { Section, Row } from '../components/Section';
import { AppButton } from '../components/AppButton';
import { theme, typography, spacing, radii } from '../theme/tokens';

export default function SettingsScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
  const insets = useSafeAreaInsets();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [language, setLanguageState] = useState<'en' | 'hi' | 'mr'>('en');
  const [showLangModal, setShowLangModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    const load = async () => {
      const wallet = await engine.getWallet();
      setVoiceEnabled(wallet.voiceEnabled);
      setLanguageState(wallet.language);
      setBiometricEnabled(wallet.biometricEnabled);
    };
    load();
  }, [engine]);

  const languages = getAvailableLanguages();
  const currentLang = languages.find((l) => l.code === language);

  const handleLanguageChange = async (lang: 'en' | 'hi' | 'mr') => {
    setLanguageState(lang);
    setLanguage(lang);
    await engine.setLanguage(lang);
    setShowLangModal(false);
  };

  const handleVoiceToggle = async (enabled: boolean) => {
    setVoiceEnabled(enabled);
    await engine.setVoiceEnabled(enabled);
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    setBiometricEnabled(enabled);
    await engine.setBiometric(enabled);
  };

  const handleSavePin = async () => {
    if (pinInput.length < 4) {
      Alert.alert('PIN too short', 'Please enter at least 4 digits.');
      return;
    }
    await engine.setPin(pinInput);
    setShowPinModal(false);
    setPinInput('');
    Alert.alert('PIN updated', 'Your wallet PIN has been changed.');
  };

  const handleResetWallet = () => {
    Alert.alert(
      'Reset Wallet',
      'This will delete all credentials and connections. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => router.replace('/(auth)/pin') },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing['2xl'] }} showsVerticalScrollIndicator={false}>
        <Section title="Language">
          <Row
            icon="globe-outline"
            title="Language"
            subtitle={`${currentLang?.name ?? ''} · ${currentLang?.nativeName ?? ''}`}
            showChevron
            onPress={() => setShowLangModal(true)}
          />
        </Section>

        <Section title="Voice & Accessibility">
          <Row
            icon="volume-high"
            title="Spoken Help"
            subtitle="Voice prompts for guidance"
            right={<AppSwitch value={voiceEnabled} onValueChange={handleVoiceToggle} />}
          />
          <Row
            icon="finger-print"
            title="Biometric Unlock"
            subtitle="Use fingerprint or face ID"
            right={<AppSwitch value={biometricEnabled} onValueChange={handleBiometricToggle} />}
          />
        </Section>

        <Section title="Security">
          <Row
            icon="lock-closed"
            title="Change PIN"
            subtitle="Update your wallet PIN"
            showChevron
            onPress={() => setShowPinModal(true)}
          />
          <Row
            icon="shield-checkmark-outline"
            title="Wallet Backup"
            subtitle="Export encrypted backup (Phase 2)"
            showChevron
          />
        </Section>

        <Section title="About">
          <Row icon="information-circle-outline" title="Version" subtitle="0.1.0 (Demo Build)" />
          <Row icon="document-text-outline" title="Open Source Licenses" subtitle="View third-party licenses" showChevron />
        </Section>

        <Section title="Danger Zone">
          <Row icon="trash-outline" title="Reset Wallet" subtitle="Delete all credentials and settings" danger showChevron onPress={handleResetWallet} />
        </Section>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={showLangModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Language</Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langItem, language === lang.code && styles.langItemSelected]}
                onPress={() => handleLanguageChange(lang.code as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.langName}>{lang.name}</Text>
                  <Text style={styles.langNative}>{lang.nativeName}</Text>
                </View>
                {language === lang.code && <Ionicons name="checkmark-circle" size={22} color={theme.primary} />}
              </TouchableOpacity>
            ))}
            <AppButton label="Done" variant="secondary" fullWidth onPress={() => setShowLangModal(false)} style={{ marginTop: spacing.md }} />
          </View>
        </View>
      </Modal>

      {/* PIN Modal */}
      <Modal visible={showPinModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change PIN</Text>
            <Text style={styles.modalSubtitle}>Enter your new 4–6 digit PIN</Text>
            <View style={styles.pinDots}>
              <PinDots length={pinInput.length} max={6} />
            </View>
            <PinPad onKeyPress={(k) => setPinInput((p) => (k === 'back' ? p.slice(0, -1) : p.length < 6 ? p + k : p))} />
            <View style={styles.pinActions}>
              <AppButton label="Cancel" variant="secondary" onPress={() => { setShowPinModal(false); setPinInput(''); }} style={{ flex: 1 }} />
              <AppButton label="Save" onPress={handleSavePin} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: theme.surface,
    borderBottomColor: theme.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: typography.lg, fontWeight: typography.semibold, color: theme.text },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: theme.surface,
    borderRadius: radii['2xl'],
    padding: spacing.xl,
  },
  modalTitle: { fontSize: typography.lg, fontWeight: typography.bold, color: theme.text, textAlign: 'center' },
  modalSubtitle: { fontSize: typography.sm, color: theme.textSecondary, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    padding: spacing.md,
    borderRadius: radii.md,
  },
  langItemSelected: { backgroundColor: theme.primaryBg },
  langFlag: { fontSize: 24 },
  langName: { fontSize: typography.base, fontWeight: typography.medium, color: theme.text },
  langNative: { fontSize: typography.sm, color: theme.textSecondary, marginTop: 1 },
  pinDots: { alignItems: 'center', marginVertical: spacing.lg },
  pinActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
});
