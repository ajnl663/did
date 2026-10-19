import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Icon, Avatar, Dropdown, MenuItem, MenuDivider, MenuLabel } from '@did-workers/design-system';
import { useCredentialEngine } from '../context/CredentialEngineContext';
import { useEffect, useState } from 'react';
import { t, setLanguage } from '@did-workers/i18n';
import { clsx } from 'clsx';

const navItems = [
  { path: '/verifier/dashboard', label: 'Dashboard', icon: 'home' },
  { path: '/verifier/create', label: 'Create Request', icon: 'scan-line' },
  { path: '/verifier/requests', label: 'Active Requests', icon: 'list-check' },
  { path: '/verifier/history', label: 'History', icon: 'file-text' },
];

export function VerifierLayout() {
  const location = useLocation();
  const engine = useCredentialEngine();
  const [user] = useState({ name: 'Rajesh Verma', role: 'Verifier Operator', org: 'Welfare Desk · Bandra' });

  useEffect(() => {
    engine.initializeWallet();
  }, [engine]);

  const navLabel = (item: { label: string }) =>
    t(`verifierPortal.${item.label.toLowerCase().replace(/[^a-z]/g, '')}`) || item.label;

  const isActive = (path: string) => location.pathname === path;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-sidebar-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-success-500 to-success-700 flex items-center justify-center shadow-lg shadow-success-900/30">
            <Icon name="shield-check" size={22} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sidebar-text-active text-sm leading-tight">DID Workers</p>
            <p className="text-[11px] text-sidebar-text/70 leading-tight">Verifier Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        <p className="nav-section-label">Menu</p>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              isActive(item.path)
                ? 'bg-success-500/15 text-success-300 shadow-sm'
                : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active'
            )}
          >
            <Icon name={item.icon} size={18} className={isActive(item.path) ? 'text-success-400' : ''} />
            {navLabel(item)}
          </Link>
        ))}

        <div className="mt-6 rounded-xl bg-sidebar-hover/50 p-3.5 border border-sidebar-border/40">
          <div className="flex items-center gap-2 mb-1.5">
            <Icon name="wifi-off" size={16} className="text-warning-400" />
            <span className="text-xs font-semibold text-sidebar-text-active">Offline Ready</span>
          </div>
          <p className="text-[11px] text-sidebar-text/60 leading-relaxed">
            Trust data cached locally. Verifications work without network.
          </p>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border/60">
        <div className="rounded-xl bg-sidebar-hover/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
            <span className="text-xs font-medium text-sidebar-text-active">Connected</span>
          </div>
          <p className="text-[11px] text-sidebar-text/60 leading-relaxed">
            {user.org}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout
      header={
        <header className="h-16 px-4 md:px-6 glass-header border-b border-surface-200">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <span className="text-surface-400 text-xs font-medium">Verifier Portal</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-surface-400 text-sm">
                <Icon name="scan-line" size={16} className="text-surface-400" />
                <span className="font-medium text-surface-600">{user.org}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-50 border border-success-200">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                <span className="text-xs font-medium text-success-700">{t('common.online')}</span>
              </div>

              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface-100 transition-colors">
                    <Avatar size="sm" name={user.name} />
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-surface-800 leading-tight">{user.name}</p>
                      <p className="text-[11px] text-surface-500 leading-tight">{user.role}</p>
                    </div>
                    <Icon name="chevron-down" size={16} className="text-surface-400" />
                  </button>
                }
              >
                <div className="px-3 py-2.5 border-b border-surface-100">
                  <p className="text-sm font-semibold text-surface-800">{user.name}</p>
                  <p className="text-xs text-surface-500">{user.role}</p>
                </div>
                <MenuLabel>Language</MenuLabel>
                <MenuItem onSelect={() => setLanguage('en')} icon={<Icon name="flag" size={14} />}>English</MenuItem>
                <MenuItem onSelect={() => setLanguage('hi')} icon={<Icon name="flag" size={14} />}>हिन्दी</MenuItem>
                <MenuItem onSelect={() => setLanguage('mr')} icon={<Icon name="flag" size={14} />}>मराठी</MenuItem>
                <MenuDivider />
                <MenuItem onSelect={() => window.location.href = '/login'} destructive icon={<Icon name="logout" size={14} />}>
                  Sign Out
                </MenuItem>
              </Dropdown>
            </div>
          </div>
        </header>
      }
      sidebar={sidebarContent}
    >
      <Outlet />
    </Layout>
  );
}
