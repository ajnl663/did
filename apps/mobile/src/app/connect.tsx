import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useCredentialEngine } from '../context/CredentialEngineContext';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { theme, typography, spacing, radii, shadows, colors } from '../theme/tokens';

export default function ConnectScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [connection, setConnection] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = ({ data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    setScannedData(data);
    setShowConfirm(true);
  };

  const handleAccept = async () => {
    setConnecting(true);
    try {
      const conn = await engine.scanInvitation(scannedData);
      setConnection(conn);
      setShowConfirm(false);
    } catch {
      Alert.alert('Error', 'Failed to connect. The QR code may be invalid.');
      setScanned(false);
      setShowConfirm(false);
    } finally {
      setConnecting(false);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <EmptyState icon="camera-outline" title="Requesting camera permission" />
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Connect</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.center}>
          <EmptyState
            icon="camera-off-outline"
            title="Camera permission needed"
            message="Camera access is required to scan issuer QR codes."
            action={<AppButton label="Open Settings" variant="outline" onPress={() => Linking.openSettings()} />}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (connection) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Connect</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.center}>
          <View style={[styles.successCard, shadows.md]}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={40} color={theme.success} />
            </View>
            <Text style={styles.successTitle}>Connected!</Text>
            <Text style={styles.successText}>
              You are now connected to {connection.issuerName || 'the issuer'}. You can receive credentials from this connection.
            </Text>
            <AppButton label="Done" onPress={() => router.back()} fullWidth size="lg" style={{ marginTop: spacing.lg }} />
            <AppButton
              label="Scan another"
              variant="ghost"
              onPress={() => { setConnection(null); setScanned(false); }}
              fullWidth
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.scannerSection}>
        <View style={styles.scannerFrame}>
          <BarCodeScanner onBarCodeScanned={handleScan} style={StyleSheet.absoluteFillObject} />
          <View style={styles.scanOverlay} pointerEvents="none">
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
        </View>
        <Text style={styles.instruction}>
          Point the camera at the issuer’s invitation QR code to establish a secure connection.
        </Text>
      </View>

      <Modal visible={showConfirm} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <Ionicons name="qr-code" size={32} color={theme.primary} />
            </View>
            <Text style={styles.confirmTitle}>Connection Invitation</Text>
            <Text style={styles.confirmText}>
              An issuer wants to connect with your wallet. This creates a secure, pairwise connection for credential exchange.
            </Text>
            <View style={styles.confirmActions}>
              <AppButton
                label="Cancel"
                variant="secondary"
                onPress={() => { setShowConfirm(false); setScanned(false); }}
                style={{ flex: 1 }}
              />
              <AppButton label="Accept" onPress={handleAccept} loading={connecting} style={{ flex: 1 }} />
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
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg },
  scannerSection: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  scannerFrame: {
    height: 300,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface[900],
    position: 'relative',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerTL: { position: 'absolute', top: 20, left: 20, width: 28, height: 28, borderLeftWidth: 3, borderTopWidth: 3, borderColor: '#fff' },
  cornerTR: { position: 'absolute', top: 20, right: 20, width: 28, height: 28, borderRightWidth: 3, borderTopWidth: 3, borderColor: '#fff' },
  cornerBL: { position: 'absolute', bottom: 20, left: 20, width: 28, height: 28, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: '#fff' },
  cornerBR: { position: 'absolute', bottom: 20, right: 20, width: 28, height: 28, borderRightWidth: 3, borderBottomWidth: 3, borderColor: '#fff' },
  instruction: {
    fontSize: typography.sm,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  confirmCard: {
    backgroundColor: theme.surface,
    borderRadius: radii['2xl'],
    padding: spacing.xl,
    alignItems: 'center',
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  confirmTitle: { fontSize: typography.lg, fontWeight: typography.bold, color: theme.text },
  confirmText: { fontSize: typography.sm, color: theme.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
  confirmActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, width: '100%' },
  successCard: {
    backgroundColor: theme.surface,
    borderRadius: radii['2xl'],
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: theme.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successTitle: { fontSize: typography.xl, fontWeight: typography.bold, color: theme.text },
  successText: { fontSize: typography.sm, color: theme.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
});
