import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCredentialEngine } from '../../context/CredentialEngineContext';
import { setLanguage, getAvailableLanguages } from '@did-workers/i18n';
import { AppButton } from '../../components/AppButton';
import { AppSwitch } from '../../components/AppSwitch';
import { theme, typography, spacing, radii } from '../../theme/tokens';

const languages = getAvailableLanguages();

export default function LanguageScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
  const insets = useSafeAreaInsets();
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const handleContinue = async () => {
    setLanguage(selectedLang);
    await engine.setLanguage(selectedLang as any);
    await engine.setVoiceEnabled(voiceEnabled);
    router.replace('/(auth)/pin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing['2xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroIcon}>
          <Ionicons name="shield-checkmark" size={44} color={theme.primary} />
        </View>
        <Text style={styles.title}>Welcome to DID Workers</Text>
        <Text style={styles.subtitle}>
          Your portable, verifiable work identity. Choose your language to get started.
        </Text>

        <View style={styles.langSection}>
          {languages.map((lang) => {
            const selected = selectedLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langCard, selected && styles.langCardSelected]}
                onPress={() => setSelectedLang(lang.code)}
                activeOpacity={0.85}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <View style={styles.langInfo}>
                  <Text style={styles.langName}>{lang.name}</Text>
                  <Text style={styles.langNative}>{lang.nativeName}</Text>
                </View>
                {selected && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.voiceRow} activeOpacity={1} onPress={() => setVoiceEnabled(!voiceEnabled)}>
          <View style={styles.voiceLeft}>
            <View style={[styles.voiceIcon, { backgroundColor: theme.primaryBg }]}>
              <Ionicons name="volume-high" size={20} color={theme.primary} />
            </View>
            <View>
              <Text style={styles.voiceLabel}>Spoken Help</Text>
              <Text style={styles.voiceSubtext}>Voice prompts for guidance</Text>
            </View>
          </View>
          <AppSwitch value={voiceEnabled} onValueChange={setVoiceEnabled} />
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <AppButton label="Continue" onPress={handleContinue} fullWidth size="lg" icon="arrow-forward" iconPosition="right" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: radii['2xl'],
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    alignSelf: 'center',
  },
  title: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: theme.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.base,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  langSection: {
    marginTop: spacing['2xl'],
    gap: spacing.sm,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: theme.border,
    backgroundColor: theme.surface,
  },
  langCardSelected: {
    borderColor: theme.primary,
    backgroundColor: theme.primaryBg,
  },
  flag: { fontSize: 28, marginRight: spacing.md },
  langInfo: { flex: 1 },
  langName: { fontSize: typography.lg, fontWeight: typography.semibold, color: theme.text },
  langNative: { fontSize: typography.sm, color: theme.textSecondary, marginTop: 2 },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: radii.full,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: theme.surface,
    marginTop: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  voiceLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2, flex: 1 },
  voiceIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceLabel: { fontSize: typography.base, fontWeight: typography.medium, color: theme.text },
  voiceSubtext: { fontSize: typography.sm, color: theme.textSecondary, marginTop: 1 },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: theme.background },
});
