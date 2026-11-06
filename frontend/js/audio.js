/**
 * SafeHer Web Audio Synthesizer
 * Generates police sirens, telephone ringtones, and simulated speech tones
 * using 100% native Web Audio API (works offline without external audio files)
 */
const SoundEngine = {
  audioCtx: null,
  sirenOsc: null,
  sirenGain: null,
  sirenInterval: null,
  isSirenPlaying: false,

  ringInterval: null,
  isRinging: false,

  speechInterval: null,
  isTalking: false,

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },

  // Emergency Police / Distress Siren
  startSiren() {
    this.init();
    if (this.isSirenPlaying) return;

    this.isSirenPlaying = true;
    const now = this.audioCtx.currentTime;

    this.sirenOsc = this.audioCtx.createOscillator();
    this.sirenGain = this.audioCtx.createGain();

    this.sirenOsc.type = 'sawtooth';
    this.sirenGain.gain.setValueAtTime(0.7, now);

    this.sirenOsc.connect(this.sirenGain);
    this.sirenGain.connect(this.audioCtx.destination);
    this.sirenOsc.start();

    let up = true;
    let freq = 600;
    this.sirenInterval = setInterval(() => {
      if (!this.isSirenPlaying) return;
      if (up) {
        freq += 60;
        if (freq >= 1200) up = false;
      } else {
        freq -= 60;
        if (freq <= 600) up = true;
      }
      if (this.sirenOsc) {
        this.sirenOsc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      }
    }, 40);
  },

  stopSiren() {
    if (!this.isSirenPlaying) return;
    this.isSirenPlaying = false;
    clearInterval(this.sirenInterval);
    if (this.sirenOsc) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
      } catch (e) {}
      this.sirenOsc = null;
    }
  },

  // Simulated Telephone Dual-Tone Ring (440Hz + 480Hz)
  startPhoneRing() {
    this.init();
    if (this.isRinging) return;
    this.isRinging = true;

    const playRingBurst = () => {
      if (!this.isRinging) return;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.frequency.value = 440; // A4
      osc2.frequency.value = 480; // B4
      osc1.type = 'sine';
      osc2.type = 'sine';

      gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        try {
          gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.1);
          setTimeout(() => {
            osc1.stop();
            osc2.stop();
            osc1.disconnect();
            osc2.disconnect();
          }, 100);
        } catch (e) {}
      }, 1500);
    };

    playRingBurst();
    this.ringInterval = setInterval(() => {
      if (!this.isRinging) return;
      playRingBurst();
    }, 3500);
  },

  stopPhoneRing() {
    this.isRinging = false;
    clearInterval(this.ringInterval);
  },

  // Short beep sound for timer countdown
  playBeep(freq = 880, duration = 0.15) {
    this.init();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
    setTimeout(() => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    }, duration * 1000);
  },

  // Simulated conversational chatter (muffled speech tones)
  startSimulatedVoice() {
    this.init();
    if (this.isTalking) return;
    this.isTalking = true;

    const syllables = [220, 260, 310, 240, 290, 330, 200];
    this.speechInterval = setInterval(() => {
      if (!this.isTalking) return;
      // 70% chance of speaking cadence, 30% pause
      if (Math.random() > 0.3) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.value = 650; // speech formant band

        osc.type = 'triangle';
        osc.frequency.value = syllables[Math.floor(Math.random() * syllables.length)];

        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.18);
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        }, 180);
      }
    }, 220);
  },

  stopSimulatedVoice() {
    this.isTalking = false;
    clearInterval(this.speechInterval);
  }
};
