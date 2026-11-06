import React, { useState, useEffect, useRef } from 'react';

export default function EmergencyModal({ isOpen, onClose }) {
  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [isSirenActive, setIsSirenActive] = useState(false);
  
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const sirenIntervalRef = useRef(null);

  // Initialize Web Audio API Police Siren
  const startSiren = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.5, audioCtxRef.current.currentTime);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();

      oscRef.current = osc;
      setIsSirenActive(true);

      let up = true;
      let freq = 600;
      sirenIntervalRef.current = setInterval(() => {
        if (up) {
          freq += 80;
          if (freq >= 1200) up = false;
        } else {
          freq -= 80;
          if (freq <= 600) up = true;
        }
        if (oscRef.current) {
          oscRef.current.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        }
      }, 50);
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  };

  const stopSiren = () => {
    setIsSirenActive(false);
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
  };

  // Reset & Geolocation on Modal Open
  useEffect(() => {
    if (isOpen) {
      setCountdown(3);
      setIsCountingDown(true);

      // Fetch GPS Location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            });
          },
          (err) => {
            console.warn('Geolocation permission not granted, using demo fallback:', err);
            setCoords({ lat: 28.6139, lng: 77.2090 }); // Default city coordinates
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }
    } else {
      stopSiren();
    }
    return () => stopSiren();
  }, [isOpen]);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen || !isCountingDown) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsCountingDown(false);
    }
  }, [isOpen, isCountingDown, countdown]);

  if (!isOpen) return null;

  // Formulate direct WhatsApp & SMS links with live coordinates
  const mapUrl = coords.lat && coords.lng
    ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
    : 'https://maps.google.com';

  const emergencyMessage = encodeURIComponent(
    `EMERGENCY! I need immediate help. Here is my current real-time GPS location: ${mapUrl} (Sent via SafeHer Network)`
  );

  const whatsappLink = `https://api.whatsapp.com/send?text=${emergencyMessage}`;
  const smsLink = `sms:?body=${emergencyMessage}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-red-500 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            stopSiren();
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
        >
          ✕
        </button>

        {isCountingDown ? (
          /* 3-Second Abort Countdown View */
          <div className="text-center py-4 space-y-4">
            <span className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto animate-bounce">
              🚨
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              DISPATCHING EMERGENCY SOS
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              If this was pressed by mistake, tap Cancel below immediately.
            </p>

            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 to-pink-600 text-white font-black text-5xl flex items-center justify-center mx-auto my-4 shadow-xl shadow-red-500/40">
              {countdown}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  stopSiren();
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                Cancel False Alarm
              </button>
              <button
                onClick={() => setIsCountingDown(false)}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
              >
                Skip & Trigger Now ⚡
              </button>
            </div>
          </div>
        ) : (
          /* Active Emergency Action Hub */
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl font-black shrink-0 animate-pulse">
                🚨
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">EMERGENCY SOS ACTIVE</h3>
                <p className="text-xs text-red-600 font-bold">
                  {coords.lat ? `GPS Locked: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Locating GPS satellites...'}
                </p>
              </div>
            </div>

            {/* Siren Deterrent Toggle */}
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">High-Decibel Police Siren</h4>
                <p className="text-[11px] text-slate-600">Sound alarm to scare attackers or attract bystanders</p>
              </div>
              <button
                onClick={isSirenActive ? stopSiren : startSiren}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  isSirenActive 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isSirenActive ? '🛑 STOP SIREN' : '📢 PLAY SIREN'}
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Broadcast GPS Distress Link:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <span>💬</span> WhatsApp Alert
                </a>
                <a
                  href={smsLink}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <span>✉️</span> SMS Alert
                </a>
              </div>
            </div>

            {/* Instant Emergency Dialers */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block">
                Direct Emergency Helplines:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:112"
                  className="py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition"
                >
                  <span>🚨</span> Call 112 (Police)
                </a>
                <a
                  href="tel:1091"
                  className="py-3 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition"
                >
                  <span>🛡️</span> Call 1091 (Women)
                </a>
              </div>
            </div>

            {/* Safe Confirmation Button */}
            <button
              onClick={() => {
                stopSiren();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              ✓ I Am Safe Now (Dismiss Emergency)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
