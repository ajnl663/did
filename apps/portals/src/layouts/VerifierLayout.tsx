import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Link as UILink, Icon, Badge, Avatar, Dropdown, Menu, Button } from '@did-workers/design-system';
import { useCredentialEngine } from '../context/CredentialEngineContext';
import { useEffect, useState } from 'react';
import { t, setLanguage } from '@did-workers/i18n';

const navItems = [
  { path: '/verifier/dashboard', label: 'Dashboard', icon: 'home' },
  { path: '/verifier/create', label: 'Create Request', icon: 'scan-line' },
  { path: '/verifier/requests', label: 'Active Requests', icon: 'list-check' },
  { path: '/verifier/history', label: 'History', icon: 'file-text' },
];

export function VerifierLayout() {
  const location = useLocation();
  const engine = useCredentialEngine();
  const [user, setUser] = useState({ name: 'Rajesh Verma', role: 'Verifier Operator', org: 'Welfare Desk - Bandra (demo)' });

  useEffect(() => {
    engine.initializeWallet();
  }, [engine]);

  return (
    <Layout
      header={
        <header className="h-16 px-4 md:px-6 lg:px-8 bg-success-50 border-b border-success-200">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/verifier/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-success-600 flex items-center justify-center">
                  <Icon name="shield-check" size={20} className="text-white" />
                </div>
                <span className="font-bold text-xl text-surface-900 hidden sm:block">Verifier Portal</span>
              </Link>
              <div className="hidden md:flex md:items-center md:gap-1 border-l border-surface-200 pl-4">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-success-50 text-success-600'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                    }`}
                  >
                    <Icon name={item.icon} size={16} className="mr-1" />
                    {t(`verifierPortal.${item.label.toLowerCase().replace(' ', '')}`) || item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="success" size="sm" dot>
                {t('common.online')}
              </Badge>
              <Dropdown>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar size="sm" name={user.name} />
                  <span className="hidden sm:block font-medium">{user.name}</span>
                  <Icon name="chevron-down" size={16} />
                </Button>
                <Menu>
                  <Menu.Item>
                    <div className="px-3 py-2 border-b border-surface-200">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-surface-500">{user.role}</p>
                    </div>
                  </Menu.Item>
                  <Menu.Item onSelect={() => setLanguage('en')}>English</Menu.Item>
                  <Menu.Item onSelect={() => setLanguage('hi')}>हिन्दी</Menu.Item>
                  <Menu.Item onSelect={() => setLanguage('mr')}>मराठी</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item onSelect={() => window.location.href = '/login'} className="text-danger-600">Sign Out</Menu.Item>
                </Menu>
              </Dropdown>
            </div>
          </div>
        </header>
      }
      sidebar={
        <aside className="w-64 bg-white border-r border-surface-200 p-4">
          <div className="mb-4 p-3 bg-success-50 rounded-xl border border-success-200">
            <div className="flex items-center gap-2 text-sm">
              <Icon name="wifi-off" size={16} className="text-warning-600" />
              <span className="font-medium text-surface-700">Offline Ready</span>
            </div>
            <p className="text-xs text-surface-500 mt-1">Trust data cached locally</p>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-success-50 text-success-600'
                    : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                }`}
              >
                <Icon name={item.icon} size={20} />
                {t(`verifierPortal.${item.label.toLowerCase().replace(' ', '')}`) || item.label}
              </Link>
            ))}
          </nav>
        </aside>
      }
    >
      <Outlet />
    </Layout>
  );
}