import React, { type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ROLE_LABELS, APP_NAME } from '../../config/constants';
import { Link } from 'react-router-dom';
import { ShieldCheck, Bell } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  actionButton,
}) => {
  const { user, role } = useAuth();
  const activeRole = role || 'FARMER';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row text-stone-800">
      {/* Desktop Left Sidebar */}
      <div className="hidden md:block">
        <Sidebar currentRole={activeRole} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <Link to="/" className="md:hidden flex items-center gap-1.5 font-bold font-heading text-emerald-800">
              <span>🌾</span>
              <span>{APP_NAME}</span>
            </Link>
            <div className="hidden md:block">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
                {ROLE_LABELS[activeRole] || activeRole}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100/80 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>AgriSync Network Verified</span>
            </div>
            <button
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <span className="text-xs font-medium text-stone-700 hidden lg:inline-block">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Page Heading */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-stone-900 tracking-tight">
                {title}
              </h1>
              {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
            </div>
            {actionButton && <div className="shrink-0">{actionButton}</div>}
          </div>

          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav role={activeRole} />
    </div>
  );
};

export default DashboardLayout;
