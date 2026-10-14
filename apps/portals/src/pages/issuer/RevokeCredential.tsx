import { PageHeader, Card, Button, Icon, Badge, Alert } from '@did-workers/design-system';
import { useNavigate } from 'react-router-dom';
import { t } from '@did-workers/i18n';

export function RevokeCredential() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title={t('issuer.revokeCredential') || 'Revoke Credential'}
        description={t('issuer.revokeCredentialDesc') || 'Select a credential to revoke from the credentials list'}
        action={
          <Button variant="outline" onClick={() => navigate('/issuer/dashboard')}>
            <Icon name="arrow-left" size={16} />
            Back
          </Button>
        }
      />

      <div className="max-w-2xl">
        <Card variant="elevated" padding="lg" className="text-center py-12">
          <Icon name="shield-x" size={48} className="text-danger-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Revoke Credentials</h3>
          <p className="text-surface-500 mb-6">
            To revoke a credential, please go to the <strong>Issued Credentials</strong> page
            where you can view all credentials and revoke them individually with a reason.
          </p>
          <Button onClick={() => navigate('/issuer/credentials')}>
            <Icon name="file-text" size={18} className="mr-2" />
            Go to Issued Credentials
          </Button>
        </Card>

        <Card variant="outlined" padding="lg" className="mt-6">
          <h4 className="font-medium mb-3">How Revocation Works</h4>
          <ul className="space-y-2 text-sm text-surface-600">
            <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-success-500" />Select credential from the list</li>
            <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-success-500" />Provide mandatory revocation reason</li>
            <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-success-500" />Credential marked as revoked immediately</li>
            <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-success-500" />Revocation published to trust registry</li>
            <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-success-500" />Verifiers see REVOKED status on next sync</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}