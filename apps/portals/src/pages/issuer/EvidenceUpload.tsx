import { PageHeader, Card, Button, Icon, Badge, Alert, Table, Tbody, Tr, Th, Td } from '@did-workers/design-system';
import { useNavigate } from 'react-router-dom';
import { t } from '@did-workers/i18n';

export function EvidenceUpload() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title={t('issuer.evidence') || 'Evidence Upload'}
        description={t('issuer.evidenceDesc') || 'Upload supporting evidence for credential issuance'}
        action={
          <Button variant="outline" onClick={() => navigate('/issuer/dashboard')}>
            <Icon name="arrow-left" size={16} />
            Back
          </Button>
        }
      />

      <div className="max-w-2xl">
        <Card variant="elevated" padding="lg" className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Upload Evidence</h3>
          <div className="border-2 border-dashed border-surface-300 rounded-xl p-8 text-center">
            <Icon name="upload" size={32} className="text-surface-400 mx-auto mb-3" />
            <p className="text-surface-500 mb-4">Drag & drop files here, or click to browse</p>
            <p className="text-xs text-surface-400">PDF, JPG, PNG up to 10MB each</p>
            <Button variant="outline" className="mt-4">
              <Icon name="file-text" size={16} className="mr-2" />
              Choose Files
            </Button>
          </div>
          <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-xl">
            <p className="text-sm text-primary-800">
              <Icon name="info" size={14} className="inline mr-1" />
              Evidence is encrypted and stored in MinIO. Only SHA-256 hash is recorded on-chain.
            </p>
          </div>
        </Card>

        <Card variant="elevated" padding="none">
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold">Recent Uploads</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Credential</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th>Hash</th>
                </tr>
              </thead>
              <Tbody>
                <Tr>
                  <Td className="font-medium">id_proof_ramesh.pdf</Td>
                  <Td><Badge variant="primary" size="sm">Identity Verification</Badge></Td>
                  <Td>2.4 MB</Td>
                  <Td className="text-surface-500">Jan 20, 2024</Td>
                  <Td className="font-mono text-xs">a1b2c3d4...</Td>
                </Tr>
                <Tr>
                  <Td className="font-medium">work_letter_contractor.pdf</Td>
                  <Td><Badge variant="primary" size="sm">Work History</Badge></Td>
                  <Td>1.8 MB</Td>
                  <Td className="text-surface-500">Jan 15, 2024</Td>
                  <Td className="font-mono text-xs">e5f6g7h8...</Td>
                </Tr>
              </Tbody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}