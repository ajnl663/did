import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCredentialEngine } from '../context/CredentialEngineContext';
import { t, setLanguage, getAvailableLanguages } from '@did-workers/i18n';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#171717' },
  content: { flex: 1, padding: 16 },
  section: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  sectionTitle: { padding: 16, fontSize: 13, fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: 0.5 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center' },
  itemText: { fontSize: 16, fontWeight: '500', color: '#171717' },
  itemSubtext: { fontSize: 13, color: '#737373', marginTop: 2 },
  chevron: { color: '#94a3b8' },
  switchTrack: { width: 52, height: 28, borderRadius: 14 },
  switchTrackOn: { backgroundColor: '#0ea5e9' },
  switchTrackOff: { backgroundColor: '#e5e5e5' },
  switchThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  switchThumbOn: { marginLeft: 24 },
  languageCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  languageCardSelected: { backgroundColor: '#f0f9ff' },
  flag: { fontSize: 24, marginRight: 12 },
  languageName: { fontSize: 16, fontWeight: '500', color: '#171717' },
  languageNative: { fontSize: 13, color: '#737373' },
  checkIcon: { color: '#0ea5e9' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  modalItemSelected: { backgroundColor: '#f0f9ff' },
  modalItemText: { fontSize: 16, fontWeight: '500', color: '#171717' },
  modalItemNative: { fontSize: 13, color: '#737373' },
  dangerItem: { backgroundColor: '#fef2f2' },
  dangerText: { color: '#dc2626' },
  modalButton: { backgroundColor: '#0ea5e9', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  pinDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#e5e5e5' },
  pinDotFilled: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  key: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  keyText: { fontSize: 24, fontWeight: '600', color: '#171717' },
});

export default function SettingsScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguageState] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);

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

  const handleLanguageChange = async (lang: 'en' | 'hi' | 'mr') => {
    setLanguageState(lang);
    setLanguage(lang);
    await engine.setLanguage(lang);
    setShowLanguageModal(false);
  };

  const handleVoiceToggle = async (enabled: boolean) => {
    setVoiceEnabled(enabled);
    await engine.setVoiceEnabled(enabled);
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    setBiometricEnabled(enabled);
    await engine.setBiometric(enabled);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Settings</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <TouchableOpacity style={styles.item} onPress={() => setShowLanguageModal(true)}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Ionicons name="globe" size={20} color="#0ea5e9" />
              </View>
              <View>
                <Text style={styles.itemText}>Language</Text>
                <Text style={styles.itemSubtext}>
                  {languages.find(l => l.code === language)?.name} - {languages.find(l => l.code === language)?.nativeName}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Voice & Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice & Accessibility</Text>
          <TouchableOpacity style={styles.item} activeOpacity={1}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Ionicons name="volume-high" size={20} color="#0ea5e9" />
              </View>
              <View>
                <Text style={styles.itemText}>Spoken Help</Text>
                <Text style={styles.itemSubtext}>Voice prompts for guidance (on by default in wallet)</Text>
              </View>
            </View>
            <View style={[styles.switchTrack, voiceEnabled ? styles.switchTrackOn : styles.switchTrackOff]}>
              <View style={[styles.switchThumb, voiceEnabled ? styles.switchThumbOn : {}]} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} activeOpacity={1}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Ionicons name="finger-print" size={20} color="#0ea5e9" />
              </View>
              <View>
                <Text style={styles.itemText}>Biometric Unlock</Text>
                <Text style={styles.itemSubtext}>Use fingerprint or face ID to unlock wallet</Text>
              </View>
            </View>
            <View style={[styles.switchTrack, biometricEnabled ? styles.switchTrackOn : styles.switchTrackOff]}>
              <View style={[styles.switchThumb, biometricEnabled ? styles.switchThumbOn : {}]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity style={styles.item} onPress={() => setShowPinModal(true)}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Ionicons name="lock-closed" size={20} color="#0ea5e9" />
              </View>
              <View>
                <Text style={styles.itemText}>Change PIN</Text>
                <Text style={styles.itemSubtext}>Update your wallet PIN</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Ionicons name="shield-checkmark" size={20} color="#0ea5e9" />
              </View>
              <View>
                <Text style={styles.itemText}>Wallet Backup</Text>
                <Text style={styles.itemSubtext}>Export encrypted wallet backup (Phase 2)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Ionicons name="information-circle" size={20} color="#0ea5e9" />
              </View>
              <View>
                <Text style={styles.itemText}>Version</Text>
                <Text style={styles.itemSubtext}>0.1.0 (Demo Build)</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Ionicons name="document-text" size={20} color="#0ea5e9" />
              </View>
              <View>
                <Text style={styles.itemText}>Open Source Licenses</Text>
                <Text style={styles.itemSubtext}>View third-party licenses</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity style={[styles.item, { backgroundColor: '#fef2f2' }]} onPress={() => Alert.alert('Reset Wallet', 'This will delete all credentials and connections. Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: () => router.replace('/(auth)/pin') }])}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Ionicons name="trash" size={20} color="#ef4444" />
              </View>
              <View>
                <Text style={{ ...styles.itemText, color: '#dc2626' }}>Reset Wallet</Text>
                <Text style={styles.itemSubtext}>Delete all credentials, connections, and settings</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={showLanguageModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.modalItem, language === lang.code && styles.modalItemSelected]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <View>
                    <Text style={styles.modalItemText}>{lang.name}</Text>
                    <Text style={styles.modalItemNative}>{lang.nativeName}</Text>
                  </View>
                </View>
                {language === lang.code && <Ionicons name="checkmark-circle" size={20} color="#0ea5e9" style={{ position: 'absolute', right: 16 }} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowLanguageModal(false)}>
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PIN Modal */}
      <Modal visible={showPinModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change PIN</Text>
            <Text style={{ color: '#737373', marginBottom: 16, textAlign: 'center' }}>Enter your new 4-6 digit PIN</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              {[0,1,2,3,4,5].map(i => (
                <View key={i} style={[styles.pinDot, pinInput.length > i && styles.pinDotFilled]} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map(key => (
                <TouchableOpacity key={key} style={styles.key} onPress={() => { if (key === '⌫') setPinInput(p => p.slice(0, -1)); else if (key && pinInput.length < 6) setPinInput(p => p + key); }}>
                  <Text style={styles.keyText}>{key === '⌫' ? <Ionicons name="backspace" size={24} color="#ef4444" /> : key}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setShowPinModal(false); setPinInput(''); }}>
              <Text style={styles.modalButtonText}>Save PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}