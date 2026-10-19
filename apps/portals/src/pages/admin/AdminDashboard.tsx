import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Badge, Button, Icon, StatCard } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

export function AdminDashboard() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [stats, setStats] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [orgsData, bundle, events] = await Promise.all([
        engine.getOrganizations(),
        engine.getTrustBundle(),
        engine.getVerificationEvents(),
      ]);
      setOrgs(orgsData);
      setStats([
        { label: 'Total Issuers', value: orgsData.length, icon: 'users', color: 'primary' },
        { label: 'Active Issuers', value: orgsData.filter(o => o.status === 'active').length, icon: 'check-circle', color: 'success' },
        { label: 'Trust Bundle', value: bundle.version, icon: 'layers', color: 'primary' },
        { label: 'Verifications (24h)', value: events.filter(e => Date.now() - new Date(e.occurredAt).getTime() < 86400000).length, icon: 'activity', color: 'success' },
      ]);
      setLoading(false);
    };
    load();
  }, [engine]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="loader" size={28} className="text-primary-500" />
      </div>
    );
  }

  const quickActions = [
    { label: 'Onboard New Issuer', icon: 'user', path: '/admin/onboard' },
    { label: 'Accredit Issuer', icon: 'shield-check', path: '/admin/trust-chain' },
    { label: 'Publish Trust Bundle', icon: 'layers', path: '/admin/trust-bundle' },
    { label: 'View Monitoring', icon: 'activity', path: '/admin/monitoring' },
  ];

  const services = [
    { name: 'Indy Ledger', status: 'Healthy', detail: '4 nodes · 12ms avg' },
    { name: 'Trust Registry Service', status: 'Running', detail: 'API v2 · synced' },
    { name: 'Tails Server', status: 'Running', detail: '3 revocation registries' },
    { name: 'DIDComm Mediator', status: 'Running', detail: '8 active sessions' },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of the DID Workers consortium and system health"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card variant="elevated" padding="none" className="lg:col-span-2">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <h3 className="card-title">System Status</h3>
              <Badge variant="success" size="sm" dot>All Operational</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/monitoring')}>
              Details
              <Icon name="chevron-right" size={16} />
            </Button>
          </div>
          <div className="divide-y divide-surface-100">
            {services.map((svc, i) => (
              <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-surface-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-success-50 flex items-center justify-center">
                    <Icon name="server" size={18} className="text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-800 text-sm">{svc.name}</p>
                    <p className="text-xs text-surface-500">{svc.detail}</p>
                  </div>
                </div>
                <Badge variant="success" size="sm" dot>{svc.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
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

      {/* Recent Issuers */}
      <Card variant="elevated" padding="none" className="mt-6">
        <div className="card-header">
          <h3 className="card-title">Registered Issuers</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/registry')}>
            View all
            <Icon name="chevron-right" size={16} />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Organization</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Tier</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">DID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {orgs.slice(0, 5).map(org => (
                <tr key={org.id} className="hover:bg-surface-50 transition-colors cursor-pointer" onClick={() => navigate('/admin/registry')}>
                  <td className="px-5 py-3.5 text-sm font-medium text-surface-800">{org.name}</td>
                  <td className="px-5 py-3.5 text-sm text-surface-600">Tier {org.tier}</td>
                  <td className="px-5 py-3.5 text-sm text-surface-500 font-mono text-xs">{org.did.slice(0, 20)}...</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={org.status === 'active' ? 'success' : 'warning'} size="sm" dot>
                      {org.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
