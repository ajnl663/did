import { useState } from 'react';
import { PageHeader, Card, Button, Input, Badge, Alert, Table, Tbody, Tr, Th, Td } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { useNavigate } from 'react-router-dom';
import { t } from '@did-workers/i18n';
import { Icon } from '@did-workers/design-system';

const sampleCSV = `employer_name,employer_ref,trade,site_city,site_area,start_date,end_date,months_worked,employment_type
"Site Contractors Pvt Ltd","CONT-004","Masonry","Mumbai","Andheri","20240901","0","1","daily_wage"
"Site Contractors Pvt Ltd","CONT-005","Masonry","Mumbai","Powai","20240901","0","1","daily_wage"
"BuildRight Constructions","BR-001","Carpentry","Mumbai","Goregaon","20240801","0","2","contract"`;

export function BulkIssue() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [credType, setCredType] = useState('work_history');
  const [csvText, setCsvText] = useState(sampleCSV);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState('');
  const [showResult, setShowResult] = useState(false);

  const parseCSV = () => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const rows = lines.slice(1).map((line, i) => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const row: any = {};
      headers.forEach((h, idx) => row[h] = values[idx] || '');
      return { index: i + 1, data: row };
    });
    setParsedRows(rows);
    setErrors({});
  };

  const validateRows = () => {
    const newErrors: Record<number, string> = {};
    parsedRows.forEach((row, i) => {
      if (!row.data.employer_name) newErrors[row.index] = 'Missing employer_name';
      if (!row.data.trade) newErrors[row.index] = 'Missing trade';
      if (!row.data.months_worked) newErrors[row.index] = 'Missing months_worked';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateRows()) return;
    setLoading(true);
    try {
      const result = await engine.bulkIssue({
        credentialDefinitionId: `cred-def-${credType}`,
        rows: parsedRows.map(r => r.data),
      });
      setJobId(result.jobId);
      setShowResult(true);
    } catch (e) {
      setErrors({ form: 'Failed to start bulk issuance' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t('issuer.bulkIssue') || 'Bulk Issue Credentials'}
        description={t('issuer.bulkIssueDesc') || 'Issue multiple credentials from a CSV file'}
        action={
          <Button variant="outline" onClick={() => navigate('/issuer/dashboard')}>
            <Icon name="arrow-left" size={16} />
            Back
          </Button>
        }
      />

      <div className="max-w-4xl">
        <Card variant="elevated" padding="lg" className="mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-surface-700 mb-2">Credential Type</label>
            <select
              value={credType}
              onChange={(e) => setCredType(e.target.value)}
              className="w-full md:w-64 px-4 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="work_history">Work History</option>
              <option value="skill">Skill Credential</option>
              <option value="identity_verification">Identity Verification</option>
              <option value="welfare_eligibility">Welfare Eligibility</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-surface-700 mb-2">CSV Data</label>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={10}
              className="w-full font-mono text-sm px-4 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Paste CSV data here..."
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={parseCSV}>
              <Icon name="refresh-cw" size={16} className="mr-2" />
              Parse & Validate
            </Button>
            <Button onClick={handleSubmit} loading={loading} disabled={parsedRows.length === 0}>
              <Icon name="upload" size={16} className="mr-2" />
              Start Bulk Issuance
            </Button>
          </div>
        </Card>

        {parsedRows.length > 0 && (
          <Card variant="elevated" padding="none">
            <div className="p-6 border-b border-surface-200">
              <h3 className="text-lg font-semibold">Preview ({parsedRows.length} rows)</h3>
              <p className="text-sm text-surface-500 mt-1">Review data before issuance. Errors highlighted in red.</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Employer</th>
                    <th>Trade</th>
                    <th>City</th>
                    <th>Months</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <Tbody>
                  {parsedRows.map(row => (
                    <Tr key={row.index} className={errors[row.index] ? 'bg-danger-50' : ''}>
                      <Td>{row.index}</Td>
                      <Td>{row.data.employer_name}</Td>
                      <Td>{row.data.trade}</Td>
                      <Td>{row.data.site_city}</Td>
                      <Td>{row.data.months_worked}</Td>
                      <Td>{row.data.employment_type}</Td>
                      <Td>
                        {errors[row.index] ? (
                          <Badge variant="danger" size="sm">Error</Badge>
                        ) : (
                          <Badge variant="success" size="sm">Ready</Badge>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
            {Object.keys(errors).some(k => k !== 'form') && (
              <div className="p-4 bg-danger-50 border-t border-danger-200">
                <p className="text-sm text-danger-700">
                  <Icon name="alert-triangle" size={14} className="inline mr-1" />
                  {Object.keys(errors).filter(k => k !== 'form').length} row(s) have validation errors
                </p>
              </div>
            )}
          </Card>
        )}

        {showResult && jobId && (
          <Card variant="elevated" padding="lg" className="mt-6 border-success-200 bg-success-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success-500 flex items-center justify-center">
                <Icon name="check" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-success-800">Bulk Issuance Started</h3>
                <p className="text-success-700 text-sm">Job ID: <code className="font-mono">{jobId}</code></p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" onClick={() => { setShowResult(false); setCsvText(sampleCSV); setParsedRows([]); setJobId(''); }}>
                New Batch
              </Button>
              <Button onClick={() => navigate('/issuer/credentials')}>
                View Credentials
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}