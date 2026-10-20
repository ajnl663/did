import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCredentialEngine } from '../context/CredentialEngineContext';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import {
  theme,
  typography,
  spacing,
  radii,
  shadows,
  getCredentialMeta,
  attributeLabels,
  formatAttributeValue,
} from '../theme/tokens';
import { Credential } from '@did-workers/credential-engine';

export default function CredentialDetailScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const credId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrBusy, setQrBusy] = useState(false);
  const [qrData, setQrData] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const creds = await engine.getCredentials();
        const found = credId ? creds.find((c) => c.id === credId) : null;
        setCredential(found ?? null);
      } catch {
        // keep loading false
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [engine, credId]);

  const handleShare = async () => {
    if (!credential) return;
    setQrBusy(true);
    try {
      const req = await engine.createProofRequest('welfare_desk_workhistory_v1');
      const pres = await engine.generatePresentation(req.id, [credential.id], {});
      const qr = await engine.generatePresentationQR(pres);
      setQrData(qr[0]?.data ?? '');
      setShowQR(true);
    } catch {
      Alert.alert('Error', 'Failed to generate presentation QR.');
    } finally {
      setQrBusy(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState message="Loading credential…" />
      </SafeAreaView>
    );
  }

  if (!credential) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Credential</Text>
          <View style={{ width: 24 }} />
        </View>
        <EmptyState icon="document-text-outline" title="Credential not found" message="This credential may have been revoked or removed." />
      </SafeAreaView>
    );
  }

  const meta = getCredentialMeta(credential.schemaId);
  const isRevoked = credential.status === 'revoked';
  const isExpired = credential.status === 'expired';
  const statusConfig = isRevoked
    ? { label: 'Revoked', color: theme.danger, bg: theme.dangerBg }
    : isExpired
    ? { label: 'Expired', color: theme.warning, bg: theme.warningBg }
    : { label: 'Valid', color: theme.success, bg: theme.successBg };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Credential</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing['2xl'] }} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <View style={styles.heroSection}>
          <View style={[styles.heroCard, shadows.md]}>
            <View style={[styles.heroIcon, { backgroundColor: meta.bg }]}>
              <Ionicons name={meta.icon as any} size={32} color={meta.color} />
            </View>
            <Text style={styles.heroType}>{meta.label}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
            </View>
          </View>
        </View>

        {/* Issuer info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issuer</Text>
          <View style={styles.issuerCard}>
            <View style={styles.issuerIcon}>
              <Ionicons name="business-outline" size={20} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.issuerName}>{credential.issuerName}</Text>
              <Text style={styles.issuerDate}>
                Issued {new Date(credential.issuedOn).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            </View>
          </View>
        </View>

        {/* Attributes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attributes</Text>
          <View style={styles.attrCard}>
            {Object.entries(credential.attributes).map(([key, value], idx, arr) => (
              <View
                key={key}
                style={[
                  styles.attrRow,
                  idx < arr.length - 1 && styles.attrRowBorder,
                ]}
              >
                <Text style={styles.attrLabel}>{attributeLabels[key] ?? key.replace(/_/g, ' ')}</Text>
                <Text style={styles.attrValue}>{formatAttributeValue(key, value)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Technical */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Details</Text>
          <View style={styles.attrCard}>
            <View style={[styles.attrRow, styles.attrRowBorder]}>
              <Text style={styles.attrLabel}>Schema ID</Text>
              <Text style={styles.attrMono}>{credential.schemaId}</Text>
            </View>
            <View style={[styles.attrRow, styles.attrRowBorder]}>
              <Text style={styles.attrLabel}>Definition</Text>
              <Text style={styles.attrMono}>{credential.credentialDefinitionId}</Text>
            </View>
            <View style={styles.attrRow}>
              <Text style={styles.attrLabel}>Status Index</Text>
              <Text style={styles.attrValue}>{credential.statusIndex}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        {!isRevoked && (
          <View style={styles.section}>
            <AppButton
              label="Share Credential"
              onPress={handleShare}
              fullWidth
              size="lg"
              icon="qr-code-outline"
              loading={qrBusy}
            />
          </View>
        )}
      </ScrollView>

      {/* QR Modal */}
      <Modal visible={showQR} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Share Credential</Text>
            <Text style={styles.qrSubtitle}>Scan this QR with the verifier’s device</Text>
            <View style={styles.qrBox}>
              <Ionicons name="qr-code-outline" size={120} color={theme.primary} />
            </View>
            <Text style={styles.qrHint} numberOfLines={2}>{qrData.slice(0, 80)}…</Text>
            <AppButton label="Done" fullWidth onPress={() => setShowQR(false)} style={{ marginTop: spacing.md }} />
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
  heroSection: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  heroCard: {
    backgroundColor: theme.surface,
    borderRadius: radii['2xl'],
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroType: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: theme.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginTop: spacing.sm,
  },
  statusText: { fontSize: typography.sm, fontWeight: typography.semibold },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: theme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  issuerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  issuerIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  issuerName: { fontSize: typography.base, fontWeight: typography.semibold, color: theme.text },
  issuerDate: { fontSize: typography.sm, color: theme.textSecondary, marginTop: 1 },
  attrCard: {
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    gap: spacing.md,
  },
  attrRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  attrLabel: {
    fontSize: typography.sm,
    color: theme.textSecondary,
    flexShrink: 1,
  },
  attrValue: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: theme.text,
    textAlign: 'right',
    flexShrink: 1,
  },
  attrMono: {
    fontSize: typography.xs,
    fontFamily: 'monospace',
    color: theme.text,
    textAlign: 'right',
    flexShrink: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  qrCard: {
    backgroundColor: theme.surface,
    borderRadius: radii['2xl'],
    padding: spacing.xl,
    alignItems: 'center',
  },
  qrTitle: { fontSize: typography.lg, fontWeight: typography.bold, color: theme.text },
  qrSubtitle: { fontSize: typography.sm, color: theme.textSecondary, marginTop: spacing.xs, textAlign: 'center' },
  qrBox: {
    width: 200,
    height: 200,
    backgroundColor: theme.primaryBg,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  qrHint: { fontSize: typography.xs, color: theme.textTertiary, fontFamily: 'monospace' },
});
