import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME, APP_TAGLINE, NAV_LINKS, ROLE_LABELS } from '../../config/constants';
import {
  Menu,
  X,
  Globe,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Search,
  Sparkles,
  ShieldCheck,
  Warehouse,
  Truck,
  Store,
  Sprout,
  ArrowRight,
  Bot,
  MapPin,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { NavbarTicker } from './NavbarTicker';
import { NavbarTrackModal } from './NavbarTrackModal';
import { NavbarAiCopilot } from './NavbarAiCopilot';
import { RegionGpsSelector } from './RegionGpsSelector';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'HI' | 'MR'>('EN');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [portalsMenuOpen, setPortalsMenuOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setPortalsMenuOpen(false);
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate(href);
      } else {
        const id = href.replace('/#', '');
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(href);
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

  const rolePortals = [
    {
      role: 'FARMER',
      title: 'Farmer Portal',
      hindi: 'किसान पोर्टल',
      desc: 'List produce, book cold storage & verify payments',
      href: '/farmer',
      icon: Sprout,
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
    },
    {
      role: 'STORAGE',
      title: 'Cold Storage Hub',
      hindi: 'शीतगृह पोर्टल',
      desc: 'Chamber telemetry, bay occupancy & alerts',
      href: '/storage',
      icon: Warehouse,
      color: 'text-sky-400 bg-sky-950/80 border-sky-800',
    },
    {
      role: 'TRANSPORTER',
      title: 'Reefer Freight',
      hindi: 'परिवहन पोर्टल',
      desc: 'Route optimization & reefer temperature custody',
      href: '/transporter',
      icon: Truck,
      color: 'text-amber-400 bg-amber-950/80 border-amber-800',
    },
    {
      role: 'BUYER',
      title: 'Wholesale Mandi',
      hindi: 'मंडी खरीदार',
      desc: 'Verify batch QR provenance & direct settlement',
      href: '/buyer',
      icon: Store,
      color: 'text-teal-400 bg-teal-950/80 border-teal-800',
    },
  ];

  return (
    <>
      {/* 1. Top Agricultural Intelligence & Mandi Ticker HUD */}
      <NavbarTicker
        onOpenAiCopilot={() => setAiCopilotOpen(true)}
        onOpenTracker={() => setTrackModalOpen(true)}
        currentLang={currentLang}
        onSelectLang={(lang) => setCurrentLang(lang)}
      />

      {/* 2. Main Executive Command Navbar - Cohesive Dark UI with High Contrast */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-950/95 backdrop-blur-md border-b border-stone-800 shadow-xl py-2.5'
            : 'bg-stone-950/90 backdrop-blur-sm border-b border-stone-850 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Brand Identity */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1 shrink-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-850 to-stone-950 flex items-center justify-center text-white shadow-md border border-emerald-500/40 group-hover:scale-105 transition-all">
                <span className="text-xl sm:text-2xl" role="img" aria-label="wheat">
                  🌾
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-extrabold font-heading text-white tracking-tight">
                    {APP_NAME}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 tracking-wider">
                    AI AGRI-GRID
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-300 font-medium tracking-tight truncate max-w-[190px] sm:max-w-none">
                  {APP_TAGLINE}
                </p>
              </div>
            </Link>

            {/* Center: Module Links & Role Megamenu */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-900 border border-transparent hover:border-stone-800 transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}

              {/* Role Portals Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPortalsMenuOpen(!portalsMenuOpen)}
                  onBlur={() => setTimeout(() => setPortalsMenuOpen(false), 200)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    portalsMenuOpen
                      ? 'bg-emerald-950 text-emerald-200 border border-emerald-700'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <span>Role Hubs</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      portalsMenuOpen ? 'rotate-180 text-emerald-400' : 'text-stone-400'
                    }`}
                  />
                </button>

                {portalsMenuOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-stone-900 rounded-2xl shadow-2xl border border-stone-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-white">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2.5 py-1 mb-1 font-mono">
                      Agricultural Role Gateways
                    </div>
                    <div className="space-y-1">
                      {rolePortals.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.role}
                            to={item.href}
                            onClick={() => setPortalsMenuOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-850 border border-transparent hover:border-stone-750 transition-all group"
                          >
                            <div className={`p-2 rounded-lg border shrink-0 ${item.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white group-hover:text-emerald-400">
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-stone-400 font-hindi">
                                  {item.hindi}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-400 leading-tight mt-0.5 line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Region & GPS Selector in Main Navbar */}
              <div className="hidden sm:block">
                <RegionGpsSelector />
              </div>

              {/* Unique In-Navbar Quick Batch Tracker Button */}
              <button
                onClick={() => setTrackModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 text-xs font-semibold border border-stone-800 hover:border-stone-700 shadow-xs transition-colors group cursor-pointer"
                title="Quick Track Batch on Blockchain Ledger"
              >
                <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Track Batch</span>
              </button>

              {/* Unique Agri-AI Copilot Trigger */}
              <button
                onClick={() => setAiCopilotOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-850 via-emerald-750 to-teal-800 hover:from-emerald-750 hover:to-teal-700 text-white text-xs font-bold shadow-md transition-all border border-emerald-500/40 cursor-pointer"
                title="Open Agri-AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="hidden sm:inline">Kisan AI</span>
                <span className="sm:hidden">AI</span>
              </button>

              {/* User Authentication / Dashboard Links */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-bold leading-tight text-white">{user.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-emerald-400 font-medium leading-none font-mono">
                        {ROLE_LABELS[user.role]?.split(' ')[0] || user.role}
                      </p>
                    </div>
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                  </Link>

                  <button
                    onClick={() => logout()}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-red-400 hover:bg-stone-900 border border-transparent hover:border-stone-800 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-stone-300 hover:text-white hover:bg-stone-900"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 font-bold"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <div className="flex items-center gap-1.5 lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 border border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Full Navigation Drawer - Dark & Refined */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-800 bg-stone-950 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-3 duration-200 text-white">
            {/* Mobile Regional & GPS Selector */}
            <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono block">
                  Agro-Grid Location
                </span>
                <span className="text-xs text-stone-300">Default: Madhya Pradesh (MP)</span>
              </div>
              <RegionGpsSelector />
            </div>

            {/* Quick Track Input in Mobile Drawer */}
            <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono block mb-1.5">
                Instant Batch Verification
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTrackModalOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-semibold flex items-center justify-between shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify Batch Ledger</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>

            {/* Role Portals Grid */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono block mb-2 px-1">
                Portals & Dashboards
              </span>
              <div className="grid grid-cols-2 gap-2">
                {rolePortals.map((portal) => {
                  const Icon = portal.icon;
                  return (
                    <Link
                      key={portal.role}
                      to={portal.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 flex flex-col items-start gap-1"
                    >
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">{portal.title}</span>
                      <span className="text-[10px] text-stone-400 font-hindi">{portal.hindi}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Navigation Section Anchors */}
            <nav className="flex flex-col space-y-1 pt-1 border-t border-stone-850">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:bg-stone-900 hover:text-white"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* AI Assistant Mobile Quick Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAiCopilotOpen(true);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Launch Kisan AI Copilot</span>
            </button>

            {/* Auth Actions in Mobile Drawer */}
            <div className="pt-2 border-t border-stone-850 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[11px] text-stone-400 font-mono">{ROLE_LABELS[user.role]}</p>
                    </div>
                    <Badge variant="emerald">Active</Badge>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <Button variant="primary" size="md" className="w-full text-xs">
                      Open Command Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-xs text-red-400 hover:bg-stone-900"
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs bg-stone-900 text-white border-stone-800"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full text-xs font-bold">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 3. In-Navbar Quick Modals */}
      <NavbarTrackModal isOpen={trackModalOpen} onClose={() => setTrackModalOpen(false)} />
      <NavbarAiCopilot isOpen={aiCopilotOpen} onClose={() => setAiCopilotOpen(false)} />
    </>
  );
};

export default Navbar;
