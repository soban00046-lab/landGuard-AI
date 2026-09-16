import { renderDashboard } from './pages/dashboard.js';
import { renderProjects } from './pages/projects.js';
import { renderMap } from './pages/map.js';
import { renderAlerts } from './pages/alerts.js';
import { renderReports } from './pages/reports.js';
import { renderSettings } from './pages/settings.js';

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
