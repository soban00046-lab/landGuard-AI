import { getEnrichedProjects, getDashboardStats } from '../data/mlEngine.js';

let charts = [];

export function renderReports(container) {
  const projects = getEnrichedProjects();
  const stats = getDashboardStats(projects);
  
  // Clean up old charts
  charts.forEach(c => c.destroy());
  charts = [];

  container.innerHTML = `
    <div class="header" style="margin-bottom: 24px;">
      <div class="header-title">
        <h2>📑 Reports & Analytics</h2>
        <p>Generate detailed insights and download PDF reports</p>
      </div>
    </div>
    
    <!-- Report Templates Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:20px;margin-bottom:32px;">
      
      <div class="card p-4">
        <h3 style="font-size:1.1rem;margin-bottom:8px;">State-wise Summary</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">Comprehensive breakdown of land acquisition progress and risks across all states.</p>
        <div style="height:120px;margin-bottom:16px;"><canvas id="miniChart1"></canvas></div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary btn-sm" style="flex:1;">Generate</button>
          <button class="btn btn-secondary btn-sm"><i data-lucide="download"></i> PDF</button>
        </div>
      </div>
      
      <div class="card p-4">
        <h3 style="font-size:1.1rem;margin-bottom:8px;">District Delay Analysis</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">Identify bottleneck districts and analyze primary causes of acquisition delays.</p>
        <div style="height:120px;margin-bottom:16px;"><canvas id="miniChart2"></canvas></div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary btn-sm" style="flex:1;">Generate</button>
          <button class="btn btn-secondary btn-sm"><i data-lucide="download"></i> PDF</button>
        </div>
      </div>
      
      <div class="card p-4">
        <h3 style="font-size:1.1rem;margin-bottom:8px;">Stage Performance</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">Evaluate efficiency at each acquisition stage (Notification to Possession).</p>
        <div style="height:120px;margin-bottom:16px;"><canvas id="miniChart3"></canvas></div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary btn-sm" style="flex:1;">Generate</button>
          <button class="btn btn-secondary btn-sm"><i data-lucide="download"></i> PDF</button>
        </div>
      </div>
      
      <div class="card p-4">
        <h3 style="font-size:1.1rem;margin-bottom:8px;">Monthly Risk Trends</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">Historical tracking of AI risk scores to monitor improvements or degradations.</p>
        <div style="height:120px;margin-bottom:16px;"><canvas id="miniChart4"></canvas></div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary btn-sm" style="flex:1;">Generate</button>
          <button class="btn btn-secondary btn-sm"><i data-lucide="download"></i> PDF</button>
        </div>
      </div>

    </div>
    
    <h3 style="margin-bottom:16px;">📈 Quick Analytics</h3>
    <div class="dashboard-grid dashboard-row-2col">
      <div class="card">
        <div class="card-header"><h4>Risk Distribution</h4></div>
        <div class="card-body"><div style="height:300px;"><canvas id="mainChart1"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header"><h4>State-wise Project Count</h4></div>
        <div class="card-body"><div style="height:300px;"><canvas id="mainChart2"></canvas></div></div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();

  setTimeout(() => initCharts(stats, projects), 100);
}

function initCharts(stats, projects) {
  // Mini Chart 1 (Doughnut)
  const ctx1 = document.getElementById('miniChart1');
  if(ctx1) charts.push(new Chart(ctx1, {
    type: 'doughnut',
    data: {
      labels: ['High', 'Medium', 'Low'],
      datasets: [{ data: [stats.highRisk, stats.mediumRisk, stats.lowRisk], backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'] }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '70%' }
  }));

  // Mini Chart 2 (Line)
  const ctx2 = document.getElementById('miniChart2');
  if(ctx2) charts.push(new Chart(ctx2, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ data: [12, 19, 15, 22, 18, 25], borderColor: '#3b82f6', tension: 0.4, pointRadius: 0 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
  }));

  // Mini Chart 3 (Bar)
  const ctx3 = document.getElementById('miniChart3');
  if(ctx3) charts.push(new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: ['S1', 'S2', 'S3', 'S4'],
      datasets: [{ data: [40, 60, 30, 80], backgroundColor: '#8b5cf6', borderRadius: 4 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
  }));

  // Mini Chart 4 (Area)
  const ctx4 = document.getElementById('miniChart4');
  if(ctx4) charts.push(new Chart(ctx4, {
    type: 'line',
    data: {
      labels: ['W1', 'W2', 'W3', 'W4'],
      datasets: [{ data: [30, 20, 40, 10], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.2)', fill: true, tension: 0.4, pointRadius: 0 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
  }));

  // Main Chart 1
  const mCtx1 = document.getElementById('mainChart1');
  if(mCtx1) charts.push(new Chart(mCtx1, {
    type: 'doughnut',
    data: {
      labels: ['High Risk', 'Medium Risk', 'Low Risk'],
      datasets: [{ data: [stats.highRisk, stats.mediumRisk, stats.lowRisk], backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'] }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
  }));

  // Main Chart 2 (State-wise bar)
  const stateCounts = {};
  projects.forEach(p => { stateCounts[p.state] = (stateCounts[p.state] || 0) + 1; });
  const mCtx2 = document.getElementById('mainChart2');
  if(mCtx2) charts.push(new Chart(mCtx2, {
    type: 'bar',
    data: {
      labels: Object.keys(stateCounts),
      datasets: [{ label: 'Projects', data: Object.values(stateCounts), backgroundColor: '#3b82f6', borderRadius: 4 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  }));
}
