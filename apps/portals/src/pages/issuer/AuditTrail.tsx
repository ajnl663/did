import { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button, Table, Tbody, Tr, Th, Td, Input, Select, Icon, Modal } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { useNavigate } from 'react-router-dom';
import { t } from '@did-workers/i18n';

export function AuditTrail() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const result = await engine.getAuditLogs(100, 0);
      setLogs(result.entries);
      setLoading(false);
    };
    load();
  }, [engine]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const actions = [...new Set(logs.map(l => l.action))];

  return (
    <div>
      <PageHeader
        title={t('issuer.auditTrail') || 'Audit Trail'}
        description={t('issuer.auditTrailDesc') || 'View all audit log entries for your organization'}
        action={
          <Button variant="outline" onClick={() => navigate('/issuer/dashboard')}>
            <Icon name="arrow-left" size={16} />
            Back
          </Button>
        }
      />

      <Card variant="elevated" padding="lg" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search audit logs..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            leftIcon={<Icon name="search" size={18} />}
          />
          <Select
            value={actionFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setActionFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Actions' },
              ...actions.map(a => ({ value: a, label: a.replace(/_/g, ' ') })),
            ]}
          />
        </div>
      </Card>

      <Card variant="elevated" padding="none">
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Details</th>
              </tr>
            </thead>
            <Tbody>
              {filteredLogs.slice((page - 1) * pageSize, page * pageSize).map(log => (
                <Tr key={log.id} onClick={() => setSelectedLog(log)} className="cursor-pointer hover:bg-surface-50">
                  <Td className="text-surface-500 whitespace-nowrap">{new Date(log.at).toLocaleString()}</Td>
                  <Td className="font-mono text-xs">{log.actor.slice(0, 30)}...</Td>
                  <Td><Badge variant="primary" size="sm">{log.action.replace(/_/g, ' ')}</Badge></Td>
                  <Td>{log.entity}</Td>
                  <Td className="font-mono text-xs">{log.entityId}</Td>
                  <Td className="max-w-xs truncate text-surface-500">
                    {JSON.stringify(log.details).slice(0, 50)}...
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
        {filteredLogs.length === 0 && (
          <div className="p-12 text-center">
            <Icon name="file-text" size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No audit logs found</p>
          </div>
        )}
        {filteredLogs.length > pageSize && (
          <div className="p-4 border-t border-surface-200 flex items-center justify-between">
            <span className="text-sm text-surface-500">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredLogs.length)} of {filteredLogs.length}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= filteredLogs.length}>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {selectedLog && (
        <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title="Audit Log Detail" size="lg">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt className="text-surface-500">ID</dt>
            <dd className="font-mono text-xs break-all">{selectedLog.id}</dd>
            <dt className="text-surface-500">Timestamp</dt>
            <dd>{new Date(selectedLog.at).toLocaleString()}</dd>
            <dt className="text-surface-500">Actor</dt>
            <dd className="font-mono text-xs break-all">{selectedLog.actor}</dd>
            <dt className="text-surface-500">Action</dt>
            <dd><Badge variant="primary" size="sm">{selectedLog.action.replace(/_/g, ' ')}</Badge></dd>
            <dt className="text-surface-500">Entity</dt>
            <dd>{selectedLog.entity}</dd>
            <dt className="text-surface-500">Entity ID</dt>
            <dd className="font-mono text-xs">{selectedLog.entityId}</dd>
            <dt className="text-surface-500">Previous Hash</dt>
            <dd className="font-mono text-xs break-all">{selectedLog.prevHash}</dd>
            <dt className="text-surface-500">Hash</dt>
            <dd className="font-mono text-xs break-all">{selectedLog.hash}</dd>
            <dt className="text-surface-500">Details</dt>
            <dd className="col-span-2">
              <pre className="p-3 bg-surface-50 rounded-lg text-xs overflow-auto max-h-60">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </dd>
          </dl>
        </Modal>
      )}
    </div>
  );
}