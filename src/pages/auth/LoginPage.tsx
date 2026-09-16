import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES, ROLE_LABELS, APP_NAME } from '../../config/constants';
import type { UserRole } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Lock, Mail, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('farmer@agrisync.org');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login, switchRoleDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || getRoleRedirect(selectedRole);

  function getRoleRedirect(role: UserRole) {
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await login({ email, password, role: selectedRole });
      navigate(getRoleRedirect(selectedRole), { replace: true });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoAccount = (role: UserRole, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('demoPass123');
    switchRoleDemo(role);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public AgriSync Network</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
            🌾
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-stone-900 tracking-tight">
            Sign In to {APP_NAME}
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Access your agricultural supply-chain management workspace
          </p>
        </div>

        <Card variant="default" padding="lg" className="bg-white border-stone-300 shadow-md">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Select Your Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              >
                <option value="FARMER">🌾 Farmer / Producer</option>
                <option value="STORAGE_PROVIDER">📦 Cold Storage Provider</option>
                <option value="TRANSPORTER">🚚 Logistics & Transporter</option>
                <option value="BUYER">🏪 Mandi Trader & Bulk Buyer</option>
                <option value="ADMIN">🛡️ Platform Administrator</option>
              </select>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address or Kisan ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder="name@agrisync.org"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full font-semibold shadow-sm"
              >
                Sign In to {ROLE_LABELS[selectedRole]?.split(' ')[0]} Workspace
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials Box for Student Team */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Team Testing Quick-Login</span>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Click any role to populate verified demonstration credentials:
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setDemoAccount('FARMER', 'farmer@agrisync.org')}
                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-left font-medium text-stone-700"
              >
                🌾 Farmer Patil
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('STORAGE_PROVIDER', 'storage@agrisync.org')}
                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-left font-medium text-stone-700"
              >
                📦 Storage Kulkarni
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('TRANSPORTER', 'transporter@agrisync.org')}
                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-left font-medium text-stone-700"
              >
                🚚 Transport Deshmukh
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('BUYER', 'buyer@agrisync.org')}
                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-left font-medium text-stone-700"
              >
                🏪 Buyer Mehta
              </button>
            </div>
          </div>
        </Card>

        {/* Footer Register Link */}
        <p className="mt-6 text-center text-xs text-stone-600">
          Not registered yet?{' '}
          <Link to="/register" className="font-bold text-emerald-800 hover:underline">
            Register your farm or facility
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
