import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Badge, Button, Table, Tbody, Tr, Th, Td, Icon, Modal } from '@did-workers/design-system';
import { t } from '@did-workers/i18n';

export function DelegatedIssuers() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const issuers = [
    { id: 'issuer-1', name: 'Site Contractors Pvt Ltd', tier: 3, did: 'did:indy:workers-dev:contractor-site', status: 'active', schemas: ['work_history', 'skill'], parent: 'Nirman NGO' },
    { id: 'issuer-2', name: 'BuildRight Constructions', tier: 3, did: 'did:indy:workers-dev:buildright', status: 'pending', schemas: ['work_history'], parent: 'Nirman NGO' },
  ];

  return (
    <div>
      <PageHeader
        title={t('issuer.delegatedIssuers') || 'Delegated Issuers'}
        description={t('issuer.delegatedIssuersDesc') || 'Manage Tier 3 issuers delegated by your organization'}
        action={
          <Button onClick={() => setShowModal(true)}>
            <Icon name="plus" size={18} />
            Accredit New Issuer
          </Button>
        }
      />

      <Card variant="elevated" padding="none">
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Tier</th>
                <th>DID</th>
                <th>Status</th>
                <th>Authorized Schemas</th>
                <th>Actions</th>
              </tr>
            </thead>
            <Tbody>
              {issuers.map(issuer => (
                <Tr key={issuer.id}>
                  <Td className="font-medium">{issuer.name}</Td>
                  <Td><Badge variant="warning" size="sm">Tier {issuer.tier}</Badge></Td>
                  <Td className="font-mono text-xs">{issuer.did}</Td>
                  <Td><Badge variant={issuer.status === 'active' ? 'success' : 'warning'} size="sm">{issuer.status}</Badge></Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {issuer.schemas.map(s => (
                        <Badge key={s} variant="outline" size="sm">{s.replace('_', ' ')}</Badge>
                      ))}
                    </div>
                  </Td>
                  <Td>
                    <Button variant="ghost" size="sm">View</Button>
                    {issuer.status === 'active' && (
                      <Button variant="ghost" size="sm" className="text-danger-600 hover:bg-danger-50">Revoke</Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </Card>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Accredit New Issuer" size="lg">
          <div className="space-y-4">
            <p className="text-surface-600">This creates a Tier 3 accreditation credential for a new delegated issuer.</p>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Organization Name" className="px-4 py-3 rounded-xl border border-surface-300" />
              <input type="text" placeholder="DID (did:indy:...)" className="px-4 py-3 rounded-xl border border-surface-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Authorized Schemas</label>
              <div className="flex flex-wrap gap-2">
                {['work_history', 'skill', 'identity_verification'].map(s => (
                  <label key={s} className="inline-flex items-center gap-2">
                    <input type="checkbox" className="rounded border-surface-300" />
                    <span>{s.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={() => setShowModal(false)}>Accredit Issuer</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}