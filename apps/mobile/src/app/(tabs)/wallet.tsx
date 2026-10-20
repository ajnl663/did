import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCredentialEngine } from '../../context/CredentialEngineContext';
import { CredentialCard } from '../../components/CredentialCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { theme, typography, spacing, radii, shadows, getCredentialMeta } from '../../theme/tokens';

export default function WalletScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
  const insets = useSafeAreaInsets();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [creds, offs] = await Promise.all([
        engine.getCredentials(),
        engine.getCredentialOffers(),
      ]);
      setCredentials(creds);
      setOffers(offs);
    } catch (e) {
      // keep existing state on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [engine]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const validCount = credentials.filter((c) => c.status === 'valid').length;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <Text style={styles.headerSubtitle}>
            {credentials.length} credential{credentials.length === 1 ? '' : 's'} · {validCount} valid
          </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/settings')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="settings-outline" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing['2xl'] }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Offers */}
        {offers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Offers · {offers.length}</Text>
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} engine={engine} onAccept={() => loadData()} onReject={() => loadData()} />
            ))}
          </View>
        )}

        {/* Credentials */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Credentials</Text>
            <TouchableOpacity onPress={() => router.push('/connect')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="add-circle-outline" size={26} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <LoadingState message="Loading credentials…" />
          ) : credentials.length === 0 ? (
            <EmptyState
              icon="briefcase-outline"
              title="No credentials yet"
              message="Scan a QR code from an issuer to connect and receive your first verifiable credential."
            />
          ) : (
            credentials.map((cred) => (
              <CredentialCard
                key={cred.id}
                credential={cred}
                onPress={() => router.push(`/credential?id=${cred.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function OfferCard({ offer, engine, onAccept, onReject }: {
  offer: any;
  engine: ReturnType<typeof useCredentialEngine>;
  onAccept: () => void;
  onReject: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const meta = getCredentialMeta(offer.schemaId);

  const accept = async () => {
    setBusy(true);
    try { await engine.acceptCredentialOffer(offer.id); } finally { setBusy(false); onAccept(); }
  };
  const reject = async () => {
    setBusy(true);
    try { await engine.rejectCredentialOffer(offer.id); } finally { setBusy(false); onReject(); }
  };

  return (
    <View style={[styles.offerCard, shadows.sm]}>
      <View style={styles.offerHeader}>
        <View style={[styles.offerIcon, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon as any} size={20} color={meta.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.offerType}>{meta.label}</Text>
          <Text style={styles.offerIssuer}>{offer.issuerName}</Text>
        </View>
        <View style={styles.pendingBadge}>
          <Ionicons name="time-outline" size={12} color={theme.warning} />
          <Text style={styles.pendingText}>Pending</Text>
        </View>
      </View>
      <View style={styles.offerActions}>
        <TouchableOpacity style={[styles.offerBtn, styles.offerBtnReject]} onPress={reject} disabled={busy} activeOpacity={0.85}>
          <Text style={styles.offerBtnRejectText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.offerBtn, styles.offerBtnAccept]} onPress={accept} disabled={busy} activeOpacity={0.85}>
          <Text style={styles.offerBtnAcceptText}>Accept</Text>
        </TouchableOpacity>
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
  settingsBtn: { padding: spacing.xs },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: theme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  offerCard: {
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  offerHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  offerIcon: { width: 40, height: 40, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  offerType: { fontSize: typography.base, fontWeight: typography.semibold, color: theme.text },
  offerIssuer: { fontSize: typography.sm, color: theme.textSecondary, marginTop: 1 },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  pendingText: { fontSize: typography.xs, fontWeight: typography.semibold, color: theme.warning },
  offerActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  offerBtn: { flex: 1, paddingVertical: 12, borderRadius: radii.md, alignItems: 'center' },
  offerBtnReject: { backgroundColor: theme.surfaceMuted },
  offerBtnAccept: { backgroundColor: theme.primary },
  offerBtnRejectText: { fontSize: typography.sm, fontWeight: typography.semibold, color: theme.textSecondary },
  offerBtnAcceptText: { fontSize: typography.sm, fontWeight: typography.semibold, color: '#fff' },
});
