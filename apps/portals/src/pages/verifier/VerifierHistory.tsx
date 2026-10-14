import { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button, Table, Tbody, Tr, Th, Td, Icon } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { useNavigate } from 'react-router-dom';
import { t } from '@did-workers/i18n';

export function VerifierHistory() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const evts = await engine.getVerificationEvents();
      setEvents(evts);
      setLoading(false);
    };
    load();
  }, [engine]);

  return (
    <div>
      <PageHeader
        title={t('verifierPortal.history') || 'Verification History'}
        description={t('verifierPortal.historyDesc') || 'View historical verification events'}
        action={
          <Button variant="outline" onClick={() => navigate('/verifier/dashboard')}>
            <Icon name="arrow-left" size={16} />
            Back
          </Button>
        }
      />

      <Card variant="elevated" padding="none">
        {loading ? (
          <div className="p-12 text-center">Loading...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="history" size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No verification history yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Mode</th>
                  <th>Credential Types</th>
                  <th>Issuer</th>
                  <th>Result</th>
                  <th>Reason</th>
                  <th>Staleness</th>
                </tr>
              </thead>
              <Tbody>
                {events.map(evt => (
                  <Tr key={evt.id}>
                    <Td className="whitespace-nowrap">{new Date(evt.occurredAt).toLocaleString()}</Td>
                    <Td><Badge variant={evt.mode === 'online' ? 'primary' : 'warning'} size="sm">{evt.mode}</Badge></Td>
                    <Td>{evt.credentialTypes.join(', ')}</Td>
                    <Td className="font-mono text-xs">{evt.issuerDid.slice(0, 30)}...</Td>
                    <Td>
                      <Badge
                        variant={evt.result === 'VALID' ? 'success' : evt.result === 'STALE' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {evt.result}
                      </Badge>
                    </Td>
                    <Td className="font-mono text-xs">{evt.reasonCode}</Td>
                    <Td className="text-surface-500">{evt.stalenessSeconds}s</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}