import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Badge, Button, Icon, StatCard, StatusBadge } from '@did-workers/design-system';
import { useCredentialEngine } from '../../context/CredentialEngineContext';
import { t } from '@did-workers/i18n';
import type { Credential } from '@did-workers/credential-engine';

export function IssuerDashboard() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [stats, setStats] = useState<{ label: string; value: string | number; icon: string; color: 'primary' | 'success' | 'warning' | 'danger' }[]>([]);
  const [recentCredentials, setRecentCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [creds] = await Promise.all([
        engine.getCredentials(),
      ]);
      setStats([
        { label: 'Credentials Issued', value: creds.length, icon: 'file-text', color: 'primary' },
        { label: 'Active Connections', value: 3, icon: 'users', color: 'success' },
        { label: 'Pending Offers', value: 1, icon: 'id-card', color: 'warning' },
        { label: 'Revoked', value: creds.filter(c => c.status === 'revoked').length, icon: 'shield-x', color: 'danger' },
      ]);
      setRecentCredentials(creds.slice(0, 5));
      setLoading(false);
    };
    loadData();
  }, [engine]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="loader" size={28} className="text-primary-500" />
      </div>
    );
  }

  const quickActions = [
    { label: 'Connect New Worker', icon: 'user', path: '/issuer/connect' },
    { label: 'Issue Single Credential', icon: 'id-card', path: '/issuer/issue' },
    { label: 'Bulk Issue from CSV', icon: 'list-check', path: '/issuer/bulk' },
    { label: 'View Audit Trail', icon: 'clipboard', path: '/issuer/audit' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your credential issuance activity"
        action={
          <Button onClick={() => navigate('/issuer/issue')}>
            <Icon name="plus" size={18} />
            Issue Credential
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent credentials — spans 2 columns */}
        <Card variant="elevated" padding="none" className="lg:col-span-2">
          <div className="card-header">
            <h3 className="card-title">Recent Credentials</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/issuer/credentials')}>
              View all
              <Icon name="chevron-right" size={16} />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Worker</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Issued</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {recentCredentials.map(cred => (
                  <tr key={cred.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-surface-800">
                      {cred.attributes.full_name || cred.holderDid.slice(0, 16) + '...'}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-surface-600">
                      {cred.schemaId.replace(/_/g, ' ')}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge
                        status={cred.status === 'valid' ? 'valid' : cred.status === 'revoked' ? 'revoked' : 'expired'}
                        size="sm"
                      />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-surface-500">
                      {new Date(cred.issuedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentCredentials.length === 0 && (
            <div className="empty-state py-12">
              <Icon name="file-text" size={32} className="text-surface-300 mb-3" />
              <p className="text-surface-500 text-sm">No credentials issued yet</p>
            </div>
          )}
        </Card>

        {/* Quick actions */}
        <Card variant="elevated" padding="none">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="p-3">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-surface-700 hover:bg-surface-50 hover:text-primary-700 transition-all duration-150 group"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                  <Icon name={action.icon} size={18} className="text-surface-500 group-hover:text-primary-600 transition-colors" />
                </div>
                <span className="flex-1 text-left">{action.label}</span>
                <Icon name="chevron-right" size={16} className="text-surface-300 group-hover:text-primary-500 transition-colors" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
