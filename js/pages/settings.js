export function renderSettings(container) {
  container.innerHTML = `
    <div class="header" style="margin-bottom: 24px;">
      <div class="header-title">
        <h2>⚙️ Settings & Configuration</h2>
        <p>Manage application preferences and model parameters</p>
      </div>
    </div>
    
    <div class="dashboard-grid dashboard-row-2col" style="gap:24px;">
      
      <!-- User Profile -->
      <div class="card">
        <div class="card-header with-border">
          <h3 style="font-size:1.1rem;margin:0;">User Profile</h3>
        </div>
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
            <div style="width:64px;height:64px;border-radius:50%;background:var(--accent-gradient);display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;font-weight:bold;">AK</div>
            <div>
              <h4 style="margin:0 0 4px 0;font-size:1.2rem;">Admin Kumar</h4>
              <p style="margin:0;color:var(--text-secondary);font-size:0.85rem;">admin@landguard.gov.in</p>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;">Role</label>
            <input type="text" class="form-control" value="System Administrator" readonly style="width:100%;padding:8px;background:var(--surface-bg);border:1px solid #e5e7eb;border-radius:4px;">
          </div>
          <div class="form-group">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;">Department</label>
            <input type="text" class="form-control" value="Land Acquisition Cell (Central)" readonly style="width:100%;padding:8px;background:var(--surface-bg);border:1px solid #e5e7eb;border-radius:4px;">
          </div>
        </div>
      </div>
      
      <!-- Notification Prefs -->
      <div class="card">
        <div class="card-header with-border">
          <h3 style="font-size:1.1rem;margin:0;">Notification Preferences</h3>
        </div>
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #eee;">
            <div>
              <strong style="display:block;margin-bottom:4px;">Email Alerts</strong>
              <span style="font-size:0.8rem;color:var(--text-secondary);">Receive daily summary reports</span>
            </div>
            <label style="position:relative;display:inline-block;width:44px;height:24px;">
              <input type="checkbox" checked style="opacity:0;width:0;height:0;">
              <span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--accent-primary);border-radius:24px;transition:.4s;"><span style="position:absolute;content:'';height:18px;width:18px;left:3px;bottom:3px;background-color:white;border-radius:50%;transition:.4s;transform:translateX(20px);"></span></span>
            </label>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #eee;">
            <div>
              <strong style="display:block;margin-bottom:4px;">SMS Alerts</strong>
              <span style="font-size:0.8rem;color:var(--text-secondary);">For critical high-risk shifts</span>
            </div>
            <label style="position:relative;display:inline-block;width:44px;height:24px;">
              <input type="checkbox" checked style="opacity:0;width:0;height:0;">
              <span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--accent-primary);border-radius:24px;transition:.4s;"><span style="position:absolute;content:'';height:18px;width:18px;left:3px;bottom:3px;background-color:white;border-radius:50%;transition:.4s;transform:translateX(20px);"></span></span>
            </label>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;">
            <div>
              <strong style="display:block;margin-bottom:4px;">Dashboard Notifications</strong>
              <span style="font-size:0.8rem;color:var(--text-secondary);">Show in-app bell notifications</span>
            </div>
            <label style="position:relative;display:inline-block;width:44px;height:24px;">
              <input type="checkbox" checked style="opacity:0;width:0;height:0;">
              <span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--accent-primary);border-radius:24px;transition:.4s;"><span style="position:absolute;content:'';height:18px;width:18px;left:3px;bottom:3px;background-color:white;border-radius:50%;transition:.4s;transform:translateX(20px);"></span></span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Model Config -->
      <div class="card">
        <div class="card-header with-border">
          <h3 style="font-size:1.1rem;margin:0;">AI Model Configuration</h3>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
            <div style="background:var(--surface-bg);padding:12px;border-radius:8px;">
              <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:4px;">Model Version</div>
              <div style="font-weight:600;">XGBoost v2.4 (LandGuard)</div>
            </div>
            <div style="background:var(--surface-bg);padding:12px;border-radius:8px;">
              <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:4px;">Last Trained</div>
              <div style="font-weight:600;">12 Aug 2026</div>
            </div>
            <div style="background:var(--surface-bg);padding:12px;border-radius:8px;">
              <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:4px;">Accuracy (AUC)</div>
              <div style="font-weight:600;color:var(--risk-low);">0.924</div>
            </div>
            <div style="background:var(--surface-bg);padding:12px;border-radius:8px;">
              <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:4px;">Next Scheduled Training</div>
              <div style="font-weight:600;">01 Oct 2026</div>
            </div>
          </div>
          <button class="btn btn-secondary" style="width:100%;"><i data-lucide="refresh-cw"></i> Retrain Model Now</button>
        </div>
      </div>
      
      <!-- System Info -->
      <div class="card">
        <div class="card-header with-border">
          <h3 style="font-size:1.1rem;margin:0;">System Information</h3>
        </div>
        <div class="card-body">
          <ul style="list-style:none;padding:0;margin:0;font-size:0.9rem;">
            <li style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
              <span style="color:var(--text-secondary);">System Version</span>
              <strong>v1.0.0-beta (Hackathon Build)</strong>
            </li>
            <li style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
              <span style="color:var(--text-secondary);">Uptime</span>
              <strong>14d 5h 22m</strong>
            </li>
            <li style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
              <span style="color:var(--text-secondary);">Data Freshness</span>
              <strong>Synced 2 hours ago</strong>
            </li>
            <li style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
              <span style="color:var(--text-secondary);">Total Records</span>
              <strong>128 active projects</strong>
            </li>
            <li style="display:flex;justify-content:space-between;padding:8px 0;">
              <span style="color:var(--text-secondary);">API Integration Status</span>
              <span style="display:flex;align-items:center;gap:6px;color:var(--risk-low);font-weight:600;"><span style="width:8px;height:8px;background:var(--risk-low);border-radius:50%;"></span> Connected</span>
            </li>
          </ul>
        </div>
      </div>
      
    </div>
  `;

  // Note: custom CSS for the switches is inline inline to avoid modifying external css files if not possible, 
  // but it works fine with the basic styles provided. 
  // If the user provided a global css, the toggle switches above simulate standard toggles.
  
  // We attach a listener to handle toggle animation (minimal inline css handles it based on standard tricks, but without input:checked ~ span it needs JS if we purely inline style it)
  // Actually, standard CSS for toggles with checkbox input:checked + span { ... } is better placed in a stylesheet, 
  // but to ensure it works without a stylesheet change, we can add a quick JS listener:
  container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const span = e.target.nextElementSibling;
      const dot = span.querySelector('span');
      if (e.target.checked) {
        span.style.backgroundColor = 'var(--accent-primary)';
        dot.style.transform = 'translateX(20px)';
      } else {
        span.style.backgroundColor = '#ccc';
        dot.style.transform = 'translateX(0)';
      }
    });
  });

  if (window.lucide) lucide.createIcons();
}
