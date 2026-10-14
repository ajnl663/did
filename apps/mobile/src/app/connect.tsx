import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCredentialEngine } from '../context/CredentialEngineContext';
import { t } from '@did-workers/i18n';
import { BarCodeScanner } from 'expo-barcode-scanner';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#171717' },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  scannerContainer: { width: '100%', height: 300, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  scanner: { flex: 1 },
  instruction: { fontSize: 16, color: '#737373', textAlign: 'center', marginBottom: 24, lineHeight: 24 },
  button: { backgroundColor: '#0ea5e9', paddingVertical: 16, borderRadius: 12, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  buttonSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e5e5', marginTop: 12 },
  buttonSecondaryText: { color: '#0ea5e9' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center' },
  modalIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#171717', marginBottom: 8 },
  modalText: { fontSize: 16, color: '#737373', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#f5f5f5' },
  modalButtonConfirm: { backgroundColor: '#0ea5e9' },
  modalButtonText: { color: '#fff', fontWeight: '600' },
  modalButtonCancelText: { color: '#171717' },
  connectedCard: { backgroundColor: '#f0fdf4', borderWidth: 2, borderColor: '#22c55e', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  connectedIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  connectedTitle: { fontSize: 20, fontWeight: '700', color: '#166534', marginBottom: 8 },
  connectedText: { fontSize: 16, color: '#6b7280', textAlign: 'center' },
});

export default function ConnectScreen() {
  const router = useRouter();
  const engine = useCredentialEngine();
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [connection, setConnection] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    setScannedData(data);
    setShowConfirm(true);
  };

  const handleAccept = async () => {
    try {
      const conn = await engine.scanInvitation(scannedData);
      setConnection(conn);
      setShowConfirm(false);
      Alert.alert('Connected!', `Connected to ${conn.issuerName || 'Issuer'}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to connect');
    }
  };

  if (hasPermission === null) {
    return <SafeAreaView style={styles.container}><View style={styles.content}><Text>Requesting camera permission...</Text></View></SafeAreaView>;
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={{ textAlign: 'center', color: '#737373' }}>Camera permission is required to scan QR codes.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (connection) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Connect Worker</Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.connectedCard}>
            <View style={styles.connectedIcon}>
              <Ionicons name="checkmark" size={40} color="#22c55e" />
            </View>
            <Text style={styles.connectedTitle}>Connected Successfully!</Text>
            <Text style={styles.connectedText}>
              You are now connected to {connection.issuerName || 'Issuer'}.
              You can receive credentials from this issuer.
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => { setConnection(null); setScanned(false); }}>
            <Text style={styles.buttonSecondaryText}>Connect Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Connect Worker</Text>
        </View>
      </View>
      <View style={styles.content}>
        {!scanned && hasPermission && (
          <>
            <View style={styles.scannerContainer}>
              <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={styles.scanner}
              />
            </View>
            <Text style={styles.instruction}>
              Point camera at the issuer's invitation QR code to establish a secure connection.
            </Text>
          </>
        )}

        <Modal visible={showConfirm} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalIcon}>
                <Ionicons name="qr-code" size={40} color="#0ea5e9" />
              </View>
              <Text style={styles.modalTitle}>Connection Invitation</Text>
              <Text style={styles.modalText}>
                An issuer wants to connect with your wallet. This creates a secure pairwise connection for credential exchange.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButtonCancel} onPress={() => { setShowConfirm(false); setScanned(false); }}>
                  <Text style={styles.modalButtonCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleAccept}>
                  <Text style={styles.modalButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}