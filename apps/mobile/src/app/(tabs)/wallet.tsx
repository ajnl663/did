import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCredentialEngine } from '../../context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#171717' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#171717', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  credentialType: { fontSize: 14, fontWeight: '600', color: '#171717' },
  credentialIssuer: { fontSize: 12, color: '#737373' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, fontSize: 11, fontWeight: '600' },
  badgeValid: { backgroundColor: '#f0fdf4', color: '#16a34a' },
  badgeRevoked: { backgroundColor: '#fef2f2', color: '#dc2626' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyIcon: { marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#737373', textAlign: 'center' },
  button: { backgroundColor: '#0ea5e9', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e5e5' },
  buttonSecondaryText: { color: '#0ea5e9' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#f5f5f5' },
  modalButtonConfirm: { backgroundColor: '#0ea5e9' },
  modalButtonText: { color: '#fff', fontWeight: '600' },
  modalButtonCancelText: { color: '#171717' },
  qrContainer: { alignItems: 'center', padding: 20 },
  qrPlaceholder: { width: 256, height: 256, backgroundColor: '#f5f5f5', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});

export default function WalletScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinAction, setPinAction] = useState<'verify' | 'set'>('verify');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [creds, offs] = await Promise.all([
        engine.getCredentials(),
        engine.getCredentialOffers(),
      ]);
      setCredentials(creds);
      setOffers(offs);
    } catch (e) {
      console.error('Failed to load wallet data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      const cred = await engine.acceptCredentialOffer(offerId);
      setCredentials(prev => [...prev, cred]);
      setOffers(prev => prev.filter(o => o.id !== offerId));
      Alert.alert('Success', 'Credential added to your wallet!');
    } catch (e) {
      Alert.alert('Error', 'Failed to accept credential');
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      await engine.rejectCredentialOffer(offerId);
      setOffers(prev => prev.filter(o => o.id !== offerId));
    } catch (e) {
      Alert.alert('Error', 'Failed to reject credential');
    }
  };

  const handleShareCredential = async (credentialId: string) => {
    try {
      const pres = await engine.generatePresentation('vr-demo', [credentialId], {});
      const qr = await engine.generatePresentationQR(pres);
      setQrData(JSON.stringify(qr[0]));
      setShowQR(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to generate QR');
    }
  };

  const verifyPin = async () => {
    const valid = await engine.verifyPin(pinInput);
    if (valid) {
      setShowPinModal(false);
      setPinInput('');
      if (pinAction === 'verify') {
        // Navigate to verifier mode or perform sensitive action
        router.push('/(tabs)/verifier');
      }
    } else {
      Alert.alert('Invalid PIN', 'Please try again');
      setPinInput('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>My Wallet</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Credential Offers */}
        {offers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Offers ({offers.length})</Text>
            {offers.map(offer => (
              <View key={offer.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.credentialType}>{offer.schemaId.replace('_', ' ')}</Text>
                    <Text style={styles.credentialIssuer}>From {offer.issuerName}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                  <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={() => handleAcceptOffer(offer.id)}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.buttonSecondary, { flex: 1 }]} onPress={() => handleRejectOffer(offer.id)}>
                    <Text style={styles.buttonSecondaryText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Credentials */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>My Credentials ({credentials.length})</Text>
            <TouchableOpacity onPress={() => router.push('/connect')}>
              <Ionicons name="qr-code-outline" size={24} color="#0ea5e9" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="sync" size={32} color="#94a3b8" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>Loading credentials...</Text>
            </View>
          ) : credentials.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#d4d4d4" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No credentials yet.\nScan a QR code to connect with an issuer.</Text>
            </View>
          ) : (
            credentials.map(cred => (
              <TouchableOpacity key={cred.id} style={styles.card} onPress={() => handleShareCredential(cred.id)}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.credentialType}>{cred.schemaId.replace('_', ' ')}</Text>
                    <Text style={styles.credentialIssuer}>Issued by {cred.issuerName}</Text>
                  </View>
                  <Text style={[styles.badge, cred.status === 'valid' ? styles.badgeValid : styles.badgeRevoked]}>
                    {cred.status.toUpperCase()}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ fontSize: 12, color: '#737373' }}>
                    {cred.attributes.full_name || cred.attributes.trade || cred.attributes.skill_name || 'Credential'}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#737373' }}>
                    {new Date(cred.issuedOn).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => router.push('/connect')}>
            <Text style={styles.buttonSecondaryText}>
              <Ionicons name="add-outline" size={18} style={{ marginRight: 8 }} />
              Connect New Issuer
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* PIN Modal */}
      <Modal visible={showPinModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter PIN</Text>
            <TextInput
              style={styles.input}
              placeholder="4-digit PIN"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
              value={pinInput}
              onChangeText={setPinInput}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => { setShowPinModal(false); setPinInput(''); }}>
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={verifyPin}>
                <Text style={styles.modalButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* QR Modal */}
      <Modal visible={showQR} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.qrContainer}>
              <Text style={styles.modalTitle}>Share Credential</Text>
              <Text style={{ color: '#737373', marginBottom: 16, textAlign: 'center' }}>
                Scan this QR with the verifier app
              </Text>
              <View style={styles.qrPlaceholder}>
                <Text style={{ color: '#94a3b8' }}>QR Code: {qrData.slice(0, 50)}...</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => setShowQR(false)}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}