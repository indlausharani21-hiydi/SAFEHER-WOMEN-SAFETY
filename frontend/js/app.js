/**
 * SafeHer Main Application Controller
 * Handles emergency SOS lifecycle, contacts management, disguise stealth mode,
 * tabs navigation, and live synchronization with backend database.
 */

const App = {
  sosCountdownTimer: null,
  sosSecondsRemaining: 3,
  activeAlert: null,
  currentUser: null,
  contacts: [],

  async init() {
    console.log('SafeHer Web Platform Initializing...');
    
    // Check battery level if supported
    this.initBatteryCheck();

    // Check active SOS from DB
    await this.checkActiveAlert();

    // Load initial data
    await this.loadUserProfile();
    await this.loadContacts();

    // Initialize sub-modules
    SafeMap.init();
    FakeCall.init();

    // Setup UI event listeners
    this.bindEvents();
  },

  batteryLevel: null,
  async initBatteryCheck() {
    if (navigator.getBattery) {
      try {
        const battery = await navigator.getBattery();
        this.batteryLevel = Math.round(battery.level * 100);
        battery.addEventListener('levelchange', () => {
          this.batteryLevel = Math.round(battery.level * 100);
        });
      } catch (e) {
        console.log('Battery API unavailable');
      }
    }
  },

  async loadUserProfile() {
    try {
      const data = await API.getUser();
      this.currentUser = data.user;
      this.renderUserProfile();
    } catch (e) {
      console.error('Failed to load user profile:', e);
    }
  },

  renderUserProfile() {
    if (!this.currentUser) return;
    const nameEl = document.getElementById('user-profile-name');
    const bloodEl = document.getElementById('user-profile-blood');
    const notesEl = document.getElementById('user-profile-notes');
    if (nameEl) nameEl.innerText = this.currentUser.name;
    if (bloodEl) bloodEl.innerText = `Blood Group: ${this.currentUser.blood_group || 'Not specified'}`;
    if (notesEl) notesEl.innerText = `Medical: ${this.currentUser.medical_notes || 'None'}`;

    // Fill profile modal inputs
    const inputName = document.getElementById('profile-input-name');
    const inputPhone = document.getElementById('profile-input-phone');
    const inputBlood = document.getElementById('profile-input-blood');
    const inputNotes = document.getElementById('profile-input-notes');
    const inputMsg = document.getElementById('profile-input-message');

    if (inputName) inputName.value = this.currentUser.name || '';
    if (inputPhone) inputPhone.value = this.currentUser.phone || '';
    if (inputBlood) inputBlood.value = this.currentUser.blood_group || '';
    if (inputNotes) inputNotes.value = this.currentUser.medical_notes || '';
    if (inputMsg) inputMsg.value = this.currentUser.emergency_message || '';
  },

  async loadContacts() {
    try {
      const data = await API.getContacts();
      this.contacts = data.contacts || [];
      this.renderContactsList();
      this.updateEmergencyRecipientsCount();
    } catch (e) {
      console.error('Failed to load contacts:', e);
    }
  },

  renderContactsList() {
    const container = document.getElementById('contacts-list-container');
    if (!container) return;

    if (this.contacts.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-300">
          <p class="text-gray-500 text-sm">No emergency guardians added yet.</p>
          <button onclick="App.openAddContactModal()" class="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700">
            + Add First Guardian
          </button>
        </div>
      `;
      return;
    }

    const mapLink = `https://maps.google.com/?q=${SafeMap.currentCoords.lat},${SafeMap.currentCoords.lng}`;
    const baseMsg = this.currentUser ? this.currentUser.emergency_message : 'EMERGENCY! I need immediate help. My location: ';
    const emergencyText = encodeURIComponent(`${baseMsg} ${mapLink}`);

    container.innerHTML = this.contacts.map(c => {
      const cleanPhone = c.phone.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${emergencyText}`;
      const smsUrl = `sms:${c.phone}?body=${emergencyText}`;

      return `
        <div class="p-4 bg-white rounded-2xl border ${c.is_primary ? 'border-indigo-400 bg-indigo-50/20' : 'border-gray-200'} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full ${c.is_primary ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} font-bold flex items-center justify-center text-base">
              ${c.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-gray-900">${c.name}</h4>
                ${c.is_primary ? '<span class="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">PRIMARY</span>' : ''}
              </div>
              <p class="text-xs text-gray-500">${c.phone} • <span class="text-gray-700">${c.relationship}</span></p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <a href="${whatsappUrl}" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition">
              <span>💬</span> WhatsApp Alert
            </a>
            <a href="${smsUrl}" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition">
              <span>✉️</span> SMS
            </a>
            <a href="tel:${c.phone}" class="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" title="Call">
              📞
            </a>
            ${!c.is_primary ? `
              <button onclick="App.setPrimaryContact(${c.id})" class="text-xs text-indigo-600 hover:underline px-1 font-medium">
                Set Primary
              </button>
            ` : ''}
            <button onclick="App.deleteContact(${c.id})" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl" title="Delete">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  updateEmergencyRecipientsCount() {
    const countEl = document.getElementById('guardian-count-badge');
    if (countEl) countEl.innerText = `${this.contacts.length} Guardians`;
  },

  async checkActiveAlert() {
    try {
      const data = await API.getActiveSOS();
      if (data.hasActiveAlert && data.alert) {
        this.activeAlert = data.alert;
        this.showActiveAlertBanner(data.alert);
      } else {
        this.activeAlert = null;
        this.hideActiveAlertBanner();
      }
    } catch (e) {
      console.warn('Could not check active alert state:', e);
    }
  },

  showActiveAlertBanner(alert) {
    const banner = document.getElementById('active-sos-banner');
    if (banner) {
      banner.classList.remove('hidden');
      document.getElementById('active-sos-id-display').innerText = `#${alert.id}`;
      document.getElementById('active-sos-time-display').innerText = new Date(alert.timestamp).toLocaleTimeString();
    }
    const statusPill = document.getElementById('system-status-pill');
    if (statusPill) {
      statusPill.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span> <span class="text-red-700 font-bold">EMERGENCY SOS ACTIVE</span>';
      statusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 border border-red-300 text-xs shadow-sm';
    }
  },

  hideActiveAlertBanner() {
    const banner = document.getElementById('active-sos-banner');
    if (banner) banner.classList.add('hidden');

    const statusPill = document.getElementById('system-status-pill');
    if (statusPill) {
      statusPill.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> <span class="text-emerald-700 font-semibold">Protected & Live</span>';
      statusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs shadow-sm';
    }
  },

  startSOSCountdown() {
    const modal = document.getElementById('sos-countdown-modal');
    const timerNumber = document.getElementById('sos-countdown-number');
    modal.classList.remove('hidden');

    this.sosSecondsRemaining = 3;
    timerNumber.innerText = this.sosSecondsRemaining;
    SoundEngine.playBeep(440, 0.1);

    this.sosCountdownTimer = setInterval(() => {
      this.sosSecondsRemaining -= 1;
      if (this.sosSecondsRemaining > 0) {
        timerNumber.innerText = this.sosSecondsRemaining;
        SoundEngine.playBeep(440 + (3 - this.sosSecondsRemaining) * 150, 0.1);
      } else {
        clearInterval(this.sosCountdownTimer);
        this.sosCountdownTimer = null;
        modal.classList.add('hidden');
        this.executeSOSTrigger('SOS');
      }
    }, 1000);
  },

  cancelSOSCountdown() {
    if (this.sosCountdownTimer) {
      clearInterval(this.sosCountdownTimer);
      this.sosCountdownTimer = null;
    }
    const modal = document.getElementById('sos-countdown-modal');
    modal.classList.add('hidden');
  },

  async executeSOSTrigger(alertType = 'SOS') {
    try {
      const payload = {
        latitude: SafeMap.currentCoords.lat,
        longitude: SafeMap.currentCoords.lng,
        address: SafeMap.hasRealGps ? 'Live User Geolocation' : 'SafeHer Test Location',
        alert_type: alertType,
        battery_level: this.batteryLevel,
        notes: `Emergency activated via SafeHer web interface [Battery: ${this.batteryLevel ? this.batteryLevel + '%' : 'N/A'}]`
      };

      const result = await API.triggerSOS(payload);
      this.activeAlert = result.alert;
      this.showActiveAlertBanner(result.alert);

      // Play emergency alert feedback
      SoundEngine.playBeep(880, 0.4);

      // Show alert dispatched notification modal
      this.showSOSDispatchedModal(result);
    } catch (e) {
      alert('Failed to trigger SOS alert: ' + e.message);
    }
  },

  showSOSDispatchedModal(result) {
    const modal = document.getElementById('sos-success-modal');
    const dispatchList = document.getElementById('sos-dispatch-contacts-list');
    
    if (dispatchList && result.notifications) {
      dispatchList.innerHTML = result.notifications.map(n => `
        <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
          <div>
            <strong class="text-gray-900 block">${n.name}</strong>
            <span class="text-gray-500">${n.phone}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <a href="${n.whatsappUrl}" target="_blank" class="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold">
              WhatsApp
            </a>
            <a href="${n.smsUrl}" class="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold">
              SMS
            </a>
          </div>
        </div>
      `).join('');
    }

    modal.classList.remove('hidden');
  },

  async resolveActiveSOS() {
    if (!confirm('Are you safe now? This will mark the active SOS as RESOLVED and notify your records.')) {
      return;
    }

    try {
      await API.resolveSOS('SafeHer user confirmed safety.');
      this.activeAlert = null;
      this.hideActiveAlertBanner();
      alert('✓ SOS alert has been successfully resolved. System is back in standby.');
    } catch (e) {
      alert('Could not resolve SOS: ' + e.message);
    }
  },

  toggleSiren() {
    const sirenBtn = document.getElementById('siren-toggle-btn');
    const body = document.body;

    if (SoundEngine.isSirenPlaying) {
      SoundEngine.stopSiren();
      sirenBtn.classList.remove('bg-red-600', 'text-white');
      sirenBtn.classList.add('bg-white', 'text-gray-800');
      sirenBtn.innerHTML = '🚨 Turn On Siren';
      body.classList.remove('siren-active-overlay');
    } else {
      SoundEngine.startSiren();
      sirenBtn.classList.remove('bg-white', 'text-gray-800');
      sirenBtn.classList.add('bg-red-600', 'text-white');
      sirenBtn.innerHTML = '🛑 Stop Siren';
      body.classList.add('siren-active-overlay');
    }
  },

  toggleDisguiseMode() {
    const appEl = document.getElementById('safeher-main-app');
    const disguiseEl = document.getElementById('stealth-calculator-screen');

    if (disguiseEl.classList.contains('hidden')) {
      // Enter Stealth Calculator Mode
      appEl.classList.add('hidden');
      disguiseEl.classList.remove('hidden');
      SoundEngine.stopSiren();
    } else {
      // Return to SafeHer
      disguiseEl.classList.add('hidden');
      appEl.classList.remove('hidden');
    }
  },

  openAddContactModal() {
    document.getElementById('add-contact-modal').classList.remove('hidden');
  },

  async handleAddContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name-input').value.trim();
    const phone = document.getElementById('contact-phone-input').value.trim();
    const relationship = document.getElementById('contact-relation-input').value;
    const isPrimary = document.getElementById('contact-is-primary-checkbox').checked;

    if (!name || !phone) {
      alert('Please enter both name and phone number');
      return;
    }

    try {
      await API.addContact({ name, phone, relationship, is_primary: isPrimary });
      document.getElementById('add-contact-modal').classList.add('hidden');
      document.getElementById('add-contact-form').reset();
      await this.loadContacts();
    } catch (err) {
      alert('Failed to add contact: ' + err.message);
    }
  },

  async deleteContact(id) {
    if (!confirm('Are you sure you want to delete this guardian?')) return;
    try {
      await API.deleteContact(id);
      await this.loadContacts();
    } catch (e) {
      alert('Failed to delete contact: ' + e.message);
    }
  },

  async setPrimaryContact(id) {
    try {
      await API.setPrimaryContact(id);
      await this.loadContacts();
    } catch (e) {
      alert('Failed to set primary: ' + e.message);
    }
  },

  async handleAddReportSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('report-title-input').value.trim();
    const category = document.getElementById('report-category-input').value;
    const description = document.getElementById('report-desc-input').value.trim();
    const address = document.getElementById('report-address-input').value.trim();
    const severity = document.getElementById('report-severity-input').value;

    try {
      await API.addReport({
        title,
        category,
        description,
        address: address || 'Nearby marked pin',
        severity,
        latitude: SafeMap.currentCoords.lat,
        longitude: SafeMap.currentCoords.lng
      });

      document.getElementById('add-report-modal').classList.add('hidden');
      document.getElementById('add-report-form').reset();
      alert('✓ Safety incident reported to community map.');
      SafeMap.loadHazardReports();
      this.loadCommunityFeed();
    } catch (e) {
      alert('Could not submit report: ' + e.message);
    }
  },

  async loadCommunityFeed() {
    try {
      const data = await API.getReports();
      const container = document.getElementById('community-reports-feed');
      if (!container) return;

      if (!data.reports || data.reports.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 py-4">No community hazard reports logged yet.</p>';
        return;
      }

      container.innerHTML = data.reports.map(r => `
        <div class="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between mb-1.5">
            <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              r.severity === 'HIGH' ? 'bg-red-100 text-red-700' :
              r.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }">
              ${r.category.replace('_', ' ')} • ${r.severity}
            </span>
            <span class="text-[11px] text-gray-400">${new Date(r.timestamp).toLocaleDateString()}</span>
          </div>
          <h4 class="font-bold text-gray-900 text-sm">${r.title}</h4>
          <p class="text-xs text-gray-600 mt-1">${r.description || ''}</p>
          <div class="flex items-center justify-between mt-3 pt-2 border-t border-gray-50 text-xs">
            <span class="text-gray-500">📍 ${r.address || 'Reported spot'}</span>
            <button onclick="SafeMap.upvoteHazard(${r.id}); App.loadCommunityFeed();" class="text-indigo-600 font-semibold hover:underline">
              👍 ${r.upvotes} Confirmations
            </button>
          </div>
        </div>
      `).join('');
    } catch (e) {
      console.error(e);
    }
  },

  bindEvents() {
    // SOS Main Trigger Button
    const mainSosBtn = document.getElementById('main-sos-btn');
    if (mainSosBtn) {
      mainSosBtn.addEventListener('click', () => this.startSOSCountdown());
    }

    // Cancel countdown button
    const cancelSosBtn = document.getElementById('cancel-sos-countdown-btn');
    if (cancelSosBtn) {
      cancelSosBtn.addEventListener('click', () => this.cancelSOSCountdown());
    }

    // Instant SOS Trigger (bypasses 3s countdown)
    const instantSosBtn = document.getElementById('instant-sos-btn');
    if (instantSosBtn) {
      instantSosBtn.addEventListener('click', () => this.executeSOSTrigger('SOS'));
    }

    // Silent SOS Trigger
    const silentSosBtn = document.getElementById('silent-sos-btn');
    if (silentSosBtn) {
      silentSosBtn.addEventListener('click', () => this.executeSOSTrigger('SILENT'));
    }

    // Resolve SOS button
    const resolveBtn = document.getElementById('resolve-sos-btn');
    if (resolveBtn) {
      resolveBtn.addEventListener('click', () => this.resolveActiveSOS());
    }

    // Siren Toggle
    const sirenBtn = document.getElementById('siren-toggle-btn');
    if (sirenBtn) {
      sirenBtn.addEventListener('click', () => this.toggleSiren());
    }

    // Quick Disguise Button
    const disguiseBtn = document.getElementById('quick-disguise-btn');
    if (disguiseBtn) {
      disguiseBtn.addEventListener('click', () => this.toggleDisguiseMode());
    }
    const exitDisguiseBtn = document.getElementById('exit-disguise-btn');
    if (exitDisguiseBtn) {
      exitDisguiseBtn.addEventListener('click', () => this.toggleDisguiseMode());
    }

    // Add Contact form modal
    const addContactBtn = document.getElementById('add-contact-btn');
    if (addContactBtn) {
      addContactBtn.addEventListener('click', () => this.openAddContactModal());
    }
    const cancelContactBtn = document.getElementById('close-contact-modal-btn');
    if (cancelContactBtn) {
      cancelContactBtn.addEventListener('click', () => {
        document.getElementById('add-contact-modal').classList.add('hidden');
      });
    }
    const contactForm = document.getElementById('add-contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleAddContactSubmit(e));
    }

    // Add Report modal
    const openReportBtn = document.getElementById('open-report-hazard-btn');
    if (openReportBtn) {
      openReportBtn.addEventListener('click', () => {
        document.getElementById('add-report-modal').classList.remove('hidden');
      });
    }
    const closeReportBtn = document.getElementById('close-report-modal-btn');
    if (closeReportBtn) {
      closeReportBtn.addEventListener('click', () => {
        document.getElementById('add-report-modal').classList.add('hidden');
      });
    }
    const reportForm = document.getElementById('add-report-form');
    if (reportForm) {
      reportForm.addEventListener('submit', (e) => this.handleAddReportSubmit(e));
    }

    // Profile Modal
    const openProfileBtn = document.getElementById('open-profile-btn');
    if (openProfileBtn) {
      openProfileBtn.addEventListener('click', () => {
        document.getElementById('edit-profile-modal').classList.remove('hidden');
      });
    }
    const closeProfileBtn = document.getElementById('close-profile-modal-btn');
    if (closeProfileBtn) {
      closeProfileBtn.addEventListener('click', () => {
        document.getElementById('edit-profile-modal').classList.add('hidden');
      });
    }
    const profileForm = document.getElementById('edit-profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          await API.updateUser({
            name: document.getElementById('profile-input-name').value,
            phone: document.getElementById('profile-input-phone').value,
            blood_group: document.getElementById('profile-input-blood').value,
            medical_notes: document.getElementById('profile-input-notes').value,
            emergency_message: document.getElementById('profile-input-message').value
          });
          document.getElementById('edit-profile-modal').classList.add('hidden');
          await this.loadUserProfile();
          alert('✓ Emergency profile updated successfully');
        } catch (err) {
          alert('Failed to update profile: ' + err.message);
        }
      });
    }

    // Close SOS Dispatched modal
    const closeSosModalBtn = document.getElementById('close-sos-modal-btn');
    if (closeSosModalBtn) {
      closeSosModalBtn.addEventListener('click', () => {
        document.getElementById('sos-success-modal').classList.add('hidden');
      });
    }

    // Navigation Tabs
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('tab-active', 'text-indigo-600'));
        tabButtons.forEach(b => b.classList.add('text-gray-500'));
        btn.classList.add('tab-active', 'text-indigo-600');
        btn.classList.remove('text-gray-500');

        const targetTab = btn.dataset.tab;
        document.querySelectorAll('.tab-content-panel').forEach(p => p.classList.add('hidden'));
        const panel = document.getElementById(`tab-${targetTab}`);
        if (panel) panel.classList.remove('hidden');

        if (targetTab === 'map') {
          setTimeout(() => SafeMap.map.invalidateSize(), 200);
        } else if (targetTab === 'community') {
          this.loadCommunityFeed();
        }
      });
    });
  }
};

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
