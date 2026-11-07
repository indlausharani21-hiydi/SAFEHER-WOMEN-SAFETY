import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AutoSensors from './components/AutoSensors';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import EmergencyModal from './components/EmergencyModal';

export default function App() {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-pink-50/20 to-purple-50/30 font-sans text-slate-800">
      
      {/* Top Navigation */}
      <Navbar onOpenSOS={() => setIsEmergencyOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero onOpenSOS={() => setIsEmergencyOpen(true)} />
        <Features onOpenSOS={() => setIsEmergencyOpen(true)} />
        <AutoSensors onTriggerSOS={() => setIsEmergencyOpen(true)} />
        <AboutUs />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Emergency SOS Modal Pop-up */}
      <EmergencyModal 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)} 
      />

      {/* Persistent Floating Emergency Button for Mobile & Desktop */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="sos-glow-button flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white font-extrabold text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white"
          title="Instant Emergency SOS"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
          <span>🚨 SOS HELP</span>
        </button>
      </div>

    </div>
  );
}
