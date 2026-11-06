/**
 * SafeHer Fake Call Escape System
 * Simulates a realistic incoming call to help users discreetly exit dangerous or uncomfortable situations.
 */
const FakeCall = {
  activeTimer: null,
  callDurationTimer: null,
  callSeconds: 0,
  currentCaller: {
    name: 'Mom (Priya)',
    phone: '+91 98765 00001'
  },

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const triggerBtn = document.getElementById('trigger-fake-call-btn');
    const scheduleBtn = document.getElementById('schedule-fake-call-btn');
    const acceptBtn = document.getElementById('call-accept-btn');
    const declineBtn = document.getElementById('call-decline-btn');
    const endCallBtn = document.getElementById('call-end-active-btn');
    const cancelScheduleBtn = document.getElementById('cancel-scheduled-call-btn');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.triggerNow());
    }

    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', () => {
        const seconds = parseInt(document.getElementById('fake-call-delay-select').value, 10);
        this.scheduleCall(seconds);
      });
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.acceptCall());
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => this.endCall());
    }

    if (endCallBtn) {
      endCallBtn.addEventListener('click', () => this.endCall());
    }

    if (cancelScheduleBtn) {
      cancelScheduleBtn.addEventListener('click', () => this.cancelSchedule());
    }
  },

  scheduleCall(seconds) {
    this.cancelSchedule();
    const callerSelect = document.getElementById('fake-caller-select');
    if (callerSelect) {
      const selected = callerSelect.options[callerSelect.selectedIndex];
      this.currentCaller.name = selected.text;
      this.currentCaller.phone = selected.value;
    }

    const scheduledBanner = document.getElementById('fake-call-scheduled-banner');
    const scheduledTimerText = document.getElementById('fake-call-countdown-display');
    if (scheduledBanner) scheduledBanner.classList.remove('hidden');

    let remaining = seconds;
    if (scheduledTimerText) scheduledTimerText.innerText = `${remaining}s`;

    this.activeTimer = setInterval(() => {
      remaining -= 1;
      if (scheduledTimerText) scheduledTimerText.innerText = `${remaining}s`;
      if (remaining <= 0) {
        clearInterval(this.activeTimer);
        this.activeTimer = null;
        if (scheduledBanner) scheduledBanner.classList.add('hidden');
        this.triggerNow();
      }
    }, 1000);
  },

  cancelSchedule() {
    if (this.activeTimer) {
      clearInterval(this.activeTimer);
      this.activeTimer = null;
    }
    const scheduledBanner = document.getElementById('fake-call-scheduled-banner');
    if (scheduledBanner) scheduledBanner.classList.add('hidden');
  },

  triggerNow() {
    this.cancelSchedule();
    const callerSelect = document.getElementById('fake-caller-select');
    if (callerSelect) {
      const selected = callerSelect.options[callerSelect.selectedIndex];
      this.currentCaller.name = selected.text;
      this.currentCaller.phone = selected.value;
    }

    // Set caller text
    document.getElementById('incoming-caller-name').innerText = this.currentCaller.name;
    document.getElementById('incoming-caller-phone').innerText = this.currentCaller.phone;
    document.getElementById('active-caller-name').innerText = this.currentCaller.name;

    // Show screen
    const modal = document.getElementById('fake-call-screen');
    modal.classList.remove('hidden');
    document.getElementById('incoming-call-view').classList.remove('hidden');
    document.getElementById('active-call-view').classList.add('hidden');

    // Ring sound
    SoundEngine.startPhoneRing();
  },

  acceptCall() {
    SoundEngine.stopPhoneRing();
    document.getElementById('incoming-call-view').classList.add('hidden');
    document.getElementById('active-call-view').classList.remove('hidden');

    // Start speech murmurs
    SoundEngine.startSimulatedVoice();

    // Call duration counter
    this.callSeconds = 0;
    const durationEl = document.getElementById('active-call-duration');
    durationEl.innerText = '00:00';

    this.callDurationTimer = setInterval(() => {
      this.callSeconds += 1;
      const mins = String(Math.floor(this.callSeconds / 60)).padStart(2, '0');
      const secs = String(this.callSeconds % 60).padStart(2, '0');
      durationEl.innerText = `${mins}:${secs}`;
    }, 1000);
  },

  endCall() {
    SoundEngine.stopPhoneRing();
    SoundEngine.stopSimulatedVoice();

    if (this.callDurationTimer) {
      clearInterval(this.callDurationTimer);
      this.callDurationTimer = null;
    }

    const modal = document.getElementById('fake-call-screen');
    modal.classList.add('hidden');
  }
};
