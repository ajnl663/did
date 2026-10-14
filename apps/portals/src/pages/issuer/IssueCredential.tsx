import { useState } from 'react';
import { PageHeader, Card, Button, FormField, Select, Badge, Alert, Modal } from '@did-workers/design-system';
import { useCredentialEngine } from '@context/CredentialEngineContext';
import { useNavigate } from 'react-router-dom';
import { t } from '@did-workers/i18n';
import { Icon } from '@did-workers/design-system';

const credentialTypes = [
  { id: 'identity_verification', label: 'Identity Verification', schema: 'identity_verification' },
  { id: 'work_history', label: 'Work History', schema: 'work_history' },
  { id: 'skill', label: 'Skill Credential', schema: 'skill' },
  { id: 'welfare_eligibility', label: 'Welfare Eligibility', schema: 'welfare_eligibility' },
];

const schemaFields: Record<string, Array<{ name: string; label: string; type: string; required: boolean; options?: Array<{ value: string; label: string }> }>> = {
  identity_verification: [
    { name: 'full_name', label: 'Full Name', type: 'text', required: true },
    { name: 'date_of_birth', label: 'Date of Birth (YYYYMMDD)', type: 'text', required: true },
    { name: 'home_state', label: 'Home State', type: 'text', required: true },
    { name: 'home_district', label: 'Home District', type: 'text', required: true },
    { name: 'verification_method', label: 'Verification Method', type: 'select', required: true, options: [
      { value: 'in_person', label: 'In Person' },
      { value: 'document', label: 'Document' },
      { value: 'community_attestation', label: 'Community Attestation' },
    ]},
    { name: 'verified_on', label: 'Verified On (YYYYMMDD)', type: 'text', required: true },
    { name: 'issuer_case_ref', label: 'Issuer Case Reference', type: 'text', required: true },
  ],
  work_history: [
    { name: 'employer_name', label: 'Employer Name', type: 'text', required: true },
    { name: 'employer_ref', label: 'Employer Reference', type: 'text', required: true },
    { name: 'trade', label: 'Trade', type: 'text', required: true },
    { name: 'site_city', label: 'Site City', type: 'text', required: true },
    { name: 'site_area', label: 'Site Area', type: 'text', required: true },
    { name: 'start_date', label: 'Start Date (YYYYMMDD)', type: 'text', required: true },
    { name: 'end_date', label: 'End Date (YYYYMMDD, 0 if ongoing)', type: 'text', required: true },
    { name: 'months_worked', label: 'Months Worked', type: 'number', required: true },
    { name: 'employment_type', label: 'Employment Type', type: 'select', required: true, options: [
      { value: 'daily_wage', label: 'Daily Wage' },
      { value: 'contract', label: 'Contract' },
      { value: 'permanent', label: 'Permanent' },
      { value: 'self', label: 'Self-employed' },
    ]},
  ],
  skill: [
    { name: 'skill_code', label: 'Skill Code', type: 'text', required: true },
    { name: 'skill_name', label: 'Skill Name', type: 'text', required: true },
    { name: 'skill_level', label: 'Skill Level (1-5)', type: 'number', required: true },
    { name: 'experience_months', label: 'Experience (months)', type: 'number', required: true },
    { name: 'assessed_by', label: 'Assessed By', type: 'text', required: true },
    { name: 'assessed_on', label: 'Assessed On (YYYYMMDD)', type: 'text', required: true },
    { name: 'certificate_ref', label: 'Certificate Reference', type: 'text', required: true },
  ],
  welfare_eligibility: [
    { name: 'scheme_code', label: 'Scheme Code (e.g., BOCW)', type: 'text', required: true },
    { name: 'eligibility_status', label: 'Eligibility Status', type: 'select', required: true, options: [
      { value: 'eligible', label: 'Eligible' },
      { value: 'pending', label: 'Pending' },
      { value: 'not_eligible', label: 'Not Eligible' },
    ]},
    { name: 'valid_from', label: 'Valid From (YYYYMMDD)', type: 'text', required: true },
    { name: 'registration_ref', label: 'Registration Reference', type: 'text', required: true },
    { name: 'residence_district', label: 'Residence District', type: 'text', required: true },
    { name: 'continuous_work_months', label: 'Continuous Work (months)', type: 'number', required: true },
  ],
};

export function IssueCredential() {
  const navigate = useNavigate();
  const engine = useCredentialEngine();
  const [selectedType, setSelectedType] = useState(credentialTypes[0].id);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [issuedCred, setIssuedCred] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fields = schemaFields[selectedType] || [];

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const credDefs = await engine.getCredentialDefinitions();
      const credDef = credDefs.find(d => d.schemaId === selectedType);
      if (!credDef) throw new Error('Credential definition not found');

      const cred = await engine.issueCredential({
        credentialDefinitionId: credDef.id,
        holderDid: 'did:peer:ramesh',
        attributes: formData,
      });
      setIssuedCred(cred);
      setSuccess(true);
      setShowPreview(true);
    } catch (e) {
      setErrors({ form: 'Failed to issue credential' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
    setSuccess(false);
    setIssuedCred(null);
    setShowPreview(false);
  };

  return (
    <div>
      <PageHeader
        title={t('issuer.issueCredential') || 'Issue Credential'}
        description={t('issuer.issueCredentialDesc') || 'Issue a new verifiable credential to a connected worker'}
        action={
          <Button variant="outline" onClick={() => navigate('/issuer/dashboard')}>
            <Icon name="arrow-left" size={16} />
            Back
          </Button>
        }
      />

      <div className="max-w-3xl">
        <Card variant="elevated" padding="lg">
          <div className="mb-6">
            <label className="block text-sm font-medium text-surface-700 mb-3">Credential Type</label>
            <Select
              value={selectedType}
              onChange={setSelectedType}
              options={credentialTypes.map(c => ({ value: c.id, label: c.label }))}
              fullWidth
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <FormField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type as any}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={(v) => handleChange(field.name, v)}
                error={errors[field.name]}
                options={field.options}
                placeholder={`Enter ${field.label}`}
              />
            ))}

            {errors.form && <Alert variant="danger">{errors.form}</Alert>}

            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={loading} size="lg">
                <Icon name="id-card" size={18} className="mr-2" />
                Issue Credential
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset Form
              </Button>
            </div>
          </form>
        </Card>

        {success && issuedCred && (
          <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Credential Issued!" size="lg">
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-3">
                  <Icon name="check-circle" size={32} className="text-success-600" />
                </div>
                <h3 className="text-lg font-semibold">Credential sent to worker's wallet</h3>
                <p className="text-surface-500 mt-1">Credential ID: <code className="font-mono text-sm">{issuedCred.id}</code></p>
              </div>

              <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
                <h4 className="font-medium mb-3">Issued Credential Details</h4>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <dt className="text-surface-500">Schema</dt>
                  <dd className="font-medium">{selectedType.replace('_', ' ')}</dd>
                  <dt className="text-surface-500">Status</dt>
                  <dd><Badge variant="success" size="sm">Valid</Badge></dd>
                  <dt className="text-surface-500">Issued</dt>
                  <dd>{new Date(issuedCred.issuedOn).toLocaleString()}</dd>
                  <dt className="text-surface-500">Holder</dt>
                  <dd className="font-mono text-xs break-all">{issuedCred.holderDid}</dd>
                </dl>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => { setShowPreview(false); handleReset(); }}>
                  Issue Another
                </Button>
                <Button onClick={() => navigate('/issuer/credentials')}>
                  View All Credentials
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}