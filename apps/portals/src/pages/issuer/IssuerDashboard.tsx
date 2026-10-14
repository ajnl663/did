import { useEffect, useState } from 'react';
import { PageHeader, Card, Badge, Button, Icon, StatCard, Table } from '@did-workers/design-system';
import { useCredentialEngine } from '../../context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

interface Stat {
  label: string;
  value: string | number;
  change?: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}

export function IssuerDashboard() {
  const engine = useCredentialEngine();
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentCredentials, setRecentCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [creds, orgs] = await Promise.all([
        engine.getCredentials(),
        engine.getOrganizations(),
      ]);
      setStats([
        { label: t('issuer.issuedCredentials') || 'Credentials Issued', value: creds.length, icon: 'file-text', color: 'primary' },
        { label: t('issuer.activeConnections') || 'Active Connections', value: 3, icon: 'users', color: 'success' },
        { label: t('issuer.pendingOffers') || 'Pending Offers', value: 1, icon: 'id-card', color: 'warning' },
        { label: t('issuer.revokedCredentials') || 'Revoked', value: creds.filter(c => c.status === 'revoked').length, icon: 'shield-x', color: 'danger' },
      ]);
      setRecentCredentials(creds.slice(0, 5));
      setLoading(false);
    };
    loadData();
  }, [engine]);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div>
      <PageHeader
        title={t('issuer.dashboard') || 'Dashboard'}
        description={t('issuer.dashboardDesc') || 'Overview of your credential issuance activity'}
        action={
          <Button onClick={() => window.location.href = '/issuer/issue'}>
            <Icon name="plus" size={18} />
            Issue Credential
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} variant="elevated" padding="lg" className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-500">{stat.label}</p>
                <p className="text-3xl font-bold text-surface-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                <Icon name={stat.icon} size={24} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" padding="none">
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold">Recent Credentials</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Issued</th>
                </tr>
              </thead>
              <tbody>
                {recentCredentials.map(cred => (
                  <tr key={cred.id}>
                    <td className="font-medium">{cred.attributes.full_name || cred.holderDid.slice(0, 20)}</td>
                    <td>{cred.schemaId.replace('_', ' ')}</td>
                    <td><Badge variant={cred.status === 'valid' ? 'success' : cred.status === 'revoked' ? 'danger' : 'warning'} size="sm">{cred.status}</Badge></td>
                    <td className="text-surface-500">{new Date(cred.issuedOn).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="p-4 border-t border-surface-200">
            <Button variant="ghost" size="sm" fullWidth onClick={() => window.location.href = '/issuer/credentials'}>
              View All Credentials
            </Button>
          </div>
        </Card>

        <Card variant="elevated" padding="none">
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-3">
            <Button variant="outline" fullWidth onClick={() => window.location.href = '/issuer/connect'}>
              <Icon name="user" size={18} className="mr-2" />
              Connect New Worker
            </Button>
            <Button variant="outline" fullWidth onClick={() => window.location.href = '/issuer/issue'}>
              <Icon name="id-card" size={18} className="mr-2" />
              Issue Single Credential
            </Button>
            <Button variant="outline" fullWidth onClick={() => window.location.href = '/issuer/bulk'}>
              <Icon name="list-check" size={18} className="mr-2" />
              Bulk Issue from CSV
            </Button>
            <Button variant="outline" fullWidth onClick={() => window.location.href = '/issuer/audit'}>
              <Icon name="file-text" size={18} className="mr-2" />
              View Audit Trail
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}