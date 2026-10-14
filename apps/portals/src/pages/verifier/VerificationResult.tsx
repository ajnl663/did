import { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button, Table, Tbody, Tr, Th, Td, Icon, Alert, QRDisplay } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { useNavigate, useParams } from 'react-router-dom';
import { t } from '@did-workers/i18n';

export function VerificationResult() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const engine = useCredentialEngine();
  const [result, setResult] = useState<any>(null);
  const [presentation, setPresentation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const vr = await engine.getVerificationResult(id);
        setResult(vr);
        // Mock presentation data
        setPresentation({
          revealedAttributes: { scheme_code: 'BOCW', eligibility_status: 'eligible', trade: 'Masonry' },
          predicates: { 'pred_0': true },
        });
      } catch (e) {
        setError('Failed to load verification result');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [engine, id]);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error) return <div className="p-12 text-center text-danger-600">{error}</div>;
  if (!result) return <div className="p-12 text-center text-surface-500">Verification not found</div>;

  const isValid = result.result === 'VALID';
  const isStale = result.result === 'STALE';

  return (
    <div>
      <PageHeader
        title={t('verifierPortal.verificationResult') || 'Verification Result'}
        description={t('verifierPortal.verificationResultDesc') || 'Result of the verification request'}
        action={
          <Button variant="outline" onClick={() => navigate('/verifier/dashboard')}>
            <Icon name="arrow-left" size={16} />
            Back
          </Button>
        }
      />

      <div className="max-w-3xl">
        <Card variant="elevated" padding="lg" className="mb-6 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isValid ? 'bg-success-50' : isStale ? 'bg-warning-50' : 'bg-danger-50'
          }`}>
            <Icon
              name={isValid ? 'check-circle' : isStale ? 'clock' : 'x-circle'}
              size={48}
              className={isValid ? 'text-success-600' : isStale ? 'text-warning-600' : 'text-danger-600'}
            />
          </div>
          <h2 className={`text-3xl font-bold ${isValid ? 'text-success-700' : isStale ? 'text-warning-700' : 'text-danger-700'}`}>
            {result.result}
          </h2>
          {isStale && <Badge variant="warning" size="lg" className="mt-2">Stale Data - Flagged</Badge>}
          <p className="text-surface-500 mt-2">Request ID: <code className="font-mono text-sm">{id}</code></p>
        </Card>

        {result.reasonCodes && result.reasonCodes.length > 0 && (
          <Card variant="elevated" padding="lg" className="mb-6">
            <h3 className="font-medium mb-3">Reason Codes</h3>
            <div className="flex flex-wrap gap-2">
              {result.reasonCodes.map((code: string, i: number) => (
                <Badge key={i} variant={code === 'OK' ? 'success' : code.includes('STALE') ? 'warning' : 'danger'} size="sm">
                  {code}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {presentation && (
          <Card variant="elevated" padding="lg" className="mb-6">
            <h3 className="font-medium mb-4">Presented Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-surface-500 mb-2">Revealed Attributes</h4>
                <dl className="space-y-2 text-sm">
                  {Object.entries(presentation.revealedAttributes).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b border-surface-200">
                      <dt className="text-surface-500">{k.replace(/_/g, ' ')}</dt>
                      <dd className="font-medium">{v as string}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h4 className="text-sm font-medium text-surface-500 mb-2">Predicate Proofs</h4>
                <dl className="space-y-2 text-sm">
                  {Object.entries(presentation.predicates).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b border-surface-200">
                      <dt className="text-surface-500">{k}</dt>
                      <dd>
                        <Badge variant={v ? 'success' : 'danger'} size="sm">
                          {v ? 'Proven' : 'Failed'}
                        </Badge>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Card>
        )}

        <Card variant="elevated" padding="lg">
          <h3 className="font-medium mb-4">Verification Metadata</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-surface-500">Checked At</dt>
            <dd>{new Date(result.checkedAt).toLocaleString()}</dd>
            <dt className="text-surface-500">Staleness</dt>
            <dd>{result.stalenessSeconds || 0} seconds</dd>
            <dt className="text-surface-500">Verification ID</dt>
            <dd className="font-mono text-xs break-all">{result.id}</dd>
          </dl>
        </Card>
      </div>
    </div>
  );
}