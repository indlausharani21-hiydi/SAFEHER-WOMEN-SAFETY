import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                🛡️
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                SafeHer
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              SafeHer is an open, community-driven women’s safety initiative dedicated to ensuring every woman’s freedom, dignity, and real-time protection anytime, anywhere.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-pink-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              24/7 Digital Safety Network Active
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="text-sm space-y-2">
              <li><a href="#features" className="hover:text-pink-400 transition">Safety Features</a></li>
              <li><a href="#about" className="hover:text-pink-400 transition">About SafeHer</a></li>
              <li><a href="#helpline" className="hover:text-pink-400 transition">Emergency Directory</a></li>
              <li><a href="#contact" className="hover:text-pink-400 transition">Support & Contact</a></li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              National Hotlines
            </h4>
            <ul className="text-sm space-y-2 font-mono">
              <li><a href="tel:112" className="text-red-400 hover:underline">112 - National SOS</a></li>
              <li><a href="tel:1091" className="text-purple-400 hover:underline">1091 - Women Help</a></li>
              <li><a href="tel:108" className="text-emerald-400 hover:underline">108 - Ambulance</a></li>
              <li><a href="tel:1930" className="text-blue-400 hover:underline">1930 - Cyber Safety</a></li>
            </ul>
          </div>

          {/* Legal Rights Notice */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Safety Rights
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Under Indian Criminal Law (CrPC Sec 46/154), women have the absolute right to file a <strong>Zero FIR</strong> at any police station and are protected from arrest after sunset.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SafeHer Platform. Built with care for women's safety & empowerment.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
            <a href="#helpline" className="text-pink-400 hover:underline font-bold">Emergency 112</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
