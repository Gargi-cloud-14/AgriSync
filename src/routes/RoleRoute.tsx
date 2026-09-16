import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';
import { ROLE_LABELS } from '../config/constants';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

/**
 * RoleRoute verifies that the authenticated user possesses one of the allowed roles.
 * Includes student demo fallback to quickly test other roles with 1 click.
 */
export const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { role, switchRoleDemo, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Will be handled by wrapping ProtectedRoute
  }

  const hasAccess = role && (allowedRoles.includes(role) || role === 'ADMIN');

  if (!hasAccess) {
    const requiredLabel = allowedRoles.map((r) => ROLE_LABELS[r] || r).join(' or ');
    const currentLabel = role ? ROLE_LABELS[role] || role : 'Guest';

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-stone-50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Role Access Required</h2>
          <p className="text-stone-600 text-sm mb-4 leading-relaxed">
            This module is specifically designated for <span className="font-semibold text-emerald-700">{requiredLabel}</span>.
            Your current active role is <span className="font-semibold text-stone-800">{currentLabel}</span>.
          </p>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-left mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Team Development & Review Shortcut
            </p>
            <p className="text-xs text-emerald-700 mb-3">
              Switch role instantly to test this module without logging out:
            </p>
            <button
              onClick={() => switchRoleDemo(allowedRoles[0])}
              className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
            >
              Switch Role to {ROLE_LABELS[allowedRoles[0]] || allowedRoles[0]}
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-medium text-stone-500">
            <Link to="/" className="text-emerald-700 hover:underline">Return to Home</Link>
            <span>•</span>
            <Link to="/farmer" className="text-stone-600 hover:underline">Go to Farmer Portal</Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleRoute;
