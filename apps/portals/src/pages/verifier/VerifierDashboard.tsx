import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, Badge, Icon, StatCard, StatusBadge } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

export function VerifierDashboard() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [stats, setStats] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [requests, bundle] = await Promise.all([
        engine.getVerificationRequests(),
        engine.getTrustBundle(),
      ]);
      setRecentRequests(requests.slice(0, 5));
      setStats([
        { label: 'Total Verifications', value: requests.length, icon: 'shield-check', color: 'success' },
        { label: 'Valid Results', value: requests.filter(r => r.status === 'completed').length, icon: 'check-circle', color: 'primary' },
        { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, icon: 'clock', color: 'warning' },
        { label: 'Trust Bundle', value: bundle.version, icon: 'layers', color: 'primary' },
      ]);
      setLoading(false);
    };
    load();
  }, [engine]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="loader" size={28} className="text-success-500" />
      </div>
    );
  }

  const quickActions = [
    { label: 'Create Verification Request', icon: 'scan-line', path: '/verifier/create' },
    { label: 'View Active Requests', icon: 'list-check', path: '/verifier/requests' },
    { label: 'View History', icon: 'file-text', path: '/verifier/history' },
  ];

  return (
    <div>
      <PageHeader
        title="Verifier Dashboard"
        description="Create and manage credential verification requests"
        action={
          <Button variant="success" onClick={() => navigate('/verifier/create')}>
            <Icon name="plus" size={18} />
            New Verification
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" padding="none" className="lg:col-span-2">
          <div className="card-header">
            <h3 className="card-title">Recent Verification Requests</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/verifier/requests')}>
              View all
              <Icon name="chevron-right" size={16} />
            </Button>
          </div>
          <div className="divide-y divide-surface-100">
            {recentRequests.map(req => (
              <div key={req.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface-50 transition-colors cursor-pointer" onClick={() => navigate(`/verifier/result/${req.id}`)}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center">
                    <Icon name="shield-check" size={18} className="text-surface-500" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-800 text-sm">{req.proofRequest.name}</p>
                    <p className="text-xs text-surface-500">{req.verifierName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={req.status === 'completed' ? 'success' : req.status === 'pending' ? 'warning' : 'default'}
                    size="sm"
                    dot
                  >
                    {req.status}
                  </Badge>
                  <Icon name="chevron-right" size={16} className="text-surface-300" />
                </div>
              </div>
            ))}
            {recentRequests.length === 0 && (
              <div className="empty-state py-12">
                <Icon name="scan-line" size={32} className="text-surface-300 mb-3" />
                <p className="text-surface-500 text-sm">No verification requests yet</p>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card variant="elevated" padding="none">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="p-3">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-surface-700 hover:bg-surface-50 hover:text-success-700 transition-all duration-150 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center group-hover:bg-success-50 transition-colors">
                    <Icon name={action.icon} size={18} className="text-surface-500 group-hover:text-success-600 transition-colors" />
                  </div>
                  <span className="flex-1 text-left">{action.label}</span>
                  <Icon name="chevron-right" size={16} className="text-surface-300 group-hover:text-success-500 transition-colors" />
                </button>
              ))}
            </div>
          </Card>

          <Card variant="elevated" padding="md" accent="success">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="refresh-cw" size={20} className="text-success-600" />
              <h3 className="text-sm font-semibold text-surface-800">Trust Data</h3>
            </div>
            <p className="text-xs text-surface-500 mb-3">Sync the latest trust bundle from the registry.</p>
            <Button variant="outline" size="sm" fullWidth onClick={() => engine.syncTrustBundle()}>
              Sync Now
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
