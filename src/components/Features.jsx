import React from 'react';

const featuresData = [
  {
    icon: '🚨',
    title: 'One-Tap Emergency SOS',
    desc: 'Instantly records your real-time GPS location and dispatches pre-composed emergency WhatsApp and SMS alerts to all your chosen guardians with a single tap.',
    color: 'from-pink-500 to-rose-600',
    tag: 'Core Feature'
  },
  {
    icon: '🗺️',
    title: 'Verified Safe Havens Radar',
    desc: 'Locate 24/7 women police assistance desks, all-night hospitals, illuminated pharmacies, and crisis shelters near you with turn-by-turn navigation.',
    color: 'from-purple-600 to-indigo-600',
    tag: 'Interactive Map'
  },
  {
    icon: '📢',
    title: 'High-Decibel Police Siren',
    desc: 'Loud, oscillating emergency distress siren synthesized directly through your device speakers to draw immediate public attention and deter threats.',
    color: 'from-pink-600 to-purple-600',
    tag: 'Audio Deterrent'
  },
  {
    icon: '📱',
    title: 'Simulated Fake Call Escape',
    desc: 'Need a discreet reason to leave an uncomfortable cab or conversation? Trigger an authentic incoming call complete with ringtone and simulated speech.',
    color: 'from-purple-500 to-pink-500',
    tag: 'Discreet Tool'
  },
  {
    icon: '🕶️',
    title: 'One-Click Stealth Disguise',
    desc: 'In case an unauthorized person approaches your phone, instantly morph the entire interface into a harmless working scientific calculator with one tap.',
    color: 'from-indigo-600 to-purple-700',
    tag: 'Privacy Shield'
  },
  {
    icon: '⚠️',
    title: 'Crowdsourced Safety Hazards',
    desc: 'Mark and discover dangerous unlit roads, broken streetlights, deserted alleys, and harassment hotspots with community-verified upvotes.',
    color: 'from-rose-500 to-pink-600',
    tag: 'Community Alert'
  }
];

export default function Features({ onOpenSOS }) {
  return (
    <section id="features" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
            🛡️ Comprehensive Protection
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Safety Features Built for Real Situations
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Every feature is designed to be accessible within milliseconds during high-pressure or discreet emergency moments.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((f, idx) => (
            <div 
              key={idx}
              className="group relative rounded-3xl p-8 bg-gradient-to-b from-slate-50/80 to-white border border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Tag & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-2xl text-white shadow-md group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                    {f.tag}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-pink-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {f.desc}
                </p>
              </div>

              {/* Bottom Subtle Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:text-pink-600">
                <span>Learn how it works</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlight Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Instant Action
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Ready in Any Emergency Situation
            </h3>
            <p className="text-sm text-pink-100 max-w-xl">
              No complicated logins or delays. Test our SOS simulation now to see how quickly alerts and location links are dispatched.
            </p>
          </div>
          <button
            onClick={onOpenSOS}
            className="px-8 py-4 rounded-2xl bg-white text-purple-900 font-extrabold text-sm shadow-lg hover:bg-pink-50 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            Launch Emergency SOS Test 🚨
          </button>
        </div>

      </div>
    </section>
  );
}
