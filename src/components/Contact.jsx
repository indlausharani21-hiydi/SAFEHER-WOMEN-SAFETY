import React, { useState } from 'react';

const helplines = [
  {
    number: '112',
    label: 'All-in-One National Emergency',
    sub: 'Police, Fire, Disaster Management',
    color: 'bg-red-50 text-red-700 border-red-200'
  },
  {
    number: '1091',
    label: 'Women in Distress Helpline',
    sub: '24/7 Dedicated Women Support',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    number: '108',
    label: 'Emergency Ambulance',
    sub: 'Immediate Medical & Trauma Response',
    color: 'bg-pink-50 text-pink-700 border-pink-200'
  },
  {
    number: '1930',
    label: 'Cyber Crime & Online Stalking',
    sub: 'Digital Harassment, Image Abuse',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Safety Feedback',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: 'Safety Feedback', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
            📞 24/7 Reach & Support
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Emergency Hotlines & Contact Us
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            For urgent danger, dial the national numbers below immediately. For inquiries, safety partnerships, or feedback, send us a message.
          </p>
        </div>

        {/* 1. Emergency Helpline Directory */}
        <div id="helpline" className="mb-16">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>🚨</span> Instant Emergency Dialers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {helplines.map((h, idx) => (
              <a
                key={idx}
                href={`tel:${h.number}`}
                className={`p-6 rounded-3xl border ${h.color} hover:scale-[1.02] active:scale-95 transition-all shadow-sm flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider opacity-80">Direct Call</span>
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shadow-sm">📞</span>
                  </div>
                  <h4 className="text-3xl font-black mb-1">{h.number}</h4>
                  <p className="text-sm font-bold text-slate-800">{h.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{h.sub}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-current/10 text-xs font-bold flex items-center gap-1 group-hover:underline">
                  Tap to Call Now →
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 2. Contact & Feedback Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-gradient-to-b from-purple-50/50 to-pink-50/30 rounded-3xl p-8 sm:p-12 border border-pink-100 shadow-sm">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-black text-slate-900">
              Get in Touch with the SafeHer Team
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We collaborate with colleges, police departments, transport operators, and women safety advocates across the country. Let us know how we can help.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
                  ✉️
                </div>
                <div>
                  <p className="text-xs text-slate-500">Official Support Email</p>
                  <p className="text-sm font-bold text-slate-900">help@safeher-network.org</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  🏢
                </div>
                <div>
                  <p className="text-xs text-slate-500">Women Protection Cell HQ</p>
                  <p className="text-sm font-bold text-slate-900">National Women Safety Directorate</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  🌐
                </div>
                <div>
                  <p className="text-xs text-slate-500">Digital Response Hours</p>
                  <p className="text-sm font-bold text-slate-900">24 Hours / 7 Days a Week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-pink-100">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-slate-900">Thank You for Reaching Out!</h4>
                <p className="text-sm text-slate-600">Your message has been securely submitted to our response desk.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ananya Sharma" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. ananya@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject / Department</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition text-slate-700"
                  >
                    <option value="Safety Feedback">Safety Feedback / Suggestion</option>
                    <option value="Campus Safety">Campus or Workplace Safety Integration</option>
                    <option value="Safe Haven Verification">Submit a Verified Safe Haven</option>
                    <option value="Volunteer">Volunteer with SafeHer Network</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Message</label>
                  <textarea 
                    rows="4" 
                    required
                    placeholder="Tell us how we can help or provide safety feedback..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-pink-500/20 active:scale-95 transition-all"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
