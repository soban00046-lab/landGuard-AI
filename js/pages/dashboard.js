import { getEnrichedProjects, getDashboardStats } from '../data/mlEngine.js';

export function renderDashboard(container) {
  const projects = getEnrichedProjects();
  const stats = getDashboardStats(projects);
  let selectedProject = projects.find(p => p.riskCategory === 'High') || projects[0];
  
  container.innerHTML = `
    <!-- Header -->
    <div class="header">
      <div class="header-title">
        <h2>🛡️ Land Acquisition Risk Dashboard</h2>
        <p>Monitor, analyse and act on potential project delays</p>
      </div>
      <div class="header-actions">
        <span class="last-updated">📅 Last Updated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        <div class="notification-bell"><i data-lucide="bell"></i></div>
        <div class="admin-profile">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--accent-gradient);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;">AK</div>
          <div>
            <div style="font-weight:600;font-size:0.85rem;">Admin</div>
            <div style="font-size:0.7rem;color:var(--text-muted);">Land Acquisition Cell</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- KPI Stats Row -->
    <div class="stats-grid">
      <div class="stat-card animate-fadeIn delay-1">
        <div class="stat-header">
          <div class="stat-icon gradient"><i data-lucide="folder-open" style="width:22px;height:22px;"></i></div>
        </div>
        <div class="stat-value">${stats.totalProjects}</div>
        <div class="stat-label">Total Projects</div>
        <div class="stat-trend up"><i data-lucide="trending-up" style="width:14px;"></i> 5% vs last month</div>
      </div>
      <div class="stat-card high animate-fadeIn delay-2">
        <div class="stat-header">
          <div class="stat-icon" style="background:var(--risk-high-bg);color:var(--risk-high);"><i data-lucide="alert-triangle" style="width:22px;height:22px;"></i></div>
        </div>
        <div class="stat-value" style="color:var(--risk-high);">${stats.highRisk}</div>
        <div class="stat-label">High Risk Projects</div>
        <div class="stat-trend up"><i data-lucide="trending-up" style="width:14px;"></i> 8% vs last month</div>
      </div>
      <div class="stat-card medium animate-fadeIn delay-3">
        <div class="stat-header">
          <div class="stat-icon" style="background:var(--risk-medium-bg);color:var(--risk-medium);"><i data-lucide="alert-circle" style="width:22px;height:22px;"></i></div>
        </div>
        <div class="stat-value" style="color:var(--risk-medium);">${stats.mediumRisk}</div>
        <div class="stat-label">Medium Risk Projects</div>
        <div class="stat-trend up"><i data-lucide="trending-up" style="width:14px;"></i> 6% vs last month</div>
      </div>
      <div class="stat-card low animate-fadeIn delay-4">
        <div class="stat-header">
          <div class="stat-icon" style="background:var(--risk-low-bg);color:var(--risk-low);"><i data-lucide="check-circle" style="width:22px;height:22px;"></i></div>
        </div>
        <div class="stat-value" style="color:var(--risk-low);">${stats.lowRisk}</div>
        <div class="stat-label">Low Risk Projects</div>
        <div class="stat-trend down"><i data-lucide="trending-down" style="width:14px;"></i> 4% vs last month</div>
      </div>
    </div>
    
    <!-- Row 2: Map + Bar Chart + Delay Drivers -->
    <div class="dashboard-grid dashboard-row-3col" style="margin-bottom:24px;">
      <!-- Project Risk Map -->
      <div class="card animate-fadeIn delay-5">
        <div class="card-header">
          <div><h3>🗺️ Project Risk Map</h3><p>Geographic view of project risk status</p></div>
        </div>
        <div class="card-body">
          <div class="map-container" id="dashboardMap"></div>
          <div style="display:flex;gap:16px;margin-top:12px;justify-content:center;">
            <span style="display:flex;align-items:center;gap:4px;font-size:0.75rem;"><span style="width:10px;height:10px;border-radius:50%;background:var(--risk-high);display:inline-block;"></span> High Risk</span>
            <span style="display:flex;align-items:center;gap:4px;font-size:0.75rem;"><span style="width:10px;height:10px;border-radius:50%;background:var(--risk-medium);display:inline-block;"></span> Medium Risk</span>
            <span style="display:flex;align-items:center;gap:4px;font-size:0.75rem;"><span style="width:10px;height:10px;border-radius:50%;background:var(--risk-low);display:inline-block;"></span> Low Risk</span>
          </div>
        </div>
      </div>
      
      <!-- Risk by Acquisition Stage -->
      <div class="card animate-fadeIn delay-6">
        <div class="card-header">
          <div><h3>📊 Risk by Acquisition Stage</h3><p>Number of projects at risk in each stage</p></div>
        </div>
        <div class="card-body">
          <div class="chart-container"><canvas id="stageChart"></canvas></div>
        </div>
      </div>
      
      <!-- Key Delay Drivers -->
      <div class="card animate-fadeIn delay-7">
        <div class="card-header">
          <div><h3>⚡ Key Delay Drivers</h3><p>Top factors contributing to delay risk</p></div>
        </div>
        <div class="card-body">
          <div class="delay-factors-list">
            ${stats.delayDrivers.map(d => `
              <div class="delay-factor">
                <span class="label">${d.name}</span>
                <div class="bar-container">
                  <div class="bar" style="width:${d.percentage}%;background:${d.color};"></div>
                </div>
                <span class="percentage">${d.percentage}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Row 3: High-Risk Table + Selected Project Detail -->
    <div class="dashboard-grid dashboard-row-2col">
      <!-- High-Risk Projects Table -->
      <div class="card animate-fadeIn delay-8">
        <div class="card-header with-border">
          <div><h3>🚨 High-Risk Projects</h3><p>Projects requiring immediate attention</p></div>
        </div>
        <div class="card-body no-padding">
          <div class="table-responsive">
            <table class="data-table" id="highRiskTable">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Project Name</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Risk Score</th>
                  <th>Key Issue</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${projects.filter(p => p.riskCategory === 'High').slice(0, 8).map(p => `
                  <tr data-id="${p.id}" class="project-row" style="cursor:pointer;">
                    <td>${p.id}</td>
                    <td style="font-weight:500;">${p.name}</td>
                    <td>${p.state}</td>
                    <td>${p.district}</td>
                    <td><span class="risk-score-circle high has-tooltip" data-tooltip="AI Score derived from 6 delay factors">${p.riskScore}</span></td>
                    <td>${p.shapValues[0]?.feature || 'Multiple'}</td>
                    <td><button class="btn btn-primary btn-sm view-btn" data-id="${p.id}">View</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Selected Project Details -->
      <div class="card animate-fadeIn delay-8" id="projectDetailCard">
        <div class="card-header with-border">
          <div><h3>📋 Selected Project Details</h3></div>
        </div>
        <div class="card-body" id="projectDetailContent">
          <!-- Will be populated by renderProjectDetail() -->
        </div>
      </div>
    </div>
    
    <!-- Footer tagline -->
    <div style="margin-top:24px;text-align:center;color:var(--text-muted);font-size:0.8rem;">
      <strong>Predict. Explain. Prioritize.</strong><br>For Faster Land Acquisition.
    </div>
  `;
  
  // Initialize map
  initDashboardMap(projects);
  
  // Initialize stage chart
  initStageChart(stats);
  
  // Render initial project detail
  renderProjectDetail(selectedProject);
  
  // Table row click handlers
  container.querySelectorAll('.project-row, .view-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = e.target.closest('[data-id]')?.dataset.id || e.target.dataset.id;
      if (id) {
        selectedProject = projects.find(p => p.id === id);
        if (selectedProject) renderProjectDetail(selectedProject);
      }
    });
  });
}

