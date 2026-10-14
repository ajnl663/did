import { useState } from 'react';
import { PageHeader, Card, Button, Icon, Badge } from '@did-workers/design-system';
import { t } from '@did-workers/i18n';

export function OnboardIssuer() {
  const [step, setStep] = useState(1);

  return (
    <div>
      <PageHeader
        title={t('admin.onboardIssuer') || 'Onboard Issuer'}
        description={t('admin.onboardIssuerDesc') || 'Register a new issuer in the consortium'}
      />

      <div className="max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Organization' },
              { num: 2, label: 'DID & Keys' },
              { num: 3, label: 'Accreditation' },
              { num: 4, label: 'Complete' },
            ].map(s => (
              <div key={s.num} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= s.num ? 'bg-primary-600 text-white' : 'bg-surface-200 text-surface-500'
                }`}>
                  {step > s.num ? <Icon name="check" size={16} /> : s.num}
                </div>
                <span className={`text-sm mt-2 ${step >= s.num ? 'text-primary-600' : 'text-surface-500'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card variant="elevated" padding="lg">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Organization Details</h3>
              <input type="text" placeholder="Organization Name" className="w-full px-4 py-3 rounded-xl border border-surface-300" />
              <select className="w-full px-4 py-3 rounded-xl border border-surface-300">
                <option value="1">Tier 1 - Accredited Authority</option>
                <option value="2">Tier 2 - Accredited Issuer</option>
                <option value="3">Tier 3 - Delegated Issuer</option>
              </select>
              <input type="text" placeholder="Parent Organization (if Tier 2/3)" className="w-full px-4 py-3 rounded-xl border border-surface-300" />
              <div className="flex gap-3 justify-end">
                <Button variant="outline" disabled={step === 1}>Back</Button>
                <Button onClick={() => setStep(2)}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">DID & Keys</h3>
              <p className="text-surface-500">Generate a new did:indy DID for this issuer</p>
              <Button variant="outline" fullWidth onClick={() => {}}>
                <Icon name="refresh-cw" size={18} className="mr-2" />
                Generate DID
              </Button>
              <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
                <p className="font-mono text-sm break-all">did:indy:workers-dev:new-issuer-abc123</p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Accreditation</h3>
              <p className="text-surface-500">Parent organization issues accreditation credential</p>
              <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
                <p className="font-medium">Parent: Mumbai Labour Welfare Board (demo)</p>
                <p className="text-sm text-surface-600 mt-1">Will issue Tier 2 accreditation with authorized schemas</p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Next</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-success-500 flex items-center justify-center mx-auto mb-4">
                <Icon name="check" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Issuer Onboarded Successfully!</h3>
              <p className="text-surface-500 mb-6">The issuer is now registered in the consortium and can issue credentials.</p>
              <Button onClick={() => setStep(1)}>Done</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}