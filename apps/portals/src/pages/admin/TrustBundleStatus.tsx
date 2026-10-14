import { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button, Icon, StatCard } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

export function TrustBundleStatus() {
  const engine = useCredentialEngine();
  const [bundle, setBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const tb = await engine.getTrustBundle();
      setBundle(tb);
      setLoading(false);
    };
    load();
  }, [engine]);

  const handleSync = async () => {
    const tb = await engine.syncTrustBundle();
    setBundle(tb);
  };

  return (
    <div>
      <PageHeader
        title={t('admin.trustBundle') || 'Trust Bundle'}
        description={t('admin.trustBundleDesc') || 'View and manage the signed trust bundle for offline verification'}
        action={
          <Button onClick={handleSync}>
            <Icon name="refresh-cw" size={18} className="mr-2" />
            Sync & Republish
          </Button>
        }
      />

      <div className="max-w-3xl">
        {loading ? (
          <Card variant="elevated" padding="lg" className="text-center">Loading...</Card>
        ) : bundle ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard label="Version" value={bundle.version} icon="file-text" color="primary" />
              <StatCard label="Organizations" value={bundle.organizations.length} icon="users" color="success" />
              <StatCard label="Accreditations" value={bundle.accreditations.length} icon="shield-check" color="warning" />
              <StatCard label="Schemas" value={bundle.schemas.length} icon="file-text" color="primary" />
            </div>

            <Card variant="elevated" padding="lg" className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Bundle Details</h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <dt className="text-surface-500">Version</dt>
                <dd className="font-medium">{bundle.version}</dd>
                <dt className="text-surface-500">Generated At</dt>
                <dd>{new Date(bundle.generatedAt).toLocaleString()}</dd>
                <dt className="text-surface-500">Root DID</dt>
                <dd className="font-mono text-xs break-all">{bundle.rootDid}</dd>
                <dt className="text-surface-500">Organizations</dt>
                <dd>{bundle.organizations.length}</dd>
                <dt className="text-surface-500">Accreditations</dt>
                <dd>{bundle.accreditations.length}</dd>
                <dt className="text-surface-500">Schemas</dt>
                <dd>{bundle.schemas.length}</dd>
                <dt className="text-surface-500">Credential Definitions</dt>
                <dd>{bundle.credentialDefinitions.length}</dd>
                <dt className="text-surface-500">Revocation Registries</dt>
                <dd>{bundle.revocationRegistries.length}</dd>
                <dt className="text-surface-500">Status Lists</dt>
                <dd>{bundle.statusLists.length}</dd>
                <dt className="text-surface-500">Policies</dt>
                <dd>{bundle.policies.length}</dd>
              </dl>
            </Card>

            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleSync}>
                  <Icon name="refresh-cw" size={18} className="mr-2" />
                  Sync & Republish Bundle
                </Button>
                <Button variant="outline">
                  <Icon name="download" size={18} className="mr-2" />
                  Download JSON
                </Button>
                <Button variant="outline">
                  <Icon name="shield-check" size={18} className="mr-2" />
                  Verify Signature
                </Button>
              </div>
            </Card>
          </>
        ) : (
          <Card variant="elevated" padding="lg" className="text-center text-danger-600">Failed to load trust bundle</Card>
        )}
      </div>
    </div>
  );
}