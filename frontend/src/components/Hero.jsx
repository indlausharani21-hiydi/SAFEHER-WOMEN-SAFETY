import React from 'react';

export default function Hero({ onOpenSOS }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Decorative Gradient Blobs (Pink, Purple, White) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-pink-300/40 via-purple-300/30 to-indigo-300/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 -left-12 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Hero Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 text-purple-900 text-xs font-bold shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
              </span>
              Next-Gen Personal Women Safety Network
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Your Safety, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Our Priority.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              SafeHer empowers every woman to walk fearlessly anywhere, anytime. 
              Trigger rapid emergency SOS, broadcast live GPS coordinates, find nearest verified safe havens, and activate discreet escape tools in seconds.
            </p>

            {/* Action Buttons: Emergency SOS & Get Started */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              
              {/* Emergency SOS Button */}
              <button
                onClick={onOpenSOS}
                className="sos-glow-button w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white font-extrabold text-base tracking-wide shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/60"
              >
                <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
                <span>🚨 EMERGENCY SOS</span>
              </button>

              {/* Get Started Button */}
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-purple-200 shadow-md hover:shadow-lg hover:border-purple-300 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore Features</span>
                <svg className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>

            </div>

            {/* Trust Metrics / Stats */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-pink-100 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">50K+</p>
                <p className="text-xs text-slate-500 font-medium">Protected Women</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">&lt; 3s</p>
                <p className="text-xs text-slate-500 font-medium">Alert Dispatch</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-black text-purple-700">100%</p>
                <p className="text-xs text-slate-500 font-medium">Free & 24/7 Live</p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive App Preview Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Decorative background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-3xl blur-2xl opacity-20 transform -rotate-3 scale-95" />

            {/* Phone-styled Card */}
            <div className="relative w-full max-w-sm rounded-[2.5rem] bg-white p-6 shadow-2xl border-4 border-white/80 ring-1 ring-slate-100">
              
              {/* Top Notch & Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-700">GPS Live Protection</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">9:41 AM</span>
              </div>

              {/* Radar Simulation */}
              <div className="my-6 relative flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-purple-50 via-pink-50 to-white border border-pink-100">
                <div className="w-36 h-36 rounded-full border border-purple-200/60 flex items-center justify-center relative">
                  <div className="w-24 h-24 rounded-full border border-pink-300/80 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/40">
                      📍
                    </div>
                  </div>
                  {/* Surrounding safe pins */}
                  <span className="absolute -top-1 right-2 text-xs bg-white px-2 py-0.5 rounded-full border border-blue-200 shadow-sm">
                    👮 Police 0.4km
                  </span>
                  <span className="absolute -bottom-1 left-2 text-xs bg-white px-2 py-0.5 rounded-full border border-red-200 shadow-sm">
                    🏥 Clinic 0.7km
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-4">Active Safe Zone Radar</p>
                <p className="text-[11px] text-slate-500">2 Verified Shelters within 1 km</p>
              </div>

              {/* Simulated SOS Button inside card */}
              <button
                onClick={onOpenSOS}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-extrabold text-sm shadow-lg shadow-red-500/30 hover:opacity-95 transition"
              >
                TAP TO TRIGGER SOS
              </button>

              {/* Bottom Quick Tools */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-800">📱 Fake Call</p>
                  <p className="text-[10px] text-slate-500">Instant escape</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-800">🕶️ Stealth Mode</p>
                  <p className="text-[10px] text-slate-500">Disguise app</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
