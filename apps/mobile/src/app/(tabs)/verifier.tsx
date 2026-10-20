import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCredentialEngine } from '../../context/CredentialEngineContext';
import { AppButton } from '../../components/AppButton';
import { EmptyState } from '../../components/EmptyState';
import { theme, typography, spacing, radii, shadows } from '../../theme/tokens';

const POLICIES = [
  {
    id: 'welfare_desk_workhistory_v1',
    label: 'Welfare Eligibility',
    desc: 'BOCW eligibility · 60+ months continuous work',
    icon: 'shield-checkmark-outline' as const,
    mechanism: 'A',
    accent: theme.primary,
    accentBg: theme.primaryBg,
  },
  {
    id: 'employer_workexp_v1',
    label: 'Work Experience',
    desc: 'Verify 36+ months of work history',
    icon: 'briefcase-outline' as const,
    mechanism: 'A',
    accent: theme.success,
    accentBg: theme.successBg,
  },
  {
    id: 'skill_verification_v1',
    label: 'Skill Level',
    desc: 'Verify skill credential at Level 3+',
    icon: 'ribbon-outline' as const,
    mechanism: 'B',
    accent: theme.warning,
    accentBg: theme.warningBg,
  },
  {
    id: 'age_verification_v1',
    label: 'Age Verification',
    desc: 'Verify holder is 18 or older',
    icon: 'calendar-outline' as const,
    mechanism: 'A',
    accent: theme.primary,
    accentBg: theme.primaryBg,
  },
];

type ResultType = 'VALID' | 'INVALID' | 'STALE';

