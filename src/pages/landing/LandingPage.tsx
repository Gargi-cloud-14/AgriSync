import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { HeroSection } from '../../components/landing/HeroSection';
import { TrustStrip } from '../../components/landing/TrustStrip';
import { ProblemSection } from '../../components/landing/ProblemSection';
import { SolutionSection } from '../../components/landing/SolutionSection';
import { HowItWorksSection } from '../../components/landing/HowItWorksSection';
import { SmartTransportSection } from '../../components/landing/SmartTransportSection';
import { WeatherIntelligenceSection } from '../../components/landing/WeatherIntelligenceSection';
import { IotMonitoringSection } from '../../components/landing/IotMonitoringSection';
import { BlockchainTraceabilitySection } from '../../components/landing/BlockchainTraceabilitySection';
import { CommunityImpactSection } from '../../components/landing/CommunityImpactSection';
import { RolePreviewSection } from '../../components/landing/RolePreviewSection';

export const LandingPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        // Small delay to ensure DOM rendering completes before scrolling
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 80);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustStrip />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <SmartTransportSection />
        <WeatherIntelligenceSection />
        <IotMonitoringSection />
        <BlockchainTraceabilitySection />
        <CommunityImpactSection />
        <RolePreviewSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
