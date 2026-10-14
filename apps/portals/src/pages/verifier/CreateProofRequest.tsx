import { useState } from 'react';
import { PageHeader, Card, Button, Badge, FormField, Select, Alert, QRDisplay, Icon } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { useNavigate } from 'react-router-dom';
import { t } from '@did-workers/i18n';

const policyTemplates = [
  { id: 'welfare_desk_workhistory_v1', label: 'Welfare Eligibility (BOCW)', type: 'welfare_eligibility', desc: 'Verify BOCW eligibility with 60+ months continuous work' },
  { id: 'employer_workexp_v1', label: 'Work Experience (3+ years)', type: 'work_history', desc: 'Verify 36+ months of work experience in masonry' },
  { id: 'skill_verification_v1', label: 'Skill Level (Level 3+)', type: 'skill', desc: 'Verify skill credential at level 3 or higher' },
  { id: 'age_verification_v1', label: 'Age Verification (18+)', type: 'identity_verification', desc: 'Verify holder is 18 or older' },
];

export function CreateProofRequest() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [selectedPolicy, setSelectedPolicy] = useState(policyTemplates[0].id);
  const [request, setRequest] = useState<any>(null);
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const policy = policyTemplates.find(p => p.id === selectedPolicy);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const vr = await engine.createVerificationRequest(selectedPolicy);
      setRequest(vr);
      const qr = await engine.generateRequestQR(vr);
      setQrData(qr);
    } catch (e) {
      setError('Failed to create verification request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t('verifierPortal.createProofRequest') || 'Create Verification Request'}
        description={t('verifierPortal.createProofRequestDesc') || 'Select a policy template and generate a QR code for the holder to scan'}
        action={
          <Button variant="outline" onClick={() => navigate('/verifier/dashboard')}>
            <Icon name="arrow-left" size={16} />
            Back
          </Button>
        }
      />

      <div className="max-w-3xl">
        <Card variant="elevated" padding="lg" className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Policy Template</h3>
          <div className="space-y-3">
            {policyTemplates.map(p => (
              <label
                key={p.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPolicy === p.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-surface-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="policy"
                  value={p.id}
                  checked={selectedPolicy === p.id}
                  onChange={() => setSelectedPolicy(p.id)}
                  className="w-5 h-5 text-primary-600"
                />
                <div className="flex-1">
                  <p className="font-medium">{p.label}</p>
                  <p className="text-sm text-surface-500">{p.desc}</p>
                </div>
                <Badge variant={p.type === 'welfare_eligibility' ? 'success' : p.type === 'work_history' ? 'primary' : 'warning'} size="sm">
                  {p.type.replace('_', ' ')}
                </Badge>
              </label>
            ))}
          </div>

          <Button onClick={handleCreate} loading={loading} size="lg" className="mt-6 w-full">
            <Icon name="qr-code" size={18} className="mr-2" />
            Generate Verification Request
          </Button>

          {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
        </Card>

        {request && qrData && (
          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-semibold mb-4">Verification Request Ready</h3>
            <div className="text-center mb-6">
              <QRDisplay data={qrData} size={256} />
              <p className="mt-4 text-sm text-surface-500">Holder scans this QR with their wallet</p>
            </div>

            <div className="p-4 bg-surface-50 rounded-xl border border-surface-200 mb-4">
              <h4 className="font-medium mb-2">Request Details</h4>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <dt className="text-surface-500">Request ID</dt>
                <dd className="font-mono text-xs break-all">{request.id}</dd>
                <dt className="text-surface-500">Policy</dt>
                <dd>{policy?.label}</dd>
                <dt className="text-surface-500">Nonce</dt>
                <dd className="font-mono text-xs">{request.nonce}</dd>
                <dt className="text-surface-500">Mechanism</dt>
                <dd>{request.mechanism === 'A' ? 'AnonCreds Accumulator' : 'Signed Status List'}</dd>
                <dt className="text-surface-500">Expires</dt>
                <dd>{new Date(request.expiresAt).toLocaleTimeString()}</dd>
              </dl>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setRequest(null); setQrData(''); }}>
                <Icon name="x" size={16} className="mr-2" />
                Create New
              </Button>
              <Button onClick={() => navigate(`/verifier/result/${request.id}`)}>
                <Icon name="check-circle" size={16} className="mr-2" />
                Check Result
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}