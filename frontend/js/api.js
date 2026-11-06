/**
 * SafeHer API Client
 * Centralized service for communicating with the backend REST API
 */
const API = {
  baseUrl: window.location.origin,

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  },

  // User Profile
  getUser() {
    return this.request('/api/user');
  },
  updateUser(userData) {
    return this.request('/api/user', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  // Emergency Contacts
  getContacts() {
    return this.request('/api/contacts');
  },
  addContact(contact) {
    return this.request('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(contact)
    });
  },
  deleteContact(id) {
    return this.request(`/api/contacts/${id}`, {
      method: 'DELETE'
    });
  },
  setPrimaryContact(id) {
    return this.request(`/api/contacts/${id}/primary`, {
      method: 'PUT'
    });
  },

  // Emergency SOS
  triggerSOS(payload) {
    return this.request('/api/sos', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getActiveSOS() {
    return this.request('/api/sos/active');
  },
  resolveSOS(notes = 'Resolved by user') {
    return this.request('/api/sos/resolve', {
      method: 'POST',
      body: JSON.stringify({ resolution_notes: notes })
    });
  },
  getAlertHistory() {
    return this.request('/api/sos/history');
  },

  // Safe Havens & Places
  getSafePlaces(category = 'all', lat = null, lng = null) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (lat !== null && lng !== null) {
      params.append('lat', lat);
      params.append('lng', lng);
    }
    return this.request(`/api/places?${params.toString()}`);
  },
  addSafePlace(place) {
    return this.request('/api/places', {
      method: 'POST',
      body: JSON.stringify(place)
    });
  },

  // Community Incident Reports
  getReports(category = 'all') {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    return this.request(`/api/reports?${params.toString()}`);
  },
  addReport(report) {
    return this.request('/api/reports', {
      method: 'POST',
      body: JSON.stringify(report)
    });
  },
  upvoteReport(id) {
    return this.request(`/api/reports/${id}/upvote`, {
      method: 'POST'
    });
  }
};
