import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, PageHeader, Button, Icon, Badge, Avatar, Dropdown, Menu } from '@did-workers/design-system';
import { useCredentialEngine } from '../context/CredentialEngineContext';
import { useEffect, useState } from 'react';
import { t, setLanguage, getAvailableLanguages } from '@did-workers/i18n';

const navItems = [
  { path: '/issuer/dashboard', label: 'Dashboard', icon: 'home' },
  { path: '/issuer/connect', label: 'Connect Worker', icon: 'user' },
  { path: '/issuer/issue', label: 'Issue Credential', icon: 'id-card' },
  { path: '/issuer/bulk', label: 'Bulk Issue', icon: 'list-check' },
  { path: '/issuer/credentials', label: 'Issued Credentials', icon: 'file-text' },
  { path: '/issuer/audit', label: 'Audit Trail', icon: 'settings' },
];

export function IssuerLayout() {
  const location = useLocation();
  const engine = useCredentialEngine();
  const [user, setUser] = useState({ name: 'Priya Sharma', role: 'Issuer Operator', org: 'Nirman NGO (demo)' });

  useEffect(() => {
    engine.initializeWallet();
  }, [engine]);

  return (
    <Layout
      header={
        <header className="h-16 px-4 md:px-6 lg:px-8">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/issuer/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
                  <Icon name="shield-check" size={20} className="text-white" />
                </div>
                <span className="font-bold text-xl text-surface-900 hidden sm:block">DID Workers</span>
              </Link>
              <div className="hidden md:flex md:items-center md:gap-1 border-l border-surface-200 pl-4">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                    }`}
                  >
                    <Icon name={item.icon} size={16} className="mr-1" />
                    {t(`issuer.${item.label.toLowerCase().replace(' ', '')}`) || item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="primary" size="sm" dot>
                {t('common.online')}
              </Badge>
              <div className="hidden sm:flex sm:items-center sm:gap-2">
                <span className="text-sm text-surface-500">{user.org}</span>
              </div>
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
                  <Menu.Item onSelect={() => setLanguage('en')}>
                    <Icon name="flag" size={14} className="mr-2" />
                    English
                  </Menu.Item>
                  <Menu.Item onSelect={() => setLanguage('hi')}>
                    <Icon name="flag" size={14} className="mr-2" />
                    हिन्दी
                  </Menu.Item>
                  <Menu.Item onSelect={() => setLanguage('mr')}>
                    <Icon name="flag" size={14} className="mr-2" />
                    मराठी
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item onSelect={() => window.location.href = '/login'} className="text-danger-600">
                    <Icon name="logout" size={14} className="mr-2" />
                    Sign Out
                  </Menu.Item>
                </Menu>
              </Dropdown>
            </div>
          </div>
        </header>
      }
      sidebar={
        <aside className="w-64 bg-white border-r border-surface-200 p-4">
          <nav className="space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                }`}
              >
                <Icon name={item.icon} size={20} />
                {t(`issuer.${item.label.toLowerCase().replace(' ', '')}`) || item.label}
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