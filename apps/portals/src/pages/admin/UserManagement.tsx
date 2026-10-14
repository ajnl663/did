import { PageHeader, Card, Badge, Button, Table, Tbody, Tr, Th, Td, Icon, Modal } from '@did-workers/design-system';
import { t } from '@did-workers/i18n';

export function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const users = [
    { id: 'user-1', name: 'Admin User', email: 'admin@consortium.gov', roles: ['system_admin'], org: 'Consortium Governance', status: 'active' },
    { id: 'user-2', name: 'Priya Sharma', email: 'priya@nirman-ngo.org', roles: ['issuer_admin', 'issuer_operator'], org: 'Nirman NGO (demo)', status: 'active' },
    { id: 'user-3', name: 'Rajesh Verma', email: 'rajesh@welfare-bandra.gov', roles: ['verifier_operator'], org: 'Welfare Desk - Bandra (demo)', status: 'active' },
    { id: 'user-4', name: 'Governance Admin', email: 'governance@consortium.gov', roles: ['governance_admin'], org: 'Consortium Governance', status: 'active' },
    { id: 'user-5', name: 'Auditor One', email: 'auditor@consortium.gov', roles: ['auditor'], org: 'Consortium Governance', status: 'active' },
  ];

  const allRoles = ['system_admin', 'governance_admin', 'issuer_admin', 'issuer_operator', 'verifier_operator', 'auditor'];

  return (
    <div>
      <PageHeader
        title={t('admin.users') || 'Users & Roles'}
        description={t('admin.usersDesc') || 'Manage user accounts and role assignments'}
        action={
          <Button onClick={() => { setEditingUser(null); setShowModal(true); }}>
            <Icon name="plus" size={18} />
            Add User
          </Button>
        }
      />

      <Card variant="elevated" padding="none">
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Roles</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user.id}>
                  <Td className="font-medium">{user.name}</Td>
                  <Td className="text-surface-500">{user.email}</Td>
                  <Td>{user.org}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => (
                        <Badge key={role} variant="outline" size="sm">{role}</Badge>
                      ))}
                    </div>
                  </Td>
                  <Td><Badge variant={user.status === 'active' ? 'success' : 'warning'} size="sm">{user.status}</Badge></Td>
                  <Td>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingUser(user); setShowModal(true); }}>
                      <Icon name="edit" size={16} />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </Card>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingUser(null); }} title={editingUser ? 'Edit User' : 'Add User'} size="lg">
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" defaultValue={editingUser?.name || ''} className="w-full px-4 py-3 rounded-xl border border-surface-300" />
            <input type="email" placeholder="Email" defaultValue={editingUser?.email || ''} className="w-full px-4 py-3 rounded-xl border border-surface-300" />
            <input type="text" placeholder="Organization" defaultValue={editingUser?.org || ''} className="w-full px-4 py-3 rounded-xl border border-surface-300" />
            <div>
              <label className="block text-sm font-medium mb-2">Roles</label>
              <div className="flex flex-wrap gap-2">
                {allRoles.map(role => (
                  <label key={role} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={editingUser?.roles.includes(role)}
                      className="rounded border-surface-300"
                    />
                    <span className="text-sm">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setShowModal(false); setEditingUser(null); }}>Cancel</Button>
              <Button onClick={() => { setShowModal(false); setEditingUser(null); }}>
                {editingUser ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState } from 'react';