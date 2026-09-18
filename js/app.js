import { renderDashboard } from './pages/dashboard.js';
import { renderProjects } from './pages/projects.js';
import { renderMap } from './pages/map.js';
import { renderAlerts } from './pages/alerts.js';
import { renderReports } from './pages/reports.js';
import { renderSettings } from './pages/settings.js';
import { getEnrichedProjects } from './data/mlEngine.js';

window.showProjectModal = function(id) {
  const projects = getEnrichedProjects();
  const project = projects.find(p => p.id === id);
  if (!project) return;
  
  const html = `
    <div style="display:flex;gap:24px;flex-wrap:wrap;">
      <div style="flex:1;min-width:300px;">
        <h3 style="margin-top:0;margin-bottom:16px;">Overview</h3>
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:var(--text-secondary);">Project ID</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${project.id}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:var(--text-secondary);">Type</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${project.type}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:var(--text-secondary);">Location</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${project.state}, ${project.district}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:var(--text-secondary);">Area</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${project.landArea} hectares</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:var(--text-secondary);">Affected Families</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${project.affectedFamilies}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:var(--text-secondary);">Current Stage</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${project.currentStage}</td></tr>
        </table>
        <div style="margin-top:24px;">
          <h4 style="margin-bottom:12px;">Financials</h4>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:0.85rem;">
            <span>Disbursed: ₹${project.compensationDisbursed}Cr</span>
            <span>Total: ₹${project.compensationAmount}Cr</span>
          </div>
          <div style="height:8px;background:#e5e7eb;border-radius:4px;">
            <div style="height:8px;background:var(--accent-primary);border-radius:4px;width:${project.compensationStatus}%;"></div>
          </div>
        </div>
      </div>
      
      <div style="flex:1;min-width:300px;">
        <h3 style="margin-top:0;margin-bottom:16px;">AI Risk Analysis</h3>
        <div style="background:var(--surface-bg);padding:16px;border-radius:8px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:4px;">Calculated Risk Score</div>
            <div style="font-size:1.5rem;font-weight:bold;color:${project.riskColor};">${project.riskScore}/100</div>
          </div>
          <div class="risk-badge ${project.riskCategory.toLowerCase()}">${project.riskCategory} Risk</div>
        </div>
        
        <h4 style="margin-bottom:12px;">Key Delay Factors</h4>
        <div>
          ${project.shapValues.slice(0, 3).map(sv => {
            const color = sv.impact > 0 ? (sv.impact > 10 ? 'var(--risk-high)' : 'var(--risk-medium)') : 'var(--risk-low)';
            const pct = Math.min(Math.abs(sv.impact) * 4, 100);
            return `
              <div class="delay-factor">
                <span class="label" style="min-width:120px;">${sv.feature}</span>
                <div class="bar-container">
                  <div class="bar" style="width:${pct}%;background:${color};"></div>
                </div>
                <span class="percentage" style="color:${color};">${Math.abs(sv.impact).toFixed(0)}%</span>
              </div>
            `;
          }).join('')}
        </div>
        
        <div style="margin-top:24px;">
          <button class="btn btn-primary" style="width:100%;" onclick="window.closeModal(); window.showToast('Report Generated', 'Full PDF report for ${project.id} is downloading.', 'success');">
            <i data-lucide="download" style="width:16px;margin-right:8px;"></i> Download Detailed Report
          </button>
        </div>
      </div>
    </div>
  `;
  window.openModal(project.name, html);
};

const pages = {
  dashboard: renderDashboard,
  projects: renderProjects,
  map: renderMap,
  alerts: renderAlerts,
  reports: renderReports,
  settings: renderSettings,
};

let currentPage = 'dashboard';

function navigate(page) {
  currentPage = page;
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  // Render page
  const main = document.getElementById('mainContent');
  main.innerHTML = '';
  if (pages[page]) pages[page](main);
  // Re-initialize lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Set up nav click handlers
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => navigate(item.dataset.page));
});

// Initial render
navigate('dashboard');
window.navigate = navigate;

