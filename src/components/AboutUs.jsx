import React from 'react';

export default function AboutUs() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-purple-50/40 via-pink-50/20 to-white relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission Narrative */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
              💖 About SafeHer
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Empowering Women to Walk Without Fear.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              SafeHer was born from a simple belief: <strong className="text-slate-900">safety is a fundamental human right</strong>, never a privilege. Every woman deserves the freedom to travel, study, work, and explore without anxiety or hesitation.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We bridge the critical gap between distress and emergency response by pairing instant location technology with trusted human guardian circles and emergency first responders.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm">
                <span className="text-2xl mb-2 block">⚡</span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Sub-3s Speed</h4>
                <p className="text-xs text-slate-500">Every microsecond counts in an emergency.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm">
                <span className="text-2xl mb-2 block">🔒</span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Zero Tracking</h4>
                <p className="text-xs text-slate-500">GPS is only queried when you explicitly trigger SOS.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm">
                <span className="text-2xl mb-2 block">🤝</span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Community First</h4>
                <p className="text-xs text-slate-500">A network of women looking out for each other.</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Infographic & Quote Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quote Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 text-xl font-serif mb-4">
                “
              </div>

              <p className="text-base sm:text-lg font-medium leading-relaxed italic text-slate-100 mb-6">
                “True freedom is the ability to walk back home at midnight with the exact same peace of mind as walking at noon.”
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white">
                  SH
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">SafeHer Community Collective</h4>
                  <p className="text-xs text-pink-300">Protecting Over 50,000+ Journeys Daily</p>
                </div>
              </div>
            </div>

            {/* Quick Legal Awareness Box */}
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>⚖️</span> Know Your Fundamental Legal Rights
              </h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Zero FIR:</strong> You can lodge an FIR in any police station regardless of jurisdiction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Sunset Arrest Protection:</strong> A woman cannot be arrested after sunset or before sunrise.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Free Medical Aid:</strong> Immediate care at any hospital without awaiting police arrival.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