function renderProjectDetail(project) {
  const container = document.getElementById('projectDetailContent');
  if (!container || !project) return;
  
  const catClass = project.riskCategory.toLowerCase();
  
  container.innerHTML = `
    <div class="project-detail">
      <div class="project-header">
        <h2>${project.name}</h2>
        <span class="risk-badge ${catClass}">${project.riskCategory} Risk</span>
      </div>
      <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:16px;">
        Project ID: ${project.id} &nbsp;|&nbsp; State: ${project.state} &nbsp;|&nbsp; District: ${project.district}
      </div>
      
      <div class="project-metrics">
        <div class="metric-box">
          <span class="metric-label">Land Area</span>
          <span class="metric-value">${project.landArea} ha</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Affected Families</span>
          <span class="metric-value">${project.affectedFamilies}</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Compensation Status</span>
          <span class="metric-value">${project.compensationStatus}%</span>
        </div>
      </div>
      
      <h4 style="font-size:0.9rem;margin-bottom:12px;">Top Delay Factors</h4>
      <div class="delay-factors-list" style="margin-bottom:20px;">
        ${project.shapValues.slice(0, 4).map(sv => {
          const color = sv.impact > 0 ? (sv.impact > 10 ? 'var(--risk-high)' : 'var(--risk-medium)') : 'var(--risk-low)';
          const pct = Math.min(Math.abs(sv.impact) * 4, 100);
          return `
            <div class="delay-factor">
              <span class="label">${sv.feature}</span>
              <div class="bar-container">
                <div class="bar" style="width:${pct}%;background:${color};"></div>
              </div>
              <span class="percentage" style="color:${color};">${Math.abs(sv.impact).toFixed(0)}%</span>
            </div>
          `;
        }).join('')}
      </div>
      
      <h4 style="font-size:0.9rem;margin-bottom:12px;">Recommended Actions</h4>
      <div class="recommendations-list actions-panel">
        ${project.recommendations.slice(0, 4).map(r => `
          <div class="recommendation-item">
            <span class="icon">✅</span>
            <div class="text">${r.action}</div>
          </div>
        `).join('')}
      </div>
      
      <button class="btn btn-primary" style="margin-top:20px;width:100%;" onclick="window.navigate('reports')">
        View Full Report →
      </button>
    </div>
  `;
}

