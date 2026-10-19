import { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button, Table, Tbody, Tr, Th, Td, Input, Select, Icon, Modal } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { useNavigate } from 'react-router-dom';
import { t } from '@did-workers/i18n';

export function IssuedCredentials() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCred, setSelectedCred] = useState<any>(null);
  const [showRevoke, setShowRevoke] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');

  useEffect(() => {
    const load = async () => {
      const creds = await engine.getCredentials();
      setCredentials(creds);
      setLoading(false);
    };
    load();
  }, [engine]);

  const filteredCreds = credentials.filter(c => {
    const matchesSearch = c.attributes.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.schemaId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesType = typeFilter === 'all' || c.schemaId === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRevoke = async () => {
    if (!selectedCred || !revokeReason.trim()) return;
    try {
      await engine.revokeCredential(selectedCred.id, revokeReason);
      setCredentials(prev => prev.map(c => c.id === selectedCred.id ? { ...c, status: 'revoked', revokedAt: new Date().toISOString(), revocationReason: revokeReason } : c));
      setShowRevoke(false);
      setRevokeReason('');
    } catch (e) {
      alert('Failed to revoke credential');
    }
  };

  return (
    <div>
      <PageHeader
        title={t('issuer.issuedCredentials') || 'Issued Credentials'}
        description={t('issuer.issuedCredentialsDesc') || 'View and manage all credentials issued by your organization'}
        action={
          <Button onClick={() => navigate('/issuer/issue')}>
            <Icon name="plus" size={18} />
            Issue New
          </Button>
        }
      />

      <Card variant="elevated" padding="lg" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search credentials..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            leftIcon={<Icon name="search" size={18} />}
          />
          <Select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'valid', label: 'Valid' },
              { value: 'revoked', label: 'Revoked' },
              { value: 'expired', label: 'Expired' },
            ]}
          />
          <Select
            value={typeFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'identity_verification', label: 'Identity Verification' },
              { value: 'work_history', label: 'Work History' },
              { value: 'skill', label: 'Skill' },
              { value: 'welfare_eligibility', label: 'Welfare Eligibility' },
            ]}
          />
          <div className="text-sm text-surface-500 flex items-center">
            {filteredCreds.length} of {credentials.length} credentials
          </div>
        </div>
      </Card>

      <Card variant="elevated" padding="none">
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th>Worker</th>
                <th>Type</th>
                <th>Key Attributes</th>
                <th>Status</th>
                <th>Issued</th>
                <th>Actions</th>
              </tr>
            </thead>
            <Tbody>
              {filteredCreds.map(cred => (
                <Tr key={cred.id}>
                  <Td className="font-medium">{cred.attributes.full_name || cred.holderDid.slice(0, 20)}</Td>
                  <Td><Badge variant="primary" size="sm">{cred.schemaId.replace('_', ' ')}</Badge></Td>
                  <Td className="max-w-xs truncate">
                    {cred.schemaId === 'work_history' && `${cred.attributes.trade} • ${cred.attributes.site_city}`}
                    {cred.schemaId === 'skill' && `${cred.attributes.skill_name} (L${cred.attributes.skill_level})`}
                    {cred.schemaId === 'identity_verification' && `${cred.attributes.full_name} • ${cred.attributes.home_state}`}
                    {cred.schemaId === 'welfare_eligibility' && `${cred.attributes.scheme_code} • ${cred.attributes.eligibility_status}`}
                  </Td>
                  <Td>
                    <Badge
                      variant={cred.status === 'valid' ? 'success' : cred.status === 'revoked' ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {cred.status}
                    </Badge>
                  </Td>
                  <Td className="text-surface-500">{new Date(cred.issuedOn).toLocaleDateString()}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedCred(cred)}>
                        <Icon name="eye" size={16} />
                      </Button>
                      {cred.status === 'valid' && (
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedCred(cred); setShowRevoke(true); }}>
                          <Icon name="shield-x" size={16} className="text-danger-600" />
                        </Button>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
        {filteredCreds.length === 0 && (
          <div className="p-12 text-center">
            <Icon name="file-text" size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No credentials found</p>
          </div>
        )}
      </Card>

      {selectedCred && (
        <Modal isOpen={!!selectedCred} onClose={() => setSelectedCred(null)} title="Credential Details" size="lg">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt className="text-surface-500">Credential ID</dt>
            <dd className="font-mono text-xs break-all">{selectedCred.id}</dd>
            <dt className="text-surface-500">Type</dt>
            <dd><Badge variant="primary" size="sm">{selectedCred.schemaId.replace('_', ' ')}</Badge></dd>
            <dt className="text-surface-500">Status</dt>
            <dd><Badge variant={selectedCred.status === 'valid' ? 'success' : 'danger'} size="sm">{selectedCred.status}</Badge></dd>
            <dt className="text-surface-500">Issuer</dt>
            <dd>{selectedCred.issuerName}</dd>
            <dt className="text-surface-500">Issued</dt>
            <dd>{new Date(selectedCred.issuedOn).toLocaleString()}</dd>
            <dt className="text-surface-500">Holder DID</dt>
            <dd className="font-mono text-xs break-all">{selectedCred.holderDid}</dd>
            {selectedCred.status === 'revoked' && (
              <>
                <dt className="text-surface-500">Revoked At</dt>
                <dd>{new Date(selectedCred.revokedAt!).toLocaleString()}</dd>
                <dt className="text-surface-500">Reason</dt>
                <dd className="col-span-2">{selectedCred.revocationReason}</dd>
              </>
            )}
            <dt className="text-surface-500">Attributes</dt>
            <dd className="col-span-2">
              <div className="max-h-60 overflow-y-auto p-3 bg-surface-50 rounded-lg font-mono text-xs">
                {Object.entries(selectedCred.attributes).map(([k, v]) => (
                  <div key={k} className="py-1 border-b border-surface-200 last:border-0">
                    <span className="text-surface-500">{k}:</span> <span className="ml-2 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </dd>
          </dl>
        </Modal>
      )}

      {showRevoke && selectedCred && (
        <Modal isOpen={showRevoke} onClose={() => { setShowRevoke(false); setRevokeReason(''); }} title="Revoke Credential" size="md">
          <div className="space-y-4">
            <Alert variant="warning">
              This will permanently revoke the credential for <strong>{selectedCred.attributes.full_name || selectedCred.holderDid}</strong>.
              The worker will no longer be able to present this credential.
            </Alert>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Revocation Reason (required)</label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500"
                placeholder="Enter reason for revocation..."
                required
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setShowRevoke(false); setRevokeReason(''); }}>Cancel</Button>
              <Button variant="danger" onClick={handleRevoke} disabled={!revokeReason.trim()}>
                <Icon name="shield-x" size={16} className="mr-2" />
                Revoke Credential
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}