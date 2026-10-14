import { useState, useEffect } from 'react';
import { PageHeader, Card, Button, Badge, Icon, StatCard } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { useNavigate } from 'react-router-dom';
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
        { label: 'Trust Bundle Version', value: bundle.version, icon: 'file-text', color: 'primary' },
      ]);
      setLoading(false);
    };
    load();
  }, [engine]);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div>
      <PageHeader
        title={t('verifierPortal.title') || 'Verifier Portal'}
        description={t('verifierPortal.dashboardDesc') || 'Create and manage verification requests'}
        action={
          <Button onClick={() => navigate('/verifier/create')}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" padding="none">
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold">Recent Verification Requests</h3>
          </div>
          <div className="divide-y divide-surface-200">
            {recentRequests.map(req => (
              <div key={req.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{req.verifierName}</p>
                  <p className="text-sm text-surface-500">{req.proofRequest.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={req.status === 'completed' ? 'success' : req.status === 'pending' ? 'warning' : 'default'}
                    size="sm"
                  >
                    {req.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/verifier/result/${req.id}`)}>
                    View
                  </Button>
                </div>
              </div>
            ))}
            {recentRequests.length === 0 && (
              <div className="p-8 text-center text-surface-500">No verification requests yet</div>
            )}
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" fullWidth onClick={() => navigate('/verifier/create')}>
              <Icon name="scan-line" size={18} className="mr-2" />
              Create Verification Request
            </Button>
            <Button variant="outline" fullWidth onClick={() => navigate('/verifier/requests')}>
              <Icon name="list-check" size={18} className="mr-2" />
              View Active Requests
            </Button>
            <Button variant="outline" fullWidth onClick={() => navigate('/verifier/history')}>
              <Icon name="file-text" size={18} className="mr-2" />
              View History
            </Button>
            <Button variant="outline" fullWidth onClick={() => engine.syncTrustBundle()}>
              <Icon name="refresh-cw" size={18} className="mr-2" />
              Sync Trust Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}