function initDashboardMap(projects) {
  const mapEl = document.getElementById('dashboardMap');
  if (!mapEl) return;
  
  const map = L.map('dashboardMap', {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView([22.5, 78.9], 5);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 18,
  }).addTo(map);
  
  // Add markers for each project
  projects.forEach(p => {
    const color = p.riskColor;
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
    
    L.marker([p.coordinates.lat, p.coordinates.lng], { icon })
      .addTo(map)
      .bindPopup(`
        <div class="popup-title">${p.name}</div>
        <div class="popup-risk">Risk: <strong style="color:${color};">${p.riskCategory} (${p.riskScore})</strong></div>
        <div style="font-size:0.75rem;">State: ${p.state} | District: ${p.district}</div>
        <div style="font-size:0.75rem;">Stage: ${p.currentStage}</div>
      `);
  });
  
  // Invalidate size after animation
  setTimeout(() => map.invalidateSize(), 500);
}

let stageChartInstance = null;
function initStageChart(stats) {
  const ctx = document.getElementById('stageChart');
  if (!ctx) return;
  
  if (stageChartInstance) {
    stageChartInstance.destroy();
  }
  
  stageChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Notification', 'Survey & Demarcation', 'Compensation', 'Legal Clearance', 'Possession', 'R&R'],
      datasets: [
        {
          label: 'High',
          data: stats.stageRisks.map(s => s.high),
          backgroundColor: '#ef4444',
          borderRadius: 4,
        },
        {
          label: 'Medium',
          data: stats.stageRisks.map(s => s.medium),
          backgroundColor: '#f59e0b',
          borderRadius: 4,
        },
        {
          label: 'Low',
          data: stats.stageRisks.map(s => s.low),
          backgroundColor: '#22c55e',
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { boxWidth: 12, usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { stacked: true, grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 } }, beginAtZero: true },
      },
    },
  });
}

