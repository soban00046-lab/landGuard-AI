import { getEnrichedProjects } from '../data/mlEngine.js';

export function renderMap(container) {
  const projects = getEnrichedProjects();
  let mapInstance = null;
  let markersLayer = L.layerGroup();
  
  const states = [...new Set(projects.map(p => p.state))].sort();

  container.innerHTML = `
    <div style="position:relative;height:calc(100vh - 80px);border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Stats Bar Overlay -->
      <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);z-index:1000;background:rgba(255,255,255,0.9);backdrop-filter:blur(10px);padding:10px 24px;border-radius:30px;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;gap:20px;font-weight:600;font-size:0.9rem;">
        <span id="mapTotalCount">0 Total</span>
        <span id="mapHighCount" style="color:var(--risk-high);">0 High</span>
        <span id="mapMedCount" style="color:var(--risk-medium);">0 Medium</span>
        <span id="mapLowCount" style="color:var(--risk-low);">0 Low</span>
      </div>

      <!-- Filter Panel Overlay -->
      <div style="position:absolute;top:20px;left:20px;z-index:1000;background:white;padding:16px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);width:260px;">
        <h4 style="margin-top:0;margin-bottom:16px;font-size:1rem;">🗺️ Map Filters</h4>
        
        <div style="margin-bottom:12px;">
          <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:8px;">Risk Level</label>
          <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:0.85rem;"><input type="checkbox" id="chkHigh" checked> High Risk</label>
          <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:0.85rem;"><input type="checkbox" id="chkMed" checked> Medium Risk</label>
          <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:0.85rem;"><input type="checkbox" id="chkLow" checked> Low Risk</label>
        </div>
        
        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:8px;">State</label>
          <select id="mapStateFilter" class="form-control" style="width:100%;padding:6px;font-size:0.85rem;border:1px solid #ccc;border-radius:4px;">
            <option value="All">All States</option>
            ${states.map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>
        </div>
      </div>
      
      <!-- Legend -->
      <div style="position:absolute;bottom:30px;right:20px;z-index:1000;background:white;padding:12px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:0.8rem;">
        <div style="font-weight:600;margin-bottom:8px;">Legend</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><span style="width:12px;height:12px;border-radius:50%;background:var(--risk-high);"></span> High Risk (Score > 75)</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><span style="width:12px;height:12px;border-radius:50%;background:var(--risk-medium);"></span> Medium Risk (40-75)</div>
        <div style="display:flex;align-items:center;gap:8px;"><span style="width:12px;height:12px;border-radius:50%;background:var(--risk-low);"></span> Low Risk (< 40)</div>
      </div>

      <div id="fullMap" style="width:100%;height:100%;"></div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();

  // Initialize Map
  setTimeout(() => {
    mapInstance = L.map('fullMap', {
      zoomControl: false // Add custom position later if needed
    }).setView([22.5, 78.9], 5);
    
    L.control.zoom({ position: 'bottomleft' }).addTo(mapInstance);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstance);
    
    markersLayer.addTo(mapInstance);
    
    updateMap();
  }, 100);
  
  function updateMap() {
    const showHigh = document.getElementById('chkHigh').checked;
    const showMed = document.getElementById('chkMed').checked;
    const showLow = document.getElementById('chkLow').checked;
    const state = document.getElementById('mapStateFilter').value;
    
    const filtered = projects.filter(p => {
      if (!showHigh && p.riskCategory === 'High') return false;
      if (!showMed && p.riskCategory === 'Medium') return false;
      if (!showLow && p.riskCategory === 'Low') return false;
      if (state !== 'All' && p.state !== state) return false;
      return true;
    });
    
    // Update Stats
    const high = filtered.filter(p => p.riskCategory === 'High').length;
    const med = filtered.filter(p => p.riskCategory === 'Medium').length;
    const low = filtered.filter(p => p.riskCategory === 'Low').length;
    
    document.getElementById('mapTotalCount').innerText = `${filtered.length} Total`;
    document.getElementById('mapHighCount').innerText = `${high} High`;
    document.getElementById('mapMedCount').innerText = `${med} Medium`;
    document.getElementById('mapLowCount').innerText = `${low} Low`;
    
    // Update Markers
    markersLayer.clearLayers();
    
    filtered.forEach(p => {
      const color = p.riskColor;
      const size = p.riskCategory === 'High' ? 16 : 12;
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
      });
      
      L.marker([p.coordinates.lat, p.coordinates.lng], { icon })
        .bindPopup(`
          <div style="min-width:200px;">
            <h4 style="margin:0 0 8px 0;font-size:1rem;">${p.name}</h4>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem;">
              <span>Risk Score:</span>
              <strong style="color:${color};">${p.riskScore} (${p.riskCategory})</strong>
            </div>
            <div style="font-size:0.8rem;margin-bottom:4px;"><strong>Location:</strong> ${p.state}, ${p.district}</div>
            <div style="font-size:0.8rem;margin-bottom:12px;"><strong>Stage:</strong> ${p.currentStage}</div>
            <div style="margin-bottom:12px;">
              <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:4px;">
                <span>Compensation</span><span>${p.compensationStatus}%</span>
              </div>
              <div style="height:4px;background:#e5e7eb;border-radius:2px;">
                <div style="height:4px;background:var(--accent-primary);border-radius:2px;width:${p.compensationStatus}%;"></div>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" style="width:100%;" onclick="alert('View project ${p.id}')">View Details</button>
          </div>
        `)
        .addTo(markersLayer);
    });
  }
  
  // Attach Event Listeners
  container.addEventListener('change', (e) => {
    if (['chkHigh', 'chkMed', 'chkLow', 'mapStateFilter'].includes(e.target.id)) {
      updateMap();
    }
  });
}
