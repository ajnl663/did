import { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button, Icon } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { t } from '@did-workers/i18n';

export function TrustChainView() {
  const engine = useCredentialEngine();
  const [chain, setChain] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const accs = await engine.getAccreditations();
      const orgs = await engine.getOrganizations();
      
      // Build tree structure
      const root = orgs.find(o => o.tier === 1 && !o.parentOrgId);
      const buildTree = (org: any, depth = 0) => {
        const children = orgs.filter(o => o.parentOrgId === org.id);
        return {
          ...org,
          depth,
          children: children.map(c => buildTree(c, depth + 1)),
        };
      };
      
      setChain(root ? buildTree(root) : null);
      setLoading(false);
    };
    load();
  }, [engine]);

  const renderNode = (node: any, depth = 0) => (
    <div key={node.id} className="ml-4" style={{ marginLeft: `${depth * 2}rem` }}>
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-surface-200 mb-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          node.tier === 1 ? 'bg-primary-500' : node.tier === 2 ? 'bg-warning-500' : 'bg-success-500'
        }`}>
          <Icon name="building" size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{node.name}</p>
          <p className="text-sm text-surface-500">
            Tier {node.tier} • {node.status} • DID: {node.did.slice(0, 30)}...
          </p>
        </div>
        <Badge variant={node.tier === 1 ? 'primary' : node.tier === 2 ? 'warning' : 'success'} size="sm">
          Tier {node.tier}
        </Badge>
      </div>
      {node.children && node.children.map((child: any) => renderNode(child, depth + 1))}
    </div>
  );

  return (
    <div>
      <PageHeader
        title={t('admin.trustChain') || 'Trust Chain'}
        description={t('admin.trustChainDesc') || 'Visualize the hierarchical trust chain from root to Tier 3 issuers'}
      />

      <Card variant="elevated" padding="lg">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : chain ? (
          <div className="space-y-2">
            {renderNode(chain)}
          </div>
        ) : (
          <div className="text-center py-12 text-surface-500">No trust chain data available</div>
        )}
      </Card>
    </div>
  );
}