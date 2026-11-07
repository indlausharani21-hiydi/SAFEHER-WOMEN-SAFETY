import React, { useState, useEffect, useRef } from 'react';

export default function AutoSensors({ onTriggerSOS }) {
  // Sensor active toggles
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [batteryGuardEnabled, setBatteryGuardEnabled] = useState(true);
  const [timerEnabled, setTimerEnabled] = useState(false);

  // Shake sensor state
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const [shakePermissionNeeded, setShakePermissionNeeded] = useState(false);

  // Audio / Scream detector state
  const [audioLevel, setAudioLevel] = useState(0);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioAnimRef = useRef(null);

  // Battery status state
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);

  // Safety Timer state
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(null);
  const timerIntervalRef = useRef(null);

  // Automated trigger popup
  const [autoAlertTriggered, setAutoAlertTriggered] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const countdownIntervalRef = useRef(null);

  // 1. ================= SHAKE DETECTION =================
  useEffect(() => {
    if (!shakeEnabled) {
      setShakeIntensity(0);
      return;
    }

    let lastX = 0, lastY = 0, lastZ = 0, lastUpdate = 0;
    const SHAKE_THRESHOLD = 20;

    const handleMotion = (event) => {
      const curTime = Date.now();
      if ((curTime - lastUpdate) > 100) {
        const diffTime = (curTime - lastUpdate);
        lastUpdate = curTime;

        const acc = event.accelerationIncludingGravity || event.acceleration;
        if (!acc) return;

        const { x, y, z } = acc;
        const speed = Math.abs((x || 0) + (y || 0) + (z || 0) - lastX - lastY - lastZ) / diffTime * 10000;
        
        const normalized = Math.min(Math.round(speed / 10), 100);
        setShakeIntensity(normalized);

        if (speed > SHAKE_THRESHOLD * 100) {
          setShakeCount((prev) => {
            const next = prev + 1;
            if (next >= 3) {
              triggerAutomaticAlert('Severe Shake / Violent Motion Detected');
              return 0;
            }
            return next;
          });
        }

        lastX = x || 0;
        lastY = y || 0;
        lastZ = z || 0;
      }
    };

    if (typeof DeviceMotionEvent !== 'undefined') {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        setShakePermissionNeeded(true);
      } else {
        window.addEventListener('devicemotion', handleMotion);
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [shakeEnabled]);

  const requestShakePermission = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          setShakePermissionNeeded(false);
          setShakeEnabled(true);
        } else {
          alert('Motion sensor permission was denied.');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const simulateShake = () => {
    setShakeIntensity(85);
    setShakeCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        triggerAutomaticAlert('Simulated Emergency Shake (3x)');
        return 0;
      }
      return next;
    });
    setTimeout(() => setShakeIntensity(0), 600);
  };

  // 2. ================= AUDIO / SCREAM DETECTOR =================
  const startAudioDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListeningMic(true);
      setAudioEnabled(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const volumePercent = Math.min(Math.round((avg / 128) * 100), 100);
        setAudioLevel(volumePercent);

        // Scream threshold (> 85% volume)
        if (volumePercent > 85) {
          triggerAutomaticAlert('Distress Scream / Loud Crash Sound Detected');
        }

        audioAnimRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      alert('Microphone permission is required to detect distress screams.');
      setAudioEnabled(false);
    }
  };

  const stopAudioDetection = () => {
    if (audioAnimRef.current) cancelAnimationFrame(audioAnimRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListeningMic(false);
    setAudioEnabled(false);
    setAudioLevel(0);
  };

  // 3. ================= BATTERY SENSOR =================
  useEffect(() => {
    let batteryInstance = null;

    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        batteryInstance = battery;
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        const updateBattery = () => {
          const lvl = Math.round(battery.level * 100);
          setBatteryLevel(lvl);
          setIsCharging(battery.charging);

          // Auto-trigger if battery is critically low (<10%) and guard is on
          if (batteryGuardEnabled && lvl <= 10 && !battery.charging) {
            triggerAutomaticAlert('Critical Battery (<10%) - Auto Location Dispatch');
          }
        };

        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {
        setBatteryLevel(78); // fallback
      });
    } else {
      setBatteryLevel(82); // default demo
    }
  }, [batteryGuardEnabled]);

  // 4. ================= SAFETY CHECK-IN TIMER =================
  const startSafetyTimer = () => {
    setTimerEnabled(true);
    const totalSecs = timerMinutes * 60;
    setTimerSecondsLeft(totalSecs);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimerSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          triggerAutomaticAlert(`Safety Check-in Timer Expired (${timerMinutes}m)`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSafetyTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimerEnabled(false);
    setTimerSecondsLeft(null);
  };

  // Automated Trigger Controller
  const triggerAutomaticAlert = (reason) => {
    if (autoAlertTriggered) return;
    setAutoAlertTriggered(reason);
    setCountdown(5);

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          setAutoAlertTriggered(null);
          onTriggerSOS(); // Fire the SOS modal
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const abortAutomaticAlert = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setAutoAlertTriggered(null);
  };

  return (
    <section id="sensors" className="py-20 bg-gradient-to-b from-white via-purple-50/30 to-pink-50/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider shadow-sm">
            ⚡ Automated Hardware Triggers
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Intelligent Automatic Sensors
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            When you cannot reach your screen in danger, SafeHer uses device motion, microphone acoustics, and battery sensors to detect emergencies automatically.
          </p>
        </div>

        {/* Automated Alert Warning Overlay (Active Trigger) */}
        {autoAlertTriggered && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-red-500 animate-bounce">
              <span className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto mb-4">
                ⚠️
              </span>
              <h3 className="text-xl font-black text-slate-900 mb-1">
                SENSOR TRIGGER DETECTED!
              </h3>
              <p className="text-xs text-red-600 font-bold mb-4">
                {autoAlertTriggered}
              </p>
              <p className="text-xs text-slate-500 mb-6">
                Broadcasting Emergency SOS in:
              </p>

              <div className="w-20 h-20 rounded-full bg-red-600 text-white text-4xl font-black flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/50">
                {countdown}s
              </div>

              <div className="flex gap-3">
                <button
                  onClick={abortAutomaticAlert}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                >
                  I'm Safe (Cancel Alert)
                </button>
                <button
                  onClick={() => {
                    abortAutomaticAlert();
                    onTriggerSOS();
                  }}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
                >
                  Trigger Immediately 🚨
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sensors 4-Card Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SENSOR 1: Shake-to-SOS */}
          <div className="p-8 rounded-3xl bg-white border border-pink-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl font-bold">
                    📳
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Shake-to-SOS Sensor</h3>
                    <p className="text-xs text-slate-500">Device Accelerometer (Motion API)</p>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => {
                    if (!shakeEnabled && shakePermissionNeeded) {
                      requestShakePermission();
                    } else {
                      setShakeEnabled(!shakeEnabled);
                    }
                  }}
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${shakeEnabled ? 'bg-pink-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${shakeEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Shake your phone vigorously <strong>3 times</strong> to automatically initiate an emergency distress beacon without having to unlock or look at your screen.
              </p>

              {/* Live Shake Meter */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Motion Intensity</span>
                  <span>{shakeIntensity}% {shakeCount > 0 && `(Shake: ${shakeCount}/3)`}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-600 transition-all duration-150"
                    style={{ width: `${shakeIntensity}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Test Simulation Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {shakeEnabled ? '🟢 Sensor Active' : '⚪ Sensor Standby'}
              </span>
              <button
                onClick={simulateShake}
                className="px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs transition"
              >
                Test Shake Simulator 📱
              </button>
            </div>
          </div>

          {/* SENSOR 2: Scream & Distress Sound Detector */}
          <div className="p-8 rounded-3xl bg-white border border-purple-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-bold">
                    🎙️
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Acoustic Scream Detector</h3>
                    <p className="text-xs text-slate-500">Real-Time Web Audio Analyzer</p>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => audioEnabled ? stopAudioDetection() : startAudioDetection()}
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${audioEnabled ? 'bg-purple-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${audioEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Monitors surrounding decibels in the background. If a sudden piercing scream or violent impact noise is detected, SafeHer triggers a high-priority alert.
              </p>

              {/* Live Decibel Audio Meter */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Ambient Audio Level</span>
                  <span>{audioLevel}% dB {audioLevel > 80 && '⚠️ SPIKE'}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-75 ${
                      audioLevel > 80 
                        ? 'bg-red-600' 
                        : audioLevel > 50 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Mic Status */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {isListeningMic ? '🎙️ Mic Listening...' : '⚪ Mic Inactive'}
              </span>
              <button
                onClick={() => triggerAutomaticAlert('Simulated Scream Audio (>90dB)')}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition"
              >
                Simulate Loud Scream 🔊
              </button>
            </div>
          </div>

          {/* SENSOR 3: Critical Battery Guardian */}
          <div className="p-8 rounded-3xl bg-white border border-pink-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                    🔋
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Dead-Battery Auto Dispatch</h3>
                    <p className="text-xs text-slate-500">Navigator Battery Status API</p>
                  </div>
                </div>

                <button
                  onClick={() => setBatteryGuardEnabled(!batteryGuardEnabled)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${batteryGuardEnabled ? 'bg-emerald-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${batteryGuardEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Prevents you from disappearing off the radar. If your battery drops below <strong>10%</strong> while commuting, it automatically broadcasts your last known GPS coordinates to your emergency contacts.
              </p>

              {/* Battery Indicator Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Current Battery Level</span>
                  <span>{batteryLevel !== null ? `${batteryLevel}%` : 'Reading...'} {isCharging && '⚡ Charging'}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${batteryLevel || 50}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {batteryGuardEnabled ? '🛡️ Battery Guard Active' : '⚪ Guard Disabled'}
              </span>
              <button
                onClick={() => triggerAutomaticAlert('Simulated Low Battery Alert (3%)')}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition"
              >
                Test Low Battery Ping 🪫
              </button>
            </div>
          </div>

          {/* SENSOR 4: Night Travel Check-In Guard */}
          <div className="p-8 rounded-3xl bg-white border border-indigo-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
                    ⏱️
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Inactivity Travel Guard</h3>
                    <p className="text-xs text-slate-500">Safety Dead-Man Timer</p>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  Solo Commute
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Taking a cab late at night? Start a safety timer. If you don't enter your safety PIN or check in before time runs out, SafeHer automatically alarms guardians.
              </p>

              {/* Timer Controls */}
              {timerEnabled ? (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center mb-6">
                  <span className="text-xs uppercase font-extrabold text-indigo-600 block mb-1">
                    Check-In Countdown Active
                  </span>
                  <div className="text-3xl font-black font-mono text-indigo-950">
                    {Math.floor(timerSecondsLeft / 60)}:{(timerSecondsLeft % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-6">
                  {[10, 15, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTimerMinutes(mins)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                        timerMinutes === mins 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {mins} Mins
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {timerEnabled ? '⏳ Timer Running' : 'Standby'}
              </span>
              {timerEnabled ? (
                <button
                  onClick={cancelSafetyTimer}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                >
                  ✓ I Have Arrived (Stop)
                </button>
              ) : (
                <button
                  onClick={startSafetyTimer}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                >
                  Start Commute Guard 🚗
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
