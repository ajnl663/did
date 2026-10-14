import { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button, Table, Tbody, Tr, Th, Td, Icon, Modal } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

export function IssuerRegistry() {
  const engine = useCredentialEngine();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showOnboard, setShowOnboard] = useState(false);

  useEffect(() => {
    const load = async () => {
      const organizations = await engine.getOrganizations();
      setOrgs(organizations);
      setLoading(false);
    };
    load();
  }, [engine]);

  return (
    <div>
      <PageHeader
        title={t('admin.issuerRegistry') || 'Issuer Registry'}
        description={t('admin.issuerRegistryDesc') || 'View and manage all registered issuers in the consortium'}
      />

      <Card variant="elevated" padding="none">
        <div className="p-6 border-b border-surface-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Registered Issuers ({orgs.length})</h3>
          <Button onClick={() => setShowOnboard(true)}>
            <Icon name="plus" size={18} className="mr-2" />
            Onboard Issuer
          </Button>
        </div>
        {loading ? (
          <div className="p-12 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tier</th>
                  <th>DID</th>
                  <th>Status</th>
                  <th>Parent</th>
                  <th>Authorized Schemas</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <Tbody>
                {orgs.map(org => (
                  <Tr key={org.id} onClick={() => setSelectedOrg(org)} className="cursor-pointer hover:bg-surface-50">
                    <Td className="font-medium">{org.name}</Td>
                    <Td><Badge variant={org.tier === 1 ? 'primary' : org.tier === 2 ? 'warning' : 'success'} size="sm">Tier {org.tier}</Badge></Td>
                    <Td className="font-mono text-xs">{org.did}</Td>
                    <Td><Badge variant={org.status === 'active' ? 'success' : org.status === 'pending' ? 'warning' : 'danger'} size="sm">{org.status}</Badge></Td>
                    <Td>{org.parentOrgId ? org.parentOrgId : '—'}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        {org.allowedSchemaIds.map((s: string) => (
                          <Badge key={s} variant="outline" size="sm">{s.replace('_', ' ')}</Badge>
                        ))}
                      </div>
                    </Td>
                    <Td>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedOrg(org); }}>
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

      {selectedOrg && (
        <Modal isOpen={!!selectedOrg} onClose={() => setSelectedOrg(null)} title="Issuer Details" size="lg">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt className="text-surface-500">Name</dt>
            <dd className="font-medium">{selectedOrg.name}</dd>
            <dt className="text-surface-500">Tier</dt>
            <dd><Badge variant={selectedOrg.tier === 1 ? 'primary' : selectedOrg.tier === 2 ? 'warning' : 'success'} size="sm">Tier {selectedOrg.tier}</Badge></dd>
            <dt className="text-surface-500">DID</dt>
            <dd className="font-mono text-xs break-all">{selectedOrg.did}</dd>
            <dt className="text-surface-500">Status</dt>
            <dd><Badge variant={selectedOrg.status === 'active' ? 'success' : 'warning'} size="sm">{selectedOrg.status}</Badge></dd>
            <dt className="text-surface-500">Parent Org</dt>
            <dd>{selectedOrg.parentOrgId || 'Root (Tier 1)'}</dd>
            <dt className="text-surface-500">Created</dt>
            <dd>{new Date(selectedOrg.createdAt).toLocaleDateString()}</dd>
            <dt className="text-surface-500">Authorized Schemas</dt>
            <dd className="col-span-2">
              <div className="flex flex-wrap gap-1">
                {selectedOrg.allowedSchemaIds.map((s: string) => (
                  <Badge key={s} variant="outline" size="sm">{s.replace('_', ' ')}</Badge>
                ))}
              </div>
            </dd>
          </dl>
        </Modal>
      )}

      {showOnboard && (
        <Modal isOpen={showOnboard} onClose={() => setShowOnboard(false)} title="Onboard New Issuer" size="lg">
          <div className="space-y-4">
            <input type="text" placeholder="Organization Name" className="w-full px-4 py-3 rounded-xl border border-surface-300" />
            <select className="w-full px-4 py-3 rounded-xl border border-surface-300">
              <option value="1">Tier 1 - Accredited Authority</option>
              <option value="2">Tier 2 - Accredited Issuer</option>
              <option value="3">Tier 3 - Delegated Issuer</option>
            </select>
            <input type="text" placeholder="DID (did:indy:...)" className="w-full px-4 py-3 rounded-xl border border-surface-300" />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowOnboard(false)}>Cancel</Button>
              <Button>Onboard Issuer</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}