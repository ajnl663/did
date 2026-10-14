import { PageHeader, Card, Button, Badge, Table, Tbody, Tr, Th, Td, Icon, Modal } from '@did-workers/design-system';
import { useNavigate } from 'react-router-dom';
import { t } from '@did-workers/i18n';

export function StaffManagement() {
  const navigate = useNavigate();

  const staff = [
    { id: 'staff-1', name: 'Priya Sharma', email: 'priya@nirman-ngo.org', role: 'Issuer Admin', status: 'active', lastLogin: '2 hours ago' },
    { id: 'staff-2', name: 'Rajesh Kumar', email: 'rajesh@nirman-ngo.org', role: 'Issuer Operator', status: 'active', lastLogin: '1 day ago' },
    { id: 'staff-3', name: 'Anita Desai', email: 'anita@nirman-ngo.org', role: 'Issuer Operator', status: 'inactive', lastLogin: '30 days ago' },
  ];

  return (
    <div>
      <PageHeader
        title={t('issuer.staff') || 'Staff Management'}
        description={t('issuer.staffDesc') || 'Manage staff members and their roles'}
        action={
          <Button onClick={() => {}}>
            <Icon name="plus" size={18} />
            Add Staff
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
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <Tbody>
              {staff.map(member => (
                <Tr key={member.id}>
                  <Td className="font-medium">{member.name}</Td>
                  <Td className="text-surface-500">{member.email}</Td>
                  <Td><Badge variant={member.role === 'Issuer Admin' ? 'primary' : 'default'} size="sm">{member.role}</Badge></Td>
                  <Td><Badge variant={member.status === 'active' ? 'success' : 'warning'} size="sm">{member.status}</Badge></Td>
                  <Td className="text-surface-500">{member.lastLogin}</Td>
                  <Td>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
}