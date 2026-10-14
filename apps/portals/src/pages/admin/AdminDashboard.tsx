import { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button, Icon, StatCard } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

export function AdminDashboard() {
  const engine = useCredentialEngine();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [orgs, bundle, events] = await Promise.all([
        engine.getOrganizations(),
        engine.getTrustBundle(),
        engine.getVerificationEvents(),
      ]);
      setStats([
        { label: 'Total Issuers', value: orgs.length, icon: 'users', color: 'primary' },
        { label: 'Active Issuers', value: orgs.filter(o => o.status === 'active').length, icon: 'user', color: 'success' },
        { label: 'Trust Bundle Version', value: bundle.version, icon: 'file-text', color: 'primary' },
        { label: 'Verifications (24h)', value: events.filter(e => Date.now() - new Date(e.occurredAt).getTime() < 86400000).length, icon: 'shield-check', color: 'success' },
      ]);
      setLoading(false);
    };
    load();
  }, [engine]);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div>
      <PageHeader
        title={t('admin.title') || 'Admin Dashboard'}
        description={t('admin.dashboardDesc') || 'Overview of the DID Workers consortium'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" fullWidth>
              <Icon name="user" size={18} className="mr-2" />
              Onboard New Issuer
            </Button>
            <Button variant="outline" fullWidth>
              <Icon name="shield-check" size={18} className="mr-2" />
              Accredit Issuer
            </Button>
            <Button variant="outline" fullWidth>
              <Icon name="file-text" size={18} className="mr-2" />
              Publish Trust Bundle
            </Button>
            <Button variant="outline" fullWidth>
              <Icon name="settings" size={18} className="mr-2" />
              View Monitoring
            </Button>
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success-500" />
                <span>Indy Ledger (4 nodes)</span>
              </div>
              <Badge variant="success" size="sm">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success-500" />
                <span>Trust Registry Service</span>
              </div>
              <Badge variant="success" size="sm">Running</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success-500" />
                <span>Tails Server</span>
              </div>
              <Badge variant="success" size="sm">Running</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success-500" />
                <span>DIDComm Mediator</span>
              </div>
              <Badge variant="success" size="sm">Running</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}