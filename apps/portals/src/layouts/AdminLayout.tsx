import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Icon, Badge, Avatar, Dropdown, Menu, Button } from '@did-workers/design-system';
import { useCredentialEngine } from '../context/CredentialEngineContext';
import { useEffect, useState } from 'react';
import { t, setLanguage } from '@did-workers/i18n';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'home' },
  { path: '/admin/registry', label: 'Issuer Registry', icon: 'users' },
  { path: '/admin/trust-chain', label: 'Trust Chain', icon: 'shield-check' },
  { path: '/admin/onboard', label: 'Onboard Issuer', icon: 'user' },
  { path: '/admin/trust-bundle', label: 'Trust Bundle', icon: 'file-text' },
  { path: '/admin/monitoring', label: 'Monitoring', icon: 'settings' },
  { path: '/admin/audit', label: 'Audit Logs', icon: 'list-check' },
  { path: '/admin/users', label: 'Users & Roles', icon: 'settings' },
];

export function AdminLayout() {
  const location = useLocation();
  const engine = useCredentialEngine();
  const [user, setUser] = useState({ name: 'Admin User', role: 'System Admin', org: 'Consortium Governance' });

  useEffect(() => {
    engine.initializeWallet();
  }, [engine]);

  return (
    <Layout
      header={
        <header className="h-16 px-4 md:px-6 lg:px-8 bg-primary-50 border-b border-primary-200">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
                  <Icon name="settings" size={20} className="text-white" />
                </div>
                <span className="font-bold text-xl text-surface-900 hidden sm:block">Admin Dashboard</span>
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
                    {t(`admin.${item.label.toLowerCase().replace(' ', '').replace('&', '')}`) || item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="primary" size="sm" dot>
                {t('common.online')}
              </Badge>
              <Dropdown>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar size="sm" name={user.name} />
                  <span className="hidden sm:block font-medium">{user.name}</span>
                  <Icon name="chevron-down" size={16} />
                </Button>
                <Menu>
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
        <aside className="w-64 bg-white border-r border-surface-200 p-4 overflow-y-auto">
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
                {t(`admin.${item.label.toLowerCase().replace(' ', '').replace('&', '')}`) || item.label}
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