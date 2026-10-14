import { PageHeader, Card, Button, Badge, Icon, StatCard } from '@did-workers/design-system';
import { t } from '@did-workers/i18n';

export function Monitoring() {
  return (
    <div>
      <PageHeader
        title={t('admin.monitoring') || 'Monitoring'}
        description={t('admin.monitoringDesc') || 'System health and performance metrics'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="CPU Usage" value="12%" icon="cpu" color="success" change="+2%" changePositive={false} />
        <StatCard label="Memory" value="45%" icon="memory" color="primary" change="-1%" />
        <StatCard label="Ledger Latency" value="245ms" icon="zap" color="warning" change="+15ms" changePositive={false} />
        <StatCard label="Error Rate" value="0.02%" icon="alert-triangle" color="danger" change="-0.01%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-semibold mb-4">Service Health</h3>
          <div className="space-y-3">
            {[
              { name: 'Trust Registry', status: 'healthy', uptime: '99.99%' },
              { name: 'Issuer Service', status: 'healthy', uptime: '99.95%' },
              { name: 'Verifier Service', status: 'healthy', uptime: '99.98%' },
              { name: 'Indy Ledger (4 nodes)', status: 'healthy', uptime: '100%' },
              { name: 'Tails Server', status: 'healthy', uptime: '99.9%' },
              { name: 'DIDComm Mediator', status: 'healthy', uptime: '99.97%' },
            ].map(svc => (
              <div key={svc.name} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${svc.status === 'healthy' ? 'bg-success-500' : 'bg-danger-500'}`} />
                  <span className="font-medium">{svc.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success" size="sm">{svc.status}</Badge>
                  <span className="text-sm text-surface-500">{svc.uptime}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Issuance Rate</span>
                <span className="font-medium">12/min</span>
              </div>
              <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Verification Rate</span>
                <span className="font-medium">8/min</span>
              </div>
              <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                <div className="h-full bg-success-600 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Active Connections</span>
                <span className="font-medium">23</span>
              </div>
              <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                <div className="h-full bg-warning-600 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}