export default function VerifierScreen() {
  const engine = useCredentialEngine();
  const insets = useSafeAreaInsets();
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const [request, setRequest] = useState<any>(null);
  const [result, setResult] = useState<{ type: ResultType; checkedAt: string; reasons: string[]; stalenessHours?: number } | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const bundle = await engine.getTrustBundle();
        setLastSync(bundle.generatedAt);
      } catch {}
    };
    load();
  }, [engine]);

  const handleSelectPolicy = async (policyId: string) => {
    setLoading(true);
    try {
      const vr = await engine.createVerificationRequest(policyId);
      setRequest(vr);
      setActivePolicy(policyId);
    } catch {
      Alert.alert('Error', 'Failed to create verification request.');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = () => {
    Alert.alert(
      'Scan Holder Response',
      'In a real deployment this opens the camera to scan the holder’s QR presentation. For this demo, pick a result to simulate.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Valid', onPress: () => finish('VALID') },
        { text: 'Invalid', onPress: () => finish('INVALID') },
        { text: 'Stale', onPress: () => finish('STALE') },
      ],
      { cancelable: true },
    );
  };

  const finish = (type: ResultType) => {
    setResult({
      type,
      checkedAt: new Date().toISOString(),
      reasons: type === 'VALID' ? ['OK'] : type === 'STALE' ? ['OK_STALE_REVOCATION_DATA'] : ['BAD_SIGNATURE'],
      stalenessHours: type === 'STALE' ? 24 : undefined,
    });
    setRequest(null);
    setActivePolicy(null);
  };

  const handleSync = async () => {
    try {
      await engine.syncTrustBundle();
      setLastSync(new Date().toISOString());
      Alert.alert('Synced', 'Trust data updated successfully.');
    } catch {
      Alert.alert('Error', 'Failed to sync trust data.');
    }
  };

  const reset = () => {
    setResult(null);
    setRequest(null);
    setActivePolicy(null);
  };

  const policy = activePolicy ? POLICIES.find((p) => p.id === activePolicy) : null;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View>
          <Text style={styles.headerTitle}>Verifier</Text>
          <Text style={styles.headerSubtitle}>
            {offlineMode ? 'Offline mode' : 'Online mode'}
            {lastSync ? ` · Synced ${new Date(lastSync).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}` : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setOfflineMode(!offlineMode)}
          style={[styles.modeBtn, { backgroundColor: offlineMode ? theme.warningBg : theme.successBg }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name={offlineMode ? 'cloud-offline-outline' : 'cloud-done-outline'} size={18} color={offlineMode ? theme.warning : theme.success} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing['2xl'] }} showsVerticalScrollIndicator={false}>
        {!result && !request && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select a policy</Text>
              {POLICIES.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.policyCard}
                  onPress={() => handleSelectPolicy(p.id)}
                  activeOpacity={0.85}
                  disabled={loading}
                >
                  <View style={[styles.policyIcon, { backgroundColor: p.accentBg }]}>
                    <Ionicons name={p.icon} size={22} color={p.accent} />
                  </View>
                  <View style={styles.policyText}>
                    <Text style={styles.policyLabel}>{p.label}</Text>
                    <Text style={styles.policyDesc}>{p.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trust Data</Text>
              <View style={[styles.trustCard, shadows.sm]}>
                <View style={styles.trustRow}>
                  <View>
                    <Text style={styles.trustLabel}>Trust Bundle</Text>
                    <Text style={styles.trustMeta}>4 issuers · 4 schemas · v1.0</Text>
                  </View>
                  <View style={[styles.trustBadge, { backgroundColor: offlineMode ? theme.warningBg : theme.successBg }]}>
                    <Text style={[styles.trustBadgeText, { color: offlineMode ? theme.warning : theme.success }]}>
                      {offlineMode ? 'Offline' : 'Online'}
                    </Text>
                  </View>
                </View>
                <View style={styles.trustActions}>
                  <AppButton label="Sync Now" onPress={handleSync} variant="outline" size="sm" disabled={offlineMode} style={{ flex: 1 }} />
                  <AppButton
                    label={offlineMode ? 'Go Online' : 'Go Offline'}
                    onPress={() => setOfflineMode(!offlineMode)}
                    variant="secondary"
                    size="sm"
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        {request && !result && policy && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification Request</Text>
            <View style={[styles.requestCard, shadows.sm]}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code-outline" size={64} color={theme.primary} />
                <Text style={styles.qrLabel}>Ready to scan</Text>
              </View>
              <View style={styles.requestDetails}>
                <DetailRow label="Policy" value={policy.label} />
                <DetailRow label="Mechanism" value={request.mechanism === 'A' ? 'Accumulator' : 'Status List'} />
                <DetailRow label="Nonce" value={request.nonce} mono />
                <DetailRow label="Expires" value={new Date(request.expiresAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} />
              </View>
              <AppButton label="Scan Holder Response" onPress={handleScan} fullWidth size="lg" icon="scan-outline" loading={loading} />
            </View>
          </View>
        )}

        {result && <ResultView result={result} onReset={reset} />}
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, mono && styles.detailMono]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function ResultView({ result, onReset }: { result: { type: ResultType; checkedAt: string; reasons: string[]; stalenessHours?: number }; onReset: () => void }) {
  const config = {
    VALID: { color: theme.success, bg: theme.successBg, icon: 'checkmark-circle' as const, title: 'Verified', subtitle: 'Credential is valid and verified' },
    INVALID: { color: theme.danger, bg: theme.dangerBg, icon: 'close-circle' as const, title: 'Failed', subtitle: 'Credential verification failed' },
    STALE: { color: theme.warning, bg: theme.warningBg, icon: 'time' as const, title: 'Stale', subtitle: 'Verification used stale data — flagged for review' },
  }[result.type];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Verification Result</Text>
      <View style={[styles.resultCard, { backgroundColor: config.bg, borderColor: config.color }]}>
        <View style={[styles.resultIcon, { backgroundColor: config.color }]}>
          <Ionicons name={config.icon} size={40} color="#fff" />
        </View>
        <Text style={[styles.resultTitle, { color: config.color }]}>{config.title}</Text>
        <Text style={styles.resultSubtitle}>{config.subtitle}</Text>

        <View style={styles.resultDetails}>
          <DetailRow label="Checked At" value={new Date(result.checkedAt).toLocaleString('en-IN')} />
          <DetailRow label="Reasons" value={result.reasons.join(', ')} />
          {result.stalenessHours ? <DetailRow label="Staleness" value={`${result.stalenessHours}h ago`} /> : null}
        </View>

        <AppButton label="New Verification" onPress={onReset} fullWidth size="lg" variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: theme.surface,
    borderBottomColor: theme.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: typography['3xl'], fontWeight: typography.bold, color: theme.text },
  headerSubtitle: { fontSize: typography.sm, color: theme.textSecondary, marginTop: 2 },
  modeBtn: { width: 40, height: 40, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: theme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  policyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  policyIcon: { width: 44, height: 44, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  policyText: { flex: 1 },
  policyLabel: { fontSize: typography.base, fontWeight: typography.semibold, color: theme.text },
  policyDesc: { fontSize: typography.sm, color: theme.textSecondary, marginTop: 2 },
  trustCard: {
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  trustRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trustLabel: { fontSize: typography.base, fontWeight: typography.semibold, color: theme.text },
  trustMeta: { fontSize: typography.sm, color: theme.textSecondary, marginTop: 1 },
  trustBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.full },
  trustBadgeText: { fontSize: typography.xs, fontWeight: typography.semibold },
  trustActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  requestCard: {
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  qrPlaceholder: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: theme.primaryBg,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
  },
  qrLabel: { fontSize: typography.sm, color: theme.primary, fontWeight: typography.medium, marginTop: spacing.sm },
  requestDetails: {
    backgroundColor: theme.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    gap: spacing.sm,
  },
  detailLabel: { fontSize: typography.sm, color: theme.textSecondary },
  detailValue: { fontSize: typography.sm, fontWeight: typography.medium, color: theme.text, flexShrink: 1, textAlign: 'right' },
  detailMono: { fontFamily: 'monospace', fontSize: typography.xs },
  resultCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  resultIcon: { width: 72, height: 72, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  resultTitle: { fontSize: typography['2xl'], fontWeight: typography.bold },
  resultSubtitle: { fontSize: typography.sm, color: theme.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  resultDetails: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginVertical: spacing.md,
  },
});
