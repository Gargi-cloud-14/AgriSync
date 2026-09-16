import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS, APP_NAME } from '../../config/constants';
import type { UserRole } from '../../types';
import {
  Wheat,
  Warehouse,
  Truck,
  Store,
  Shield,
  Home,
  QrCode,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  activePath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole }) => {
  const { user, logout, switchRoleDemo } = useAuth();

  const roleNavMap: Record<UserRole, Array<{ label: string; to: string; icon: React.ReactNode }>> = {
    FARMER: [
      { label: 'Farm Produce Overview', to: '/farmer', icon: <Wheat className="w-4 h-4" /> },
      { label: 'Nearby Cold Storage', to: '/farmer#storage', icon: <Warehouse className="w-4 h-4" /> },
      { label: 'Freight Transport', to: '/farmer#transport', icon: <Truck className="w-4 h-4" /> },
      { label: 'Batch Provenance & QR', to: '/verify/AGRI-2026-00421', icon: <QrCode className="w-4 h-4" /> },
    ],
    STORAGE_PROVIDER: [
      { label: 'Chamber Capacity', to: '/storage', icon: <Warehouse className="w-4 h-4" /> },
      { label: 'IoT Climate Sensors', to: '/storage#telemetry', icon: <Sparkles className="w-4 h-4" /> },
      { label: 'Incoming Batches', to: '/storage#batches', icon: <Wheat className="w-4 h-4" /> },
    ],
    TRANSPORTER: [
      { label: 'Active Trips & Fleet', to: '/transporter', icon: <Truck className="w-4 h-4" /> },
      { label: 'Route Optimization', to: '/transporter#routes', icon: <ChevronRight className="w-4 h-4" /> },
      { label: 'Delivery Requests', to: '/transporter#requests', icon: <Wheat className="w-4 h-4" /> },
    ],
    BUYER: [
      { label: 'Marketplace Produce', to: '/buyer', icon: <Store className="w-4 h-4" /> },
      { label: 'Batch Verifications', to: '/verify/AGRI-2026-00421', icon: <QrCode className="w-4 h-4" /> },
      { label: 'Procurement History', to: '/buyer#history', icon: <Wheat className="w-4 h-4" /> },
    ],
    ADMIN: [
      { label: 'Platform Governance', to: '/admin', icon: <Shield className="w-4 h-4" /> },
      { label: 'Traceability Explorer', to: '/verify/AGRI-2026-00421', icon: <QrCode className="w-4 h-4" /> },
    ],
  };

  const navItems = roleNavMap[currentRole] || roleNavMap.FARMER;

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center text-lg shadow-sm">
            🌾
          </div>
          <div>
            <span className="font-bold font-heading text-stone-900 tracking-tight text-lg leading-tight block">
              {APP_NAME}
            </span>
            <span className="text-[10px] uppercase font-semibold text-emerald-700 tracking-wider">
              {ROLE_LABELS[currentRole]?.split(' ')[0]} Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="p-4 flex-1 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2">
            Module Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Rapid Role Switcher for 6-Member Team */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-2">
            Team Testing Switcher
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => switchRoleDemo('FARMER')}
              className={`px-2 py-1.5 rounded text-left font-medium transition-colors ${
                currentRole === 'FARMER' ? 'bg-emerald-700 text-white' : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
              }`}
            >
              🌾 Farmer
            </button>
            <button
              onClick={() => switchRoleDemo('STORAGE_PROVIDER')}
              className={`px-2 py-1.5 rounded text-left font-medium transition-colors ${
                currentRole === 'STORAGE_PROVIDER' ? 'bg-emerald-700 text-white' : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
              }`}
            >
              📦 Storage
            </button>
            <button
              onClick={() => switchRoleDemo('TRANSPORTER')}
              className={`px-2 py-1.5 rounded text-left font-medium transition-colors ${
                currentRole === 'TRANSPORTER' ? 'bg-emerald-700 text-white' : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
              }`}
            >
              🚚 Transport
            </button>
            <button
              onClick={() => switchRoleDemo('BUYER')}
              className={`px-2 py-1.5 rounded text-left font-medium transition-colors ${
                currentRole === 'BUYER' ? 'bg-emerald-700 text-white' : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
              }`}
            >
              🏪 Buyer
            </button>
          </div>
        </div>

        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2">
            Platform Links
          </p>
          <nav className="space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <Home className="w-4 h-4 text-stone-500" />
              <span>Public Landing Page</span>
            </Link>
            <Link
              to="/verify/AGRI-2026-00421"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <QrCode className="w-4 h-4 text-stone-500" />
              <span>Scan QR / Traceability</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-stone-100 bg-stone-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-stone-900 truncate">
                {user?.name || 'Authorized Member'}
              </p>
              <p className="text-[10px] text-stone-500 truncate">{user?.email || 'Logged In'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
