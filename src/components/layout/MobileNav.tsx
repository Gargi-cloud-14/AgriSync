import React from 'react';
import { NavLink } from 'react-router-dom';
import type { UserRole } from '../../types';
import { Wheat, Warehouse, Truck, Store, QrCode } from 'lucide-react';

interface MobileNavProps {
  role: UserRole;
}

export const MobileNav: React.FC<MobileNavProps> = ({ role }) => {
  const getRoleIcon = () => {
    switch (role) {
      case 'STORAGE_PROVIDER':
        return <Warehouse className="w-5 h-5" />;
      case 'TRANSPORTER':
        return <Truck className="w-5 h-5" />;
      case 'BUYER':
        return <Store className="w-5 h-5" />;
      case 'FARMER':
      default:
        return <Wheat className="w-5 h-5" />;
    }
  };

  const getDashboardPath = () => {
    switch (role) {
      case 'STORAGE_PROVIDER':
        return '/storage';
      case 'TRANSPORTER':
        return '/transporter';
      case 'BUYER':
        return '/buyer';
      case 'ADMIN':
        return '/admin';
      case 'FARMER':
      default:
        return '/farmer';
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2 flex items-center justify-around shadow-lg">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium ${
            isActive ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`
        }
      >
        <span className="text-base">🌾</span>
        <span>Home</span>
      </NavLink>

      <NavLink
        to={getDashboardPath()}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium ${
            isActive ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`
        }
      >
        {getRoleIcon()}
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/verify/AGRI-2026-00421"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium ${
            isActive ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`
        }
      >
        <QrCode className="w-5 h-5" />
        <span>Verify QR</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
