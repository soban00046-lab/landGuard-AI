import { alerts as alertsData } from '../data/alerts.js';

// Local mutable copy
let localAlerts = alertsData.map(a => ({...a}));

export function renderAlerts(container) {
  let activeTab = 'all';
  const unreadCount = localAlerts.filter(a => !a.read).length;
  const criticalCount = localAlerts.filter(a => a.type === 'critical').length;
  const warningCount = localAlerts.filter(a => a.type === 'warning').length;
  const infoCount = localAlerts.filter(a => a.type === 'info').length;

  const getIcon = (type) => {
    if (type === 'critical') return 'alert-triangle';
    if (type === 'warning') return 'alert-circle';
    return 'info';
  };

  const getRiskVar = (type) => {
    if (type === 'critical') return 'var(--risk-high)';
    if (type === 'warning') return 'var(--risk-medium)';
    return 'var(--accent-primary)';
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
           d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const renderAlertList = () => {
    const listContainer = document.getElementById('alertsList');
    if (!listContainer) return;

    let filtered = localAlerts;
    if (activeTab !== 'all') {
      filtered = localAlerts.filter(a => a.type === activeTab);
    }

    listContainer.innerHTML = filtered.map(a => `
      <div class="alert-item ${a.type}" style="display:flex;gap:16px;padding:16px 20px;border-radius:12px;margin-bottom:12px;border-left:4px solid ${getRiskVar(a.type)};background:${a.type === 'critical' ? 'var(--risk-high-bg)' : a.type === 'warning' ? 'var(--risk-medium-bg)' : 'var(--navy-50)'};box-shadow:var(--shadow-sm);${!a.read ? 'opacity:1;' : 'opacity:0.7;'}">
        <div style="color:${getRiskVar(a.type)};flex-shrink:0;padding-top:2px;">
          <i data-lucide="${getIcon(a.type)}" style="width:22px;height:22px;"></i>
        </div>
        <div style="flex-grow:1;">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px;">
            <h4 style="margin:0;font-size:0.95rem;font-weight:600;color:var(--text-primary);">${a.title}</h4>
            <span style="font-size:0.72rem;color:var(--text-muted);white-space:nowrap;margin-left:12px;">${formatTime(a.timestamp)}</span>
          </div>
          <p style="margin:0 0 8px 0;font-size:0.85rem;color:var(--text-secondary);line-height:1.5;">${a.message}</p>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span style="font-size:0.72rem;background:var(--surface-bg);padding:3px 10px;border-radius:12px;font-weight:500;">Project: ${a.project}</span>
            <span style="font-size:0.72rem;background:var(--surface-bg);padding:3px 10px;border-radius:12px;text-transform:capitalize;font-weight:500;">${a.category}</span>
          </div>
        </div>
        <div style="flex-shrink:0;">
          ${!a.read ? `<button class="btn btn-secondary btn-sm mark-read-btn" data-id="${a.id}">Mark Read</button>` : '<span style="font-size:0.72rem;color:var(--risk-low);font-weight:500;">✓ Read</span>'}
        </div>
      </div>
    `).join('') || `<div style="text-align:center;padding:40px;color:var(--text-muted);">No alerts found in this category.</div>`;

    if (window.lucide) lucide.createIcons();

    listContainer.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const alert = localAlerts.find(a => a.id === id);
        if (alert) {
          alert.read = true;
          renderAlerts(container);
        }
      });
    });
  };

  container.innerHTML = `
    <div class="header" style="margin-bottom:24px;">
      <div class="header-title">
        <h2>🔔 Alerts & Notifications</h2>
        <p>Stay updated on critical risks and system events</p>
      </div>
      <div class="header-actions">
        <button id="markAllRead" class="btn btn-secondary"><i data-lucide="check-check" style="width:16px;height:16px;"></i> Mark All as Read</button>
      </div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(3, 1fr);margin-bottom:24px;">
      <div class="stat-card">
        <div class="stat-value">${localAlerts.length}</div>
        <div class="stat-label">Total Alerts</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:var(--accent-primary);">${unreadCount}</div>
        <div class="stat-label">Unread</div>
      </div>
      <div class="stat-card high">
        <div class="stat-value" style="color:var(--risk-high);">${criticalCount}</div>
        <div class="stat-label">Critical Actions Required</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header with-border" style="padding-bottom:0;">
        <div class="tabs" style="border-bottom:none;width:100%;">
          <div class="tab ${activeTab === 'all' ? 'active' : ''}" data-tab="all">All <span class="badge" style="background:var(--text-muted);color:white;font-size:0.65rem;padding:2px 6px;border-radius:10px;margin-left:4px;">${localAlerts.length}</span></div>
          <div class="tab ${activeTab === 'critical' ? 'active' : ''}" data-tab="critical">Critical <span class="badge" style="background:var(--risk-high);color:white;font-size:0.65rem;padding:2px 6px;border-radius:10px;margin-left:4px;">${criticalCount}</span></div>
          <div class="tab ${activeTab === 'warning' ? 'active' : ''}" data-tab="warning">Warnings <span class="badge" style="background:var(--risk-medium);color:white;font-size:0.65rem;padding:2px 6px;border-radius:10px;margin-left:4px;">${warningCount}</span></div>
          <div class="tab ${activeTab === 'info' ? 'active' : ''}" data-tab="info">Info <span class="badge" style="background:var(--accent-primary);color:white;font-size:0.65rem;padding:2px 6px;border-radius:10px;margin-left:4px;">${infoCount}</span></div>
        </div>
      </div>
      <div class="card-body" style="background:var(--surface-bg);padding:20px;">
        <div id="alertsList"></div>
      </div>
    </div>
  `;

  renderAlertList();

  container.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      activeTab = e.currentTarget.dataset.tab;
      renderAlerts(container);
    });
  });

  document.getElementById('markAllRead')?.addEventListener('click', () => {
    localAlerts.forEach(a => a.read = true);
    renderAlerts(container);
  });

  if (window.lucide) lucide.createIcons();
}
