import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, EPICS_NOTE } from '../../config/constants';
import { ShieldCheck, HeartHandshake, Leaf, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="about" className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xl shadow-inner">
                🌾
              </div>
              <span className="text-2xl font-bold font-heading text-white tracking-tight">
                {APP_NAME}
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Smart Agriculture. Connected Supply Chains. Stronger Communities.
              A decentralized multi-stakeholder network linking cultivators, warehouses, freight operators, and terminal markets.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/80 border border-stone-700/60 text-xs text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{EPICS_NOTE}</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4">
              Platform Modules
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/farmer" className="hover:text-emerald-400 transition-colors">
                  Farmer Portal
                </Link>
              </li>
              <li>
                <Link to="/storage" className="hover:text-emerald-400 transition-colors">
                  Cold Storage Management
                </Link>
              </li>
              <li>
                <Link to="/transporter" className="hover:text-emerald-400 transition-colors">
                  Transport & Fleet Logistics
                </Link>
              </li>
              <li>
                <Link to="/buyer" className="hover:text-emerald-400 transition-colors">
                  Mandi Traders & Buyers
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors">
                  Network Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4">
              Technology
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <a href="#smart-transport" className="hover:text-emerald-400 transition-colors">
                  Smart Logistics Engine
                </a>
              </li>
              <li>
                <a href="#iot-monitoring" className="hover:text-emerald-400 transition-colors">
                  IoT Sensor Monitoring (ESP32)
                </a>
              </li>
              <li>
                <a href="#weather" className="hover:text-emerald-400 transition-colors">
                  Weather Intelligence
                </a>
              </li>
              <li>
                <a href="#traceability" className="hover:text-emerald-400 transition-colors">
                  Blockchain Provenance
                </a>
              </li>
              <li>
                <Link to="/verify/AGRI-2026-00421" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Batch Verification (QR)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <a href="#community" className="hover:text-emerald-400 transition-colors">
                  Mission & Grassroots Impact
                </a>
              </li>
              <li>
                <a href="#problem" className="hover:text-emerald-400 transition-colors">
                  Post-Harvest Wastage Reduction
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  Accessibility & Digital Inclusion
                </a>
              </li>
              <li>
                <span className="text-stone-500 text-xs">Student Engineering Team (EPICS)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 {APP_NAME}. Built as an Academic / EPICS Engineering Project.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-stone-400">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Sustainable Supply Chains
            </span>
            <span className="flex items-center gap-1 text-stone-400">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" /> Grassroots Empowerment
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
