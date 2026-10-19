import { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button, Table, Tbody, Tr, Th, Td, Input, Select, Icon, Modal } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

export function AuditLogs() {
  const engine = useCredentialEngine();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const result = await engine.getAuditLogs(100, 0);
      setLogs(result.entries);
      setLoading(false);
    };
    load();
  }, [engine]);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.entity.toLowerCase().includes(search.toLowerCase()) ||
    log.actor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title={t('admin.auditLogs') || 'Audit Logs'}
        description={t('admin.auditLogsDesc') || 'View system-wide audit trail with hash-chain verification'}
      />

      <Card variant="elevated" padding="lg" className="mb-6">
        <Input
          placeholder="Search audit logs..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          leftIcon={<Icon name="search" size={18} />}
        />
      </Card>

      <Card variant="elevated" padding="none">
        {loading ? (
          <div className="p-12 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>Hash</th>
                </tr>
              </thead>
              <Tbody>
                {filteredLogs.map(log => (
                  <Tr key={log.id} onClick={() => setSelectedLog(log)} className="cursor-pointer hover:bg-surface-50">
                    <Td className="text-surface-500 whitespace-nowrap">{new Date(log.at).toLocaleString()}</Td>
                    <Td className="font-mono text-xs">{log.actor.slice(0, 30)}...</Td>
                    <Td><Badge variant="primary" size="sm">{log.action.replace(/_/g, ' ')}</Badge></Td>
                    <Td>{log.entity}</Td>
                    <Td className="font-mono text-xs">{log.entityId}</Td>
                    <Td className="font-mono text-xs text-surface-500">{log.hash.slice(0, 16)}...</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
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
            <dt className="text-surface-500">Current Hash</dt>
            <dd className="font-mono text-xs break-all">{selectedLog.hash}</dd>
            <dt className="text-surface-500">Details</dt>
            <dd className="col-span-2">
              <pre className="p-3 bg-surface-50 rounded-lg text-xs overflow-auto max-h-60">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </dd>
          </dl>
          <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-xl">
            <p className="text-sm text-warning-800">
              <Icon name="info" size={14} className="inline mr-1" />
              Hash chain verification: Each entry's hash includes the previous entry's hash, creating a tamper-evident log.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}