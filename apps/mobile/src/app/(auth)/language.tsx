import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCredentialEngine } from '../../context/CredentialEngineContext';
import { t, setLanguage } from '@did-workers/i18n';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#171717', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#737373', textAlign: 'center', marginTop: 8, lineHeight: 24 },
  languageCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 2, borderColor: '#e5e5e5', marginBottom: 12 },
  languageCardSelected: { borderColor: '#0ea5e9', backgroundColor: '#f0f9ff' },
  flag: { fontSize: 28, marginRight: 16 },
  languageInfo: { flex: 1 },
  languageName: { fontSize: 18, fontWeight: '600', color: '#171717' },
  languageNative: { fontSize: 14, color: '#737373' },
  checkIcon: { color: '#0ea5e9' },
  continueButton: { backgroundColor: '#0ea5e9', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  continueButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  voiceToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, backgroundColor: '#f5f5f5', marginTop: 24 },
  voiceLabel: { fontSize: 16, fontWeight: '500', color: '#171717' },
  switchTrack: { width: 52, height: 28, borderRadius: 14 },
  switchTrackOn: { backgroundColor: '#0ea5e9' },
  switchTrackOff: { backgroundColor: '#e5e5e5' },
  switchThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  switchThumbOn: { marginLeft: 24 },
});

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
] as const;

export default function LanguageScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={40} color="#0ea5e9" />
          </View>
          <Text style={styles.title}>Welcome to DID Workers</Text>
          <Text style={styles.subtitle}>
            Choose your language to get started. You can change this later in settings.
          </Text>
        </View>

        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.languageCard, selectedLang === lang.code && styles.languageCardSelected]}
            onPress={() => setSelectedLang(lang.code)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{lang.name}</Text>
              <Text style={styles.languageNative}>{lang.nativeName}</Text>
            </View>
            {selectedLang === lang.code && <Ionicons name="checkmark-circle" size={24} color="#0ea5e9" />}
          </TouchableOpacity>
        ))}

        <View style={styles.voiceToggle}>
          <View>
            <Text style={styles.voiceLabel}>Spoken Help</Text>
            <Text style={{ fontSize: 12, color: '#737373' }}>Voice prompts for guidance</Text>
          </View>
          <View style={[styles.switchTrack, voiceEnabled ? styles.switchTrackOn : styles.switchTrackOff]}>
            <View style={[styles.switchThumb, voiceEnabled ? styles.switchThumbOn : {}]} />
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}