// Global UI Utilities
window.showToast = function(title, message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle-2';
  if (type === 'error') iconName = 'alert-triangle';
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i data-lucide="${iconName}" style="width:24px;height:24px;"></i>
    </div>
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;
  
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons({root: toast});
  
  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

window.openModal = function(title, htmlContent) {
  const modal = document.getElementById('globalModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  if (!modal) return;
  
  modalTitle.textContent = title;
  modalBody.innerHTML = htmlContent;
  modal.classList.add('active');
  
  if (window.lucide) lucide.createIcons({root: modalBody});
};

window.closeModal = function() {
  const modal = document.getElementById('globalModal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.openPredictionForm = function() {
  const html = `
    <div style="padding:10px;">
      <h3 style="margin-top:0;margin-bottom:8px;color:var(--text-primary);">Analyze New Project</h3>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:24px;">Input the parameters of a proposed or existing project to simulate an AI risk assessment.</p>
      
      <form id="predictionForm" onsubmit="window.runPrediction(event)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Project Name</label>
            <input type="text" id="sim_name" required placeholder="e.g. Pune Metro Line 3" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
          </div>
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Project Type</label>
            <select id="sim_type" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
              <option>Highway</option><option>Railway</option><option>Airport</option><option>Smart City</option><option>Dam</option><option>Industrial Corridor</option>
            </select>
          </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">State</label>
            <input type="text" id="sim_state" required placeholder="e.g. Maharashtra" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
          </div>
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">District</label>
            <input type="text" id="sim_district" required placeholder="e.g. Pune" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
          </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px;">
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Land Area (ha)</label>
            <input type="number" id="sim_area" required min="1" value="150" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
          </div>
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Affected Families</label>
            <input type="number" id="sim_families" required min="0" value="450" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
          </div>
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Budget (Cr)</label>
            <input type="number" id="sim_budget" required min="1" value="1200" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
          </div>
        </div>
        
        <h4 style="margin-top:24px;margin-bottom:12px;font-size:0.9rem;">Current Status Metrics (Simulation Inputs)</h4>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Compensation Disbursed (Cr)</label>
            <input type="number" id="sim_comp" required min="0" value="500" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
          </div>
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Active Legal Disputes</label>
            <input type="number" id="sim_legal" required min="0" value="3" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
          </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Documentation Complete (%)</label>
            <input type="number" id="sim_docs" required min="0" max="100" value="85" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
          </div>
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:4px;">Rehabilitation Progress (%)</label>
            <input type="number" id="sim_rehab" required min="0" max="100" value="40" style="width:100%;padding:8px;border:1px solid var(--surface-border);border-radius:4px;background:var(--surface-bg);">
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary" style="width:100%;padding:12px;font-size:1rem;display:flex;align-items:center;justify-content:center;gap:8px;" id="sim_submit">
          <i data-lucide="brain-circuit"></i> Run AI Risk Analysis
        </button>
      </form>
    </div>
  `;
  window.openModal('AI Risk Predictor', html);
};

window.runPrediction = async function(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('sim_submit');
  submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin" style="animation: spin 1s linear infinite;"></i> Processing with XGBoost v2.4...';
  submitBtn.style.opacity = '0.8';
  submitBtn.disabled = true;
  
  if (window.lucide) lucide.createIcons({root: submitBtn.parentElement});
  
  window.showToast('AI Engine Started', 'Analyzing 6 risk factors and calculating SHAP values...', 'info');
  
  // Dynamic import to break circular dependency if necessary, or just use the imported module
  const { addAndEnrichProject } = await import('./data/mlEngine.js');
  
  // Gather raw data
  const rawProject = {
    name: document.getElementById('sim_name').value,
    type: document.getElementById('sim_type').value,
    state: document.getElementById('sim_state').value,
    district: document.getElementById('sim_district').value,
    landArea: parseFloat(document.getElementById('sim_area').value),
    affectedFamilies: parseInt(document.getElementById('sim_families').value),
    budget: parseFloat(document.getElementById('sim_budget').value),
    compensationAmount: parseFloat(document.getElementById('sim_budget').value) * 0.4, // Estimate 40% of budget for land
    compensationDisbursed: parseFloat(document.getElementById('sim_comp').value),
    legalDisputes: parseInt(document.getElementById('sim_legal').value),
    totalLegalCases: parseInt(document.getElementById('sim_legal').value) + 2,
    documentationComplete: parseInt(document.getElementById('sim_docs').value),
    rehabilitationProgress: parseInt(document.getElementById('sim_rehab').value),
    possessionStatus: parseInt(document.getElementById('sim_rehab').value) + 10,
    currentStage: 'Compensation',
    approvalDays: 45,
    expectedApprovalDays: 30,
    coordinates: { lat: 21.0, lng: 79.0 } // default center
  };
  
  rawProject.compensationStatus = Math.round((rawProject.compensationDisbursed / rawProject.compensationAmount) * 100) || 0;
  
  setTimeout(() => {
    // Generate prediction
    const enrichedProject = addAndEnrichProject(rawProject);
    
    // Close form and open results
    window.closeModal();
    window.showToast('Analysis Complete', `Predicted Risk: ${enrichedProject.riskCategory} (${enrichedProject.riskScore}/100)`, 'success');
    
    setTimeout(() => {
      // Re-render dashboard or projects if they are active to show the new project
      if (document.getElementById('projectsTable')) { navigate('projects'); }
      if (document.getElementById('highRiskTable')) { navigate('dashboard'); }
      
      // Show details
      window.showProjectModal(enrichedProject.id);
    }, 500);
    
  }, 1800); // 1.8s simulation delay
};

