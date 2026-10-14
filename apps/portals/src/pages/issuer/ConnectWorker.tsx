import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, Input, QRDisplay, Badge, StatusBadge, FormField, Select, Alert } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

export function ConnectWorker() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [connection, setConnection] = useState<any>(null);
  const [qrData, setQrData] = useState('');
  const [status, setStatus] = useState<'idle' | 'invited' | 'connected'>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createInvitation = async () => {
    setLoading(true);
    setError('');
    try {
      const inv = await engine.createProofRequest('employer_workexp_v1'); // Using as mock
      // Mock invitation
      const mockQr = `didcomm://invitation?c_i=${btoa(JSON.stringify({
        '@type': 'didcomm/connection/invitation',
        id: `inv-${Date.now()}`,
        label: 'Nirman NGO (demo)',
        recipients: ['did:indy:workers-dev:ngo-nirman'],
      }))}`;
      setQrData(mockQr);
      setStatus('invited');
      setConnection({ id: `conn-${Date.now()}`, state: 'invited' });
    } catch (e) {
      setError('Failed to create invitation');
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    if (!connection) return;
    // Mock: simulate connection after 2 seconds
    setTimeout(() => {
      setStatus('connected');
      setConnection({ ...connection, state: 'connected' });
    }, 2000);
  };

  return (
    <div>
      <PageHeader
        title={t('issuer.connectWorker') || 'Connect Worker'}
        description={t('issuer.connectWorkerDesc') || 'Generate a QR code for the worker to scan and establish a secure connection'}
        action={
          <Button variant="outline" onClick={() => navigate('/issuer/dashboard')}>
            <Icon name="arrow-left" size={16} />
            Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-semibold mb-6">Connection Invitation</h3>

          {status === 'idle' && (
            <div className="text-center py-12">
              <Icon name="scan-line" size={48} className="text-surface-300 mx-auto mb-4" />
              <p className="text-surface-500 mb-6">Click below to generate a connection invitation QR code</p>
              <Button onClick={createInvitation} loading={loading} size="lg">
                <Icon name="qr-code" size={18} className="mr-2" />
                Generate Invitation
              </Button>
            </div>
          )}

          {status === 'invited' && (
            <div className="space-y-6">
              <div className="text-center">
                <QRDisplay data={qrData} size={256} />
                <p className="mt-4 text-sm text-surface-500">Worker scans this QR with their wallet app</p>
              </div>
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-warning-500 animate-pulse" />
                  <span className="text-sm font-medium text-primary-700">Waiting for worker to scan...</span>
                </div>
              </div>
              <Button variant="outline" fullWidth onClick={checkConnection}>
                <Icon name="refresh-cw" size={18} className="mr-2" />
                Check Connection Status
              </Button>
            </div>
          )}

          {status === 'connected' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
                <Icon name="check-circle" size={32} className="text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-success-700">Connected!</h3>
              <p className="text-surface-500 mt-2">Worker is now connected. You can issue credentials.</p>
              <div className="mt-6 flex gap-3 justify-center">
                <Button onClick={() => navigate('/issuer/issue')}>
                  <Icon name="id-card" size={18} className="mr-2" />
                  Issue Credential
                </Button>
                <Button variant="outline" onClick={() => { setStatus('idle'); setConnection(null); setQrData(''); }}>
                  New Connection
                </Button>
              </div>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-semibold mb-6">Connection Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-surface-500 uppercase tracking-wide">Status</label>
              <div className="mt-1">
                <StatusBadge status={status === 'connected' ? 'valid' : status === 'invited' ? 'pending' : 'offline'} size="lg" />
              </div>
            </div>
            {connection && (
              <div>
                <label className="text-xs text-surface-500 uppercase tracking-wide">Connection ID</label>
                <p className="font-mono text-sm text-surface-900 mt-1 break-all">{connection.id}</p>
              </div>
            )}
            <div>
              <label className="text-xs text-surface-500 uppercase tracking-wide">Issuer</label>
              <p className="font-medium mt-1">Nirman NGO (demo)</p>
            </div>
            <div className="pt-4 border-t border-surface-200">
              <h4 className="text-sm font-medium mb-3">Next Steps</h4>
              <ul className="text-sm text-surface-600 space-y-2">
                <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-success-500" />Worker scans QR code</li>
                <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-success-500" />Pairwise DID connection established</li>
                <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-success-500" />Issue credentials via connection</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}