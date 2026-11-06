import React, { useState } from 'react';

export default function Navbar({ onOpenSOS }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-pink-100/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  SafeHer
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full border border-pink-200">
                  24/7
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Your Safety, Our Priority</p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">
              Safety Features
            </a>
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">
              About Us
            </a>
            <a href="#helpline" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">
              Emergency Directory
            </a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* Quick Actions (Hotline + SOS Trigger) */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="tel:1091" 
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold border border-purple-200 transition shadow-sm"
              title="Call National Women Helpline"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Helpline: 1091
            </a>

            <button
              onClick={onOpenSOS}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              Emergency SOS
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenSOS}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs shadow-sm flex items-center gap-1"
            >
              🚨 SOS
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              aria-label="Toggle Navigation"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-pink-100 bg-white/95 rounded-2xl p-4 shadow-xl mb-4 space-y-3">
            <a 
              href="#features" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-pink-600"
            >
              Safety Features
            </a>
            <a 
              href="#about" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-pink-600"
            >
              About Us
            </a>
            <a 
              href="#helpline" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-pink-600"
            >
              Emergency Directory
            </a>
            <a 
              href="#contact" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-pink-600"
            >
              Contact
            </a>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <a href="tel:1091" className="text-xs font-bold text-purple-700 flex items-center gap-1">
                📞 Helpline: 1091
              </a>
              <a href="tel:112" className="text-xs font-bold text-red-600 flex items-center gap-1">
                🚨 Emergency: 112
              </a>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
