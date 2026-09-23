import { getEnrichedProjects } from '../data/mlEngine.js';

export function renderProjects(container) {
  const projects = getEnrichedProjects();
  let filteredProjects = [...projects];
  let currentView = 'table';
  
  const states = [...new Set(projects.map(p => p.state))].sort();
  
  const updateStats = () => {
    const high = filteredProjects.filter(p => p.riskCategory === 'High').length;
    const med = filteredProjects.filter(p => p.riskCategory === 'Medium').length;
    const low = filteredProjects.filter(p => p.riskCategory === 'Low').length;
    
    document.getElementById('projectCount').innerText = `${filteredProjects.length} Projects Found`;
    document.getElementById('statHigh').innerText = `${high} High Risk`;
    document.getElementById('statMed').innerText = `${med} Medium Risk`;
    document.getElementById('statLow').innerText = `${low} Low Risk`;
  };

  const renderView = () => {
    const contentArea = document.getElementById('projectsContent');
    if (currentView === 'table') {
      contentArea.innerHTML = `
        <div class="table-responsive">
          <table class="data-table" id="projectsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project Name</th>
                <th>Location</th>
                <th>Stage</th>
                <th>Progress</th>
                <th>Risk Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredProjects.slice(0, 20).map(p => `
                <tr data-id="${p.id}">
                  <td>${p.id}</td>
                  <td style="font-weight:500;">${p.name}</td>
                  <td>${p.state} - ${p.district}</td>
                  <td>${p.currentStage}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <div style="flex-grow:1;height:6px;background:#e5e7eb;border-radius:3px;">
                        <div style="height:6px;background:var(--accent-primary);border-radius:3px;width:${p.compensationStatus}%;"></div>
                      </div>
                      <span style="font-size:0.75rem;">${p.compensationStatus}%</span>
                    </div>
                  </td>
                  <td><span class="risk-score-circle ${p.riskCategory.toLowerCase()}">${p.riskScore}</span></td>
                  <td><button class="btn btn-secondary btn-sm view-btn" data-id="${p.id}">Details</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${filteredProjects.length > 20 ? `<div style="text-align:center;margin-top:16px;"><button class="btn btn-secondary">Show More</button></div>` : ''}
      `;
    } else {
      contentArea.innerHTML = `
        <div class="project-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:20px;">
          ${filteredProjects.slice(0, 20).map(p => `
            <div class="card p-4">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
                <h4 style="margin:0;font-size:1.1rem;">${p.name}</h4>
                <span class="risk-score-circle ${p.riskCategory.toLowerCase()}">${p.riskScore}</span>
              </div>
              <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px;"><i data-lucide="map-pin" style="width:14px;height:14px;"></i> ${p.state}, ${p.district}</p>
              
              <div style="margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px;">
                  <span>Compensation</span>
                  <span>${p.compensationStatus}%</span>
                </div>
                <div style="height:6px;background:#e5e7eb;border-radius:3px;">
                  <div style="height:6px;background:var(--accent-primary);border-radius:3px;width:${p.compensationStatus}%;"></div>
                </div>
              </div>
              
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;background:var(--surface-bg);padding:8px;border-radius:6px;margin-bottom:16px;">
                <div><strong>Stage:</strong><br>${p.currentStage}</div>
                <div><strong>Area:</strong><br>${p.landArea} ha</div>
              </div>
              
              <button class="btn btn-primary btn-sm view-btn" data-id="${p.id}" style="width:100%;">View Analysis</button>
            </div>
          `).join('')}
        </div>
        ${filteredProjects.length > 20 ? `<div style="text-align:center;margin-top:24px;"><button class="btn btn-secondary">Load More Projects</button></div>` : ''}
      `;
    }
    if (window.lucide) lucide.createIcons();

    // Attach click handlers
    contentArea.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const project = filteredProjects.find(p => p.id === id);
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
        
        if (window.openModal) {
          window.openModal(`${project.name}`, html);
        }
      });
    });
  };

  container.innerHTML = `
    <div class="header" style="margin-bottom: 24px;">
      <div class="header-title">
        <h2>📂 All Projects Explorer</h2>
        <p>Comprehensive list of land acquisition projects</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="window.openPredictionForm()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;">
          <i data-lucide="brain-circuit" style="width:18px;height:18px;"></i> + Analyze New Project
        </button>
      </div>
    </div>
    
    <div class="card" style="margin-bottom: 24px;">
      <div class="card-body" style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;">
        <div style="flex-grow:1;min-width:200px;">
          <label style="display:block;margin-bottom:4px;font-size:0.85rem;font-weight:600;">Search</label>
          <input type="text" id="searchProj" class="form-control" placeholder="Search by name or ID..." style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;">
        </div>
        <div>
          <label style="display:block;margin-bottom:4px;font-size:0.85rem;font-weight:600;">State</label>
          <select id="filterState" class="form-control" style="padding:8px;border:1px solid #ccc;border-radius:4px;">
            <option value="All">All States</option>
            ${states.map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:4px;font-size:0.85rem;font-weight:600;">Risk Level</label>
          <select id="filterRisk" class="form-control" style="padding:8px;border:1px solid #ccc;border-radius:4px;">
            <option value="All">All Risks</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
        <div>
          <button id="viewTable" class="btn ${currentView === 'table' ? 'btn-primary' : 'btn-secondary'}" style="padding:8px 12px;"><i data-lucide="list"></i></button>
          <button id="viewGrid" class="btn ${currentView === 'grid' ? 'btn-primary' : 'btn-secondary'}" style="padding:8px 12px;"><i data-lucide="grid"></i></button>
        </div>
      </div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;font-size:0.9rem;background:var(--surface-bg);padding:12px;border-radius:8px;">
      <strong id="projectCount">0 Projects Found</strong>
      <div style="display:flex;gap:16px;">
        <span id="statHigh" style="color:var(--risk-high);font-weight:600;">0 High Risk</span>
        <span id="statMed" style="color:var(--risk-medium);font-weight:600;">0 Medium Risk</span>
        <span id="statLow" style="color:var(--risk-low);font-weight:600;">0 Low Risk</span>
      </div>
    </div>

    <div id="projectsContent"></div>
  `;

  if (window.lucide) lucide.createIcons();

  const applyFilters = () => {
    const term = document.getElementById('searchProj').value.toLowerCase();
    const state = document.getElementById('filterState').value;
    const risk = document.getElementById('filterRisk').value;
    
    filteredProjects = projects.filter(p => {
      const matchTerm = p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term);
      const matchState = state === 'All' || p.state === state;
      const matchRisk = risk === 'All' || p.riskCategory === risk;
      return matchTerm && matchState && matchRisk;
    });
    
    updateStats();
    renderView();
  };

  document.getElementById('searchProj').addEventListener('input', applyFilters);
  document.getElementById('filterState').addEventListener('change', applyFilters);
  document.getElementById('filterRisk').addEventListener('change', applyFilters);
  
  document.getElementById('viewTable').addEventListener('click', () => {
    currentView = 'table';
    document.getElementById('viewTable').className = 'btn btn-primary';
    document.getElementById('viewGrid').className = 'btn btn-secondary';
    renderView();
  });
  
  document.getElementById('viewGrid').addEventListener('click', () => {
    currentView = 'grid';
    document.getElementById('viewGrid').className = 'btn btn-primary';
    document.getElementById('viewTable').className = 'btn btn-secondary';
    renderView();
  });

  updateStats();
  renderView();
}
