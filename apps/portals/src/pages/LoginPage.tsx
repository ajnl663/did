import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Icon, Badge } from '@did-workers/design-system';
import { t } from '@did-workers/i18n';
import { clsx } from 'clsx';

const roles = [
  { id: 'issuer_operator', label: 'Issuer Operator', portal: '/issuer/dashboard', icon: 'id-card', color: 'primary' },
  { id: 'issuer_admin', label: 'Issuer Admin', portal: '/issuer/dashboard', icon: 'users', color: 'primary' },
  { id: 'verifier_operator', label: 'Verifier Operator', portal: '/verifier/dashboard', icon: 'scan-line', color: 'success' },
  { id: 'governance_admin', label: 'Governance Admin', portal: '/admin/dashboard', icon: 'shield-check', color: 'primary' },
  { id: 'system_admin', label: 'System Admin', portal: '/admin/dashboard', icon: 'settings', color: 'primary' },
  { id: 'auditor', label: 'Auditor', portal: '/admin/audit', icon: 'clipboard', color: 'primary' },
];

const accentColors: Record<string, string> = {
  primary: 'border-primary-500 bg-primary-50 text-primary-700',
  success: 'border-success-500 bg-success-50 text-success-700',
};

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

    await new Promise(r => setTimeout(r, 600));

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
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface-800 via-surface-900 to-surface-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.3) 0%, transparent 40%)'
        }} />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-900/50">
              <Icon name="shield-check" size={28} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">DID Workers</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-4">
              Self-sovereign identity for migrant workers
            </h1>
            <p className="text-lg text-surface-300 leading-relaxed">
              Issue, verify, and manage verifiable credentials with a trust chain built for the real world.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: 'shield-check', title: 'Cryptographic Trust', desc: 'Accredited issuer hierarchy with on-chain verification' },
                { icon: 'wifi-off', title: 'Offline-First', desc: 'Verifications work without network connectivity' },
                { icon: 'lock', title: 'Privacy by Design', desc: 'Selective disclosure — workers control their data' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center flex-shrink-0 border border-white/10">
                    <Icon name={f.icon} size={20} className="text-primary-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{f.title}</p>
                    <p className="text-sm text-surface-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-surface-400">
            <span className="flex items-center gap-2">
              <Icon name="globe" size={16} />
              Mumbai · India
            </span>
            <span className="flex items-center gap-2">
              <Icon name="database" size={16} />
              Mock Demo Mode
            </span>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 mesh-bg">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Icon name="shield-check" size={30} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-surface-900">DID Workers</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-surface-900 tracking-tight">Welcome back</h2>
            <p className="text-surface-500 mt-1.5">Select your role and enter your PIN to continue.</p>
          </div>

          <Card variant="elevated" padding="lg" className="shadow-card-lg">
            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-surface-700 mb-3">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(role => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={clsx(
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 text-left',
                        selectedRole === role.id
                          ? accentColors[role.color] || accentColors.primary
                          : 'border-surface-200 bg-white text-surface-600 hover:border-surface-300 hover:bg-surface-50'
                      )}
                    >
                      <Icon name={role.icon} size={18} className="flex-shrink-0" />
                      <span className="truncate">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="PIN"
                type="password"
                placeholder="Enter 4+ digit PIN"
                value={pin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value)}
                error={error}
                required
                autoFocus
              />

              <Button type="submit" fullWidth size="lg" loading={loading} className="mt-5">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-surface-100">
              <div className="flex items-center justify-center gap-2 text-xs text-surface-500">
                <Icon name="info" size={14} className="text-surface-400" />
                <span>Demo mode — any PIN with 4+ digits works</span>
              </div>
            </div>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Badge variant="outline" size="sm" className="gap-1.5">
              <Icon name="wifi" size={12} />
              Online Mode
            </Badge>
            <Badge variant="outline" size="sm" className="gap-1.5">
              <Icon name="database" size={12} />
              Mock Data
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
