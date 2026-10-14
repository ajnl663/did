import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Icon, Badge, Tabs, TabPanel } from '@did-workers/design-system';
import { t } from '@did-workers/i18n';

const roles = [
  { id: 'issuer_operator', label: 'Issuer Operator', portal: '/issuer/dashboard', icon: 'id-card', color: 'primary' },
  { id: 'issuer_admin', label: 'Issuer Admin', portal: '/issuer/dashboard', icon: 'users', color: 'primary' },
  { id: 'verifier_operator', label: 'Verifier Operator', portal: '/verifier/dashboard', icon: 'scan-line', color: 'success' },
  { id: 'governance_admin', label: 'Governance Admin', portal: '/admin/dashboard', icon: 'shield-check', color: 'primary' },
  { id: 'system_admin', label: 'System Admin', portal: '/admin/dashboard', icon: 'settings', color: 'primary' },
  { id: 'auditor', label: 'Auditor', portal: '/admin/audit', icon: 'list-check', color: 'primary' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(roles[0].id);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      setLoading(false);
      return;
    }

    const role = roles.find(r => r.id === selectedRole);
    if (role) {
      navigate(role.portal, { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
            <Icon name="shield-check" size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900">DID Workers</h1>
          <p className="text-surface-500 mt-1">Demo Login - Select Role & Enter PIN</p>
        </div>

        <Card variant="elevated" padding="lg">
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-surface-700 mb-3">Select Role</label>
              <Tabs
                tabs={roles.map(r => ({ id: r.id, label: r.label, icon: null }))}
                activeTab={selectedRole}
                onChange={setSelectedRole}
                variant="pills"
                fullWidth
              />
            </div>

            <Input
              label="PIN"
              type="password"
              placeholder="Enter 4+ digit PIN"
              value={pin}
              onChange={setPin}
              error={error}
              required
              autoFocus
            />

            {error && (
              <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm flex items-center gap-2">
                <Icon name="x-circle" size={16} />
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-200">
            <p className="text-xs text-surface-500 text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {roles.map(role => (
                <Badge key={role.id} variant={role.color as any} className="justify-center">
                  <Icon name={role.icon} size={12} className="mr-1" />
                  {role.label}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-surface-500 text-center mt-3">Any PIN ≥ 4 digits works</p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Badge variant="outline" size="sm" className="mr-2">
            <Icon name="wifi" size={12} className="mr-1" />
            Online Mode
          </Badge>
          <Badge variant="outline" size="sm">
            <Icon name="database" size={12} className="mr-1" />
            Mock Data
          </Badge>
        </div>
      </div>
    </div>
  );
}