/**
 * SafeHer Map Module (Leaflet.js)
 * Manages real-time geolocation, safe haven markers, hazard flags, and nearest refuge navigation
 */
const SafeMap = {
  map: null,
  userMarker: null,
  markersLayer: null,
  hazardsLayer: null,
  currentCoords: { lat: 28.6139, lng: 77.2090 }, // Default location
  placesData: [],
  reportsData: [],
  hasRealGps: false,

  init() {
    const mapContainer = document.getElementById('safety-map');
    if (!mapContainer) return;

    // Initialize Leaflet map
    this.map = L.map('safety-map', {
      zoomControl: true,
      attributionControl: false
    }).setView([this.currentCoords.lat, this.currentCoords.lng], 14);

    // Modern clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.hazardsLayer = L.layerGroup().addTo(this.map);

    this.trackUserLocation();
    this.loadSafePlaces();
    this.loadHazardReports();
    this.bindEvents();
  },

  trackUserLocation() {
    if (!navigator.geolocation) {
      this.setUserMarker(this.currentCoords.lat, this.currentCoords.lng);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.currentCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        this.hasRealGps = true;
        this.setUserMarker(this.currentCoords.lat, this.currentCoords.lng);
        this.map.setView([this.currentCoords.lat, this.currentCoords.lng], 15);
        this.updateCoordsDisplay();
        this.loadSafePlaces(); // Reload with distance calculations
      },
      (err) => {
        console.warn('Geolocation failed or permission denied, using default:', err.message);
        this.setUserMarker(this.currentCoords.lat, this.currentCoords.lng);
        this.updateCoordsDisplay();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  },

  setUserMarker(lat, lng) {
    if (this.userMarker) {
      this.userMarker.setLatLng([lat, lng]);
      return;
    }

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: '<div class="radar-dot"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    this.userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(this.map);
    this.userMarker.bindPopup(`
      <div class="text-sm">
        <strong class="text-indigo-600 font-semibold block mb-1">📍 You Are Here</strong>
        <p class="text-xs text-gray-600">Real-time GPS Tracking Active</p>
      </div>
    `);
  },

  updateCoordsDisplay() {
    const latLngDisplay = document.getElementById('user-gps-coordinates');
    if (latLngDisplay) {
      latLngDisplay.innerText = `${this.currentCoords.lat.toFixed(4)}, ${this.currentCoords.lng.toFixed(4)}`;
    }
  },

  async loadSafePlaces(category = 'all') {
    try {
      const data = await API.getSafePlaces(category, this.currentCoords.lat, this.currentCoords.lng);
      this.placesData = data.places || [];
      this.renderPlaceMarkers();
      this.renderNearbyPlacesList();
    } catch (err) {
      console.error('Failed to load safe places:', err);
    }
  },

  renderPlaceMarkers() {
    this.markersLayer.clearLayers();

    this.placesData.forEach((place) => {
      let iconColor = '#3b82f6';
      let iconSymbol = '🛡️';

      if (place.category === 'police') {
        iconColor = '#1d4ed8';
        iconSymbol = '👮';
      } else if (place.category === 'hospital') {
        iconColor = '#dc2626';
        iconSymbol = '🏥';
      } else if (place.category === 'pharmacy') {
        iconColor = '#059669';
        iconSymbol = '💊';
      } else if (place.category === 'shelter') {
        iconColor = '#7c3aed';
        iconSymbol = '🏠';
      }

      const markerHtml = `
        <div style="
          background-color: ${iconColor};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
          border: 2px solid #ffffff;
        ">
          ${iconSymbol}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'place-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([place.latitude, place.longitude], { icon: customIcon });

      const distanceText = place.distanceKm !== undefined ? ` • <strong>${place.distanceKm} km away</strong>` : '';
      const phoneHtml = place.phone ? `
        <a href="tel:${place.phone}" class="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline mt-2">
          📞 Call: ${place.phone}
        </a>
      ` : '';

      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;

      marker.bindPopup(`
        <div class="p-1 max-w-[220px]">
          <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-50 text-indigo-700 mb-1">
            ${place.category}
          </span>
          <h4 class="font-bold text-gray-900 text-sm leading-tight">${place.name}</h4>
          <p class="text-xs text-gray-500 mt-1">${place.address}${distanceText}</p>
          ${place.notes ? `<p class="text-xs text-emerald-600 font-medium mt-1">✓ ${place.notes}</p>` : ''}
          <div class="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
            ${phoneHtml}
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="text-xs text-indigo-600 font-bold hover:underline">
              Directions ↗
            </a>
          </div>
        </div>
      `);

      this.markersLayer.addLayer(marker);
    });
  },

  async loadHazardReports() {
    try {
      const data = await API.getReports();
      this.reportsData = data.reports || [];
      this.renderHazardMarkers();
    } catch (err) {
      console.error('Failed to load hazard reports:', err);
    }
  },

  renderHazardMarkers() {
    this.hazardsLayer.clearLayers();

    this.reportsData.forEach((rep) => {
      const hazardHtml = `
        <div style="
          background-color: #f59e0b;
          color: white;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          border: 2px solid #ffffff;
        ">⚠️</div>
      `;

      const hazardIcon = L.divIcon({
        html: hazardHtml,
        className: 'hazard-marker-icon',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([rep.latitude, rep.longitude], { icon: hazardIcon });
      marker.bindPopup(`
        <div class="p-1 max-w-[220px]">
          <span class="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 mb-1">
            Hazard: ${rep.category.replace('_', ' ')}
          </span>
          <h4 class="font-bold text-gray-900 text-xs">${rep.title}</h4>
          <p class="text-[11px] text-gray-600 mt-1">${rep.description || ''}</p>
          <div class="flex items-center justify-between mt-2 pt-1 border-t text-[11px] text-gray-500">
            <span>👍 ${rep.upvotes} verified</span>
            <button onclick="SafeMap.upvoteHazard(${rep.id})" class="text-amber-700 font-bold hover:underline">
              + Confirm
            </button>
          </div>
        </div>
      `);

      this.hazardsLayer.addLayer(marker);
    });
  },

  async upvoteHazard(id) {
    try {
      await API.upvoteReport(id);
      this.loadHazardReports();
    } catch (e) {
      alert('Could not upvote report');
    }
  },

  renderNearbyPlacesList() {
    const listContainer = document.getElementById('nearby-havens-list');
    if (!listContainer) return;

    if (this.placesData.length === 0) {
      listContainer.innerHTML = '<p class="text-xs text-gray-500 py-3">No verified spots nearby.</p>';
      return;
    }

    listContainer.innerHTML = this.placesData.slice(0, 4).map(p => `
      <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-indigo-200 transition">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            p.category === 'police' ? 'bg-blue-100 text-blue-700' :
            p.category === 'hospital' ? 'bg-red-100 text-red-700' :
            p.category === 'pharmacy' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
          }">
            ${p.category === 'police' ? '👮' : p.category === 'hospital' ? '🏥' : p.category === 'pharmacy' ? '💊' : '🛡️'}
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 line-clamp-1">${p.name}</h4>
            <p class="text-xs text-gray-500 flex items-center gap-2">
              <span>${p.distanceKm !== undefined ? p.distanceKm + ' km' : p.category}</span>
              ${p.open_24_7 ? '<span class="text-emerald-600 font-medium text-[11px]">• 24/7 Open</span>' : ''}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          ${p.phone ? `
            <a href="tel:${p.phone}" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Call">
              📞
            </a>
          ` : ''}
          <a href="https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}" target="_blank" class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Directions">
            🧭
          </a>
        </div>
      </div>
    `).join('');
  },

  findNearestSafePlace() {
    if (this.placesData.length === 0) {
      alert('Searching for safe locations...');
      return;
    }

    const nearest = this.placesData[0];
    this.map.setView([nearest.latitude, nearest.longitude], 16, { animate: true });

    // Open popup for nearest
    this.markersLayer.eachLayer(layer => {
      const latlng = layer.getLatLng();
      if (Math.abs(latlng.lat - nearest.latitude) < 0.0001 && Math.abs(latlng.lng - nearest.longitude) < 0.0001) {
        layer.openPopup();
      }
    });
  },

  bindEvents() {
    // Category filter pills
    const filterButtons = document.querySelectorAll('.map-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('bg-indigo-600', 'text-white'));
        filterButtons.forEach(b => b.classList.add('bg-white', 'text-gray-700'));
        btn.classList.remove('bg-white', 'text-gray-700');
        btn.classList.add('bg-indigo-600', 'text-white');

        const cat = btn.dataset.category;
        this.loadSafePlaces(cat);
      });
    });

    const nearestBtn = document.getElementById('find-nearest-haven-btn');
    if (nearestBtn) {
      nearestBtn.addEventListener('click', () => this.findNearestSafePlace());
    }

    const recenterBtn = document.getElementById('recenter-map-btn');
    if (recenterBtn) {
      recenterBtn.addEventListener('click', () => {
        this.map.setView([this.currentCoords.lat, this.currentCoords.lng], 15);
      });
    }
  }
};
