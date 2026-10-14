import { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button, Table, Tbody, Tr, Th, Td, Icon } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { useNavigate } from 'react-router-dom';
import { t } from '@did-workers/i18n';

export function ProofRequestList() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const reqs = await engine.getVerificationRequests();
      setRequests(reqs);
      setLoading(false);
    };
    load();
  }, [engine]);

  return (
    <div>
      <PageHeader
        title={t('verifierPortal.proofRequests') || 'Active Verification Requests'}
        description={t('verifierPortal.proofRequestsDesc') || 'Monitor the status of verification requests'}
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
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="scan-line" size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No active verification requests</p>
            <Button className="mt-4" onClick={() => navigate('/verifier/create')}>
              <Icon name="plus" size={16} className="mr-2" />
              Create New Request
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Policy</th>
                  <th>Verifier</th>
                  <th>Mechanism</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <Tbody>
                {requests.map(req => (
                  <Tr key={req.id}>
                    <Td className="font-mono text-xs">{req.id}</Td>
                    <Td>{req.proofRequest.name}</Td>
                    <Td>{req.verifierName}</Td>
                    <Td><Badge variant={req.mechanism === 'A' ? 'primary' : 'warning'} size="sm">{req.mechanism === 'A' ? 'Accumulator' : 'Status List'}</Badge></Td>
                    <Td>
                      <Badge
                        variant={req.status === 'completed' ? 'success' : req.status === 'pending' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {req.status}
                      </Badge>
                    </Td>
                    <Td className="text-surface-500 whitespace-nowrap">{new Date(req.expiresAt).toLocaleString()}</Td>
                    <Td className="text-surface-500 whitespace-nowrap">{new Date(req.expiresAt).toLocaleTimeString()}</Td>
                    <Td>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/verifier/result/${req.id}`)}>
                        View
                      </Button>
                    </Td>
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