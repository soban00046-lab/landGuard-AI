import { projects } from './mockProjects.js';

// Calculate risk score for a project (0-100)
export function calculateRiskScore(project) {
  // 1. Compensation delay (25%)
  let compDelayScore = 0;
  if (project.compensationAmount > 0) {
     const compRatio = project.compensationDisbursed / project.compensationAmount;
     compDelayScore = (1 - compRatio) * 25;
  }
  
  // 2. Legal dispute intensity (20%)
  const legalRatio = project.totalLegalCases > 0 ? (project.legalDisputes / project.totalLegalCases) : 0;
  const legalScore = legalRatio * 20;

  // 3. Approval delay (15%)
  // expected vs actual
  const approvalDelay = Math.min((project.approvalDays / project.expectedApprovalDays) * 7.5, 15);

  // 4. Documentation gaps (12%)
  const docGaps = ((100 - project.documentationComplete) / 100) * 12;

  // 5. Rehabilitation progress (10%)
  const rehabScore = ((100 - (project.rehabilitationProgress || 0)) / 100) * 10;

  // 6. Possession status (8%)
  const possScore = ((100 - (project.possessionStatus || 0)) / 100) * 8;

  // 7. Stakeholder responsiveness (5%)
  const stakeScore = Math.min((project.stakeholderResponseDays / 30) * 5, 5);

  // 8. Timeline risk (5%)
  const timelineScore = 2.5; // baseline assumption

  let totalRisk = compDelayScore + legalScore + approvalDelay + docGaps + rehabScore + possScore + stakeScore + timelineScore;
  return Math.min(Math.max(Math.round(totalRisk), 0), 100);
}

// Get risk category
export function getRiskCategory(score) {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

// Get risk color
export function getRiskColor(category) {
  return { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e' }[category];
}

// Generate SHAP values for a project (explaining why score is what it is)
export function generateShapValues(project) {
  const compImpact = (1 - (project.compensationDisbursed / (project.compensationAmount||1))) * 25;
  const legalImpact = (project.totalLegalCases > 0 ? (project.legalDisputes / project.totalLegalCases) : 0) * 20;
  const approvalImpact = Math.min((project.approvalDays / project.expectedApprovalDays) * 7.5, 15);
  const docImpact = ((100 - project.documentationComplete) / 100) * 12;
  const rehabImpact = ((100 - (project.rehabilitationProgress||0)) / 100) * 10;
  const possImpact = ((100 - (project.possessionStatus||0)) / 100) * 8;

  const values = [
    { feature: 'Compensation Delay', value: `${project.compensationStatus}% disbursed`, impact: compImpact, direction: compImpact > 6 ? 'positive' : 'negative' },
    { feature: 'Legal Disputes', value: `${project.legalDisputes} active cases`, impact: legalImpact, direction: legalImpact > 5 ? 'positive' : 'negative' },
    { feature: 'Approval Delay', value: `${project.approvalDays} days`, impact: approvalImpact, direction: approvalImpact > 5 ? 'positive' : 'negative' },
    { feature: 'Documentation Gaps', value: `${100 - project.documentationComplete}% missing`, impact: docImpact, direction: docImpact > 4 ? 'positive' : 'negative' },
    { feature: 'Rehabilitation Lag', value: `${project.rehabilitationProgress}% complete`, impact: rehabImpact, direction: rehabImpact > 3 ? 'positive' : 'negative' },
    { feature: 'Possession Delay', value: `${project.possessionStatus}% possessed`, impact: possImpact, direction: possImpact > 3 ? 'positive' : 'negative' },
  ];

  return values.sort((a,b) => Math.abs(b.impact) - Math.abs(a.impact));
}

// Generate recommendations for a project
export function generateRecommendations(project, shapValues) {
  const recs = [];

  if (project.compensationStatus < 50) {
    recs.push({ priority: 'critical', action: 'Expedite compensation release — coordinate with state treasury for immediate fund allocation.', category: 'Finance' });
  }
  if (project.legalDisputes > 5) {
    recs.push({ priority: 'high', action: 'Resolve pending legal cases — setup Lok Adalat or assign dedicated legal task force.', category: 'Legal' });
  }
  if (project.documentationComplete < 70) {
    recs.push({ priority: 'medium', action: 'Complete documentation — deploy mobile field units to collect missing KYC documents.', category: 'Administrative' });
  }
  if (project.approvalDays > project.expectedApprovalDays * 1.5) {
    recs.push({ priority: 'high', action: 'Escalate approval delays — coordinate with district administration for fast-track clearance.', category: 'Administrative' });
  }
  if (project.rehabilitationProgress < 40) {
    recs.push({ priority: 'medium', action: 'Accelerate R&R progress — engage NGOs and local bodies for resettlement infrastructure.', category: 'Rehabilitation' });
  }
  if (project.possessionStatus < 50) {
    recs.push({ priority: 'medium', action: 'Prioritize land possession — resolve ownership conflicts and initiate handover process.', category: 'Possession' });
  }

  if (recs.length === 0) {
    recs.push({ priority: 'low', action: 'Maintain current progress rate. Keep stakeholders informed of upcoming milestones.', category: 'General' });
  }
  return recs;
}

// Get delay probability by stage
export function getDelayProbability(project) {
  const risk = calculateRiskScore(project);
  return {
    'Notification': Math.min(risk * 0.1, 100),
    'Survey & Demarcation': Math.min(risk * 0.3, 100),
    'Compensation': Math.min(risk * 0.7, 100),
    'Legal Clearance': Math.min(risk * 0.8, 100),
    'Possession': Math.min(risk * 0.75, 100),
    'R&R': Math.min(risk * 0.85, 100)
  };
}

// Get all projects with computed risk data
export function getEnrichedProjects() {
  return projects.map(p => {
    const riskScore = calculateRiskScore(p);
    const riskCategory = getRiskCategory(riskScore);
    const shapValues = generateShapValues(p);
    
    return {
      ...p,
      riskScore,
      riskCategory,
      riskColor: getRiskColor(riskCategory),
      shapValues,
      recommendations: generateRecommendations(p, shapValues),
      delayProbability: getDelayProbability(p),
    };
  });
}

// Aggregate statistics
export function getDashboardStats(enrichedProjects) {
  const totalProjects = enrichedProjects.length;
  const highRisk = enrichedProjects.filter(p => p.riskCategory === 'High').length;
  const mediumRisk = enrichedProjects.filter(p => p.riskCategory === 'Medium').length;
  const lowRisk = enrichedProjects.filter(p => p.riskCategory === 'Low').length;

  const totalBudget = enrichedProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const budgetUtilized = enrichedProjects.reduce((sum, p) => sum + (p.compensationDisbursed || 0), 0);

  // Stage risks as array for Chart.js stacked bar chart
  const stageNames = ['Notification', 'Survey & Demarcation', 'Compensation', 'Legal Clearance', 'Possession', 'R&R'];
  const stageRisks = stageNames.map(stage => {
    const inStage = enrichedProjects.filter(p => p.currentStage === stage);
    return {
      stage,
      high: inStage.filter(p => p.riskCategory === 'High').length,
      medium: inStage.filter(p => p.riskCategory === 'Medium').length,
      low: inStage.filter(p => p.riskCategory === 'Low').length,
    };
  });

  // Key delay drivers — aggregate SHAP feature impacts across all projects
  const featureImpacts = {};
  enrichedProjects.forEach(p => {
    (p.shapValues || []).forEach(sv => {
      if (!featureImpacts[sv.feature]) featureImpacts[sv.feature] = 0;
      featureImpacts[sv.feature] += Math.abs(sv.impact);
    });
  });
  const totalImpact = Object.values(featureImpacts).reduce((s, v) => s + v, 0) || 1;
  const driverColors = {
    'Compensation Delay': '#ef4444',
    'Legal Disputes': '#f59e0b',
    'Documentation Gaps': '#2196f3',
    'Rehabilitation Lag': '#9333ea',
    'Approval Delay': '#06b6d4',
    'Possession Delay': '#f97316',
  };
  const delayDrivers = Object.entries(featureImpacts)
    .map(([name, val]) => ({
      name,
      percentage: Math.round((val / totalImpact) * 100),
      color: driverColors[name] || '#64748b',
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // State-wise stats
  const stateWise = {};
  enrichedProjects.forEach(p => {
    if (!stateWise[p.state]) stateWise[p.state] = { total: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 };
    stateWise[p.state].total++;
    if (p.riskCategory === 'High') stateWise[p.state].highRisk++;
    else if (p.riskCategory === 'Medium') stateWise[p.state].mediumRisk++;
    else stateWise[p.state].lowRisk++;
  });

  return {
    totalProjects,
    highRisk,
    mediumRisk,
    lowRisk,
    trends: { budgetUtilized, totalBudget },
    stageRisks,
    delayDrivers,
    stateWise,
  };
}
