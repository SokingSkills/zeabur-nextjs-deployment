import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  Settings,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { advisor } from '../data/mockData';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '總覽' },
  { to: '/clients', icon: Users, label: '客戶管理' },
  { to: '/reports', icon: FileText, label: '報告中心' },
  { to: '/tools', icon: Wrench, label: '工具箱' },
  { to: '/settings', icon: Settings, label: '設定' },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Demo Banner */}
      <div className="bg-accent-warm/10 border-b border-accent-warm/20 px-4 py-2 text-center text-sm text-accent-warm font-medium no-print">
        🔬 這是展示用的 Demo 環境，所有資料皆為模擬數據
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            flex flex-col bg-bg-card border-r border-border-light
            transition-all duration-200 ease-in-out
            ${collapsed ? 'w-[68px]' : 'w-[240px]'}
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 h-16 border-b border-border-light shrink-0">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-accent-warm flex items-center justify-center text-white font-bold text-sm shrink-0">
              F
            </div>
            {!collapsed && (
              <span className="font-serif font-semibold text-text-primary text-lg whitespace-nowrap">
                FinOS 財策長
              </span>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-accent-warm/10 text-accent-warm'
                      : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                  }
                  ${collapsed ? 'justify-center' : ''}`
                }
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Advisor info */}
          <div className="border-t border-border-light p-3 shrink-0">
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-accent-warm/15 flex items-center justify-center text-accent-warm font-semibold text-sm shrink-0">
                {advisor.name.charAt(0)}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {advisor.name}
                  </div>
                  <div className="text-xs text-text-tertiary truncate">
                    {advisor.certifications.join(' · ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center h-10 border-t border-border-light text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors"
          >
            <ChevronLeft
              size={16}
              className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center h-14 px-4 border-b border-border-light bg-bg-card shrink-0 no-print">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 text-text-secondary hover:text-text-primary"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 ml-2">
              <div className="w-6 h-6 rounded bg-accent-warm flex items-center justify-center text-white font-bold text-xs">
                F
              </div>
              <span className="font-serif font-semibold text-text-primary text-base">
                FinOS 財策長
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
