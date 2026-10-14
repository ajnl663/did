import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCredentialEngine } from '../../context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdf4' },
  header: { padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#dcfce7' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#166534' },
  subtitle: { color: '#16a34a', fontSize: 14, marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#166534', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  policyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#dcfce7' },
  policyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  policyName: { fontSize: 16, fontWeight: '600', color: '#166534' },
  policyDesc: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontSize: 11, fontWeight: '600' },
  badgeOnline: { backgroundColor: '#dcfce7', color: '#166534' },
  badgeOffline: { backgroundColor: '#fef3c7', color: '#d97706' },
  button: { backgroundColor: '#22c55e', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dcfce7' },
  buttonSecondaryText: { color: '#22c55e' },
  buttonDisabled: { opacity: 0.6 },
  qrContainer: { alignItems: 'center', padding: 20 },
  qrPlaceholder: { width: 256, height: 256, backgroundColor: '#f0fdf4', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#86efac', borderStyle: 'dashed' },
  resultCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 12 },
  resultValid: { backgroundColor: '#f0fdf4', borderWidth: 2, borderColor: '#22c55e' },
  resultInvalid: { backgroundColor: '#fef2f2', borderWidth: 2, borderColor: '#ef4444' },
  resultStale: { backgroundColor: '#fffbeb', borderWidth: 2, borderColor: '#f59e0b' },
  resultIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  resultIconValid: { backgroundColor: '#dcfce7' },
  resultIconInvalid: { backgroundColor: '#fecaca' },
  resultIconStale: { backgroundColor: '#fef3c7' },
  resultTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  resultTitleValid: { color: '#166534' },
  resultTitleInvalid: { color: '#dc2626' },
  resultTitleStale: { color: '#d97706' },
  resultSubtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  detailLabel: { color: '#6b7280' },
  detailValue: { fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
});

const policyTemplates = [
  { id: 'welfare_desk_workhistory_v1', label: 'Welfare Eligibility (BOCW)', desc: 'Verify BOCW eligibility with 60+ months continuous work', mechanism: 'A' },
  { id: 'employer_workexp_v1', label: 'Work Experience (3+ years)', desc: 'Verify 36+ months of work experience', mechanism: 'A' },
  { id: 'skill_verification_v1', label: 'Skill Level (Level 3+)', desc: 'Verify skill credential at level 3 or higher', mechanism: 'B' },
  { id: 'age_verification_v1', label: 'Age Verification (18+)', desc: 'Verify holder is 18 or older', mechanism: 'A' },
];

export default function VerifierScreen() {
  const engine = useCredentialEngine();
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [request, setRequest] = useState<any>(null);
  const [qrData, setQrData] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const bundle = await engine.getTrustBundle();
      setLastSync(bundle.generatedAt);
    };
    load();
  }, [engine]);

  const handleCreateRequest = async (policyId: string) => {
    setLoading(true);
    try {
      const vr = await engine.createVerificationRequest(policyId);
      setRequest(vr);
      const qr = await engine.generateRequestQR(vr);
      setQrData(qr);
      setSelectedPolicy(policyId);
    } catch (e) {
      Alert.alert('Error', 'Failed to create verification request');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!request) return;
    Alert.alert(
      'Scan Holder Response',
      'In a real app, this would scan the holder\'s QR presentation.\n\nFor demo, we\'ll simulate a valid result.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Simulate Valid', onPress: () => simulateResult('VALID') },
        { text: 'Simulate Invalid', onPress: () => simulateResult('INVALID') },
        { text: 'Simulate Stale', onPress: () => simulateResult('STALE') },
      ]
    );
  };

  const simulateResult = (resultType: 'VALID' | 'INVALID' | 'STALE') => {
    const mockResult = {
      id: `vr-${Date.now()}`,
      verificationRequestId: request.id,
      presentationId: `pres-${Date.now()}`,
      result: resultType,
      reasonCodes: resultType === 'VALID' ? ['OK'] : resultType === 'STALE' ? ['OK_STALE_REVOCATION_DATA'] : ['BAD_SIGNATURE'],
      checkedAt: new Date().toISOString(),
      stalenessSeconds: resultType === 'STALE' ? 86400 : 0,
    };
    setResult(mockResult);
    setShowResult(true);
    setRequest(null);
    setQrData('');
  };

  const handleSync = async () => {
    try {
      await engine.syncTrustBundle();
      setLastSync(new Date().toISOString());
      Alert.alert('Synced', 'Trust data updated successfully');
    } catch (e) {
      Alert.alert('Error', 'Failed to sync trust data');
    }
  };

  const policy = selectedPolicy ? policyTemplates.find(p => p.id === selectedPolicy) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Verifier Mode</Text>
            <Text style={styles.subtitle}>
              {offlineMode ? '📴 Offline Mode' : '🌐 Online Mode'}
              {lastSync && ` • Last sync: ${new Date(lastSync).toLocaleTimeString()}`}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setOfflineMode(!offlineMode)} style={{ padding: 8 }}>
            <Ionicons name={offlineMode ? 'wifi-outline' : 'wifi'} size={24} color={offlineMode ? '#f59e0b' : '#22c55e'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {!request && !result && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Policy Template</Text>
              {policyTemplates.map(p => (
                <TouchableOpacity key={p.id} style={styles.policyCard} onPress={() => handleCreateRequest(p.id)}>
                  <View style={styles.policyHeader}>
                    <View>
                      <Text style={styles.policyName}>{p.label}</Text>
                      <Text style={styles.policyDesc}>{p.desc}</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color="#94a3b8" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trust Data</Text>
              <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontWeight: '600' }}>Trust Bundle</Text>
                    <Text style={{ fontSize: 12, color: '#737373' }}>Version 1.0.0 • 4 issuers • 4 schemas</Text>
                  </View>
                  <Text style={[styles.badge, offlineMode ? styles.badgeOffline : styles.badgeOnline]}>
                    {offlineMode ? 'Offline' : 'Online'}
                  </Text>
                </View>
                <View style={{ marginTop: 12, flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={handleSync} disabled={offlineMode}>
                    <Text style={styles.buttonText}>Sync Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.buttonSecondary, { flex: 1 }]} onPress={() => setOfflineMode(!offlineMode)}>
                    <Text style={styles.buttonSecondaryText}>
                      {offlineMode ? 'Go Online' : 'Go Offline'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}

        {request && qrData && !result && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Verification Request</Text>
              <View style={styles.card}>
                <View style={styles.qrContainer}>
                  <View style={styles.qrPlaceholder}>
                    <Text style={{ color: '#86efac', textAlign: 'center' }}>
                      QR Code Ready\n\nNonce: {request.nonce}\nPolicy: {policy?.label}
                    </Text>
                  </View>
                </View>
                <View style={{ marginTop: 16 }}>
                  <Text style={{ fontSize: 12, color: '#737373', marginBottom: 4 }}>Request Details</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ color: '#737373' }}>Policy</Text>
                    <Text style={{ fontWeight: '500' }}>{policy?.label}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ color: '#737373' }}>Mechanism</Text>
                    <Text style={{ fontWeight: '500' }}>{request.mechanism === 'A' ? 'Accumulator' : 'Status List'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#737373' }}>Nonce</Text>
                    <Text style={{ fontWeight: '500', fontFamily: 'monospace', fontSize: 12 }}>{request.nonce}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={handleVerify} disabled={loading}>
                  <Text style={styles.buttonText}>
                    {loading ? 'Verifying...' : 'Scan Holder Response'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {showResult && result && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Verification Result</Text>
              <View style={[
                styles.resultCard,
                result.result === 'VALID' ? styles.resultValid :
                result.result === 'INVALID' ? styles.resultInvalid : styles.resultStale
              ]}>
                <View style={[
                  styles.resultIcon,
                  result.result === 'VALID' ? styles.resultIconValid :
                  result.result === 'INVALID' ? styles.resultIconInvalid : styles.resultIconStale
                ]}>
                  <Ionicons
                    name={result.result === 'VALID' ? 'checkmark' : result.result === 'INVALID' ? 'close' : 'time'}
                    size={40}
                    color={
                      result.result === 'VALID' ? '#16a34a' :
                      result.result === 'INVALID' ? '#ef4444' : '#f59e0b'
                    }
                  />
                </View>
                <Text style={[
                  styles.resultTitle,
                  result.result === 'VALID' ? styles.resultTitleValid :
                  result.result === 'INVALID' ? styles.resultTitleInvalid : styles.resultTitleStale
                ]}>
                  {result.result}
                </Text>
                <Text style={styles.resultSubtitle}>
                  {result.result === 'VALID' && 'Credential is valid and verified'}
                  {result.result === 'INVALID' && 'Credential verification failed'}
                  {result.result === 'STALE' && 'Verification used stale data - flagged for review'}
                </Text>

                <View style={{ marginTop: 16 }}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Verified At</Text>
                    <Text style={styles.detailValue}>{new Date(result.checkedAt).toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Reason Codes</Text>
                    <Text style={styles.detailValue}>{result.reasonCodes.join(', ')}</Text>
                  </View>
                  {result.stalenessSeconds && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Staleness</Text>
                      <Text style={styles.detailValue}>{Math.floor(result.stalenessSeconds / 3600)}h ago</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={() => { setShowResult(false); setResult(null); }}>
                  <Text style={styles.buttonText}>New Verification</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}