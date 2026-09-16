// Data for generating realistic Indian land acquisition projects
const statesData = {
  'Maharashtra': { count: 18, cities: [['Mumbai', 19.0760, 72.8777], ['Pune', 18.5204, 73.8567], ['Nagpur', 21.1458, 79.0882], ['Nashik', 20.0059, 73.7898], ['Aurangabad', 19.8762, 75.3433], ['Thane', 19.2183, 72.9781]] },
  'Uttar Pradesh': { count: 16, cities: [['Lucknow', 26.8467, 80.9462], ['Noida', 28.5355, 77.3910], ['Agra', 27.1767, 78.0081], ['Varanasi', 25.3176, 82.9739], ['Kanpur', 26.4499, 80.3319], ['Ghaziabad', 28.6692, 77.4538]] },
  'Gujarat': { count: 14, cities: [['Ahmedabad', 23.0225, 72.5714], ['Surat', 21.1702, 72.8311], ['Vadodara', 22.3072, 73.1812], ['Rajkot', 22.3039, 70.8022], ['Gandhinagar', 23.2156, 72.6369]] },
  'Tamil Nadu': { count: 12, cities: [['Chennai', 13.0827, 80.2707], ['Coimbatore', 11.0168, 76.9558], ['Madurai', 9.9252, 78.1198], ['Salem', 11.6643, 78.1460], ['Tiruchirappalli', 10.7905, 78.7047]] },
  'Karnataka': { count: 12, cities: [['Bengaluru', 12.9716, 77.5946], ['Mysuru', 12.2958, 76.6394], ['Hubli', 15.3647, 75.1240], ['Mangaluru', 12.9141, 74.8560], ['Belgaum', 15.8497, 74.4977]] },
  'Rajasthan': { count: 10, cities: [['Jaipur', 26.9124, 75.7873], ['Jodhpur', 26.2389, 73.0243], ['Udaipur', 24.5854, 73.7125], ['Kota', 25.2138, 75.8648], ['Ajmer', 26.4499, 74.6399]] },
  'Madhya Pradesh': { count: 10, cities: [['Bhopal', 23.2599, 77.4126], ['Indore', 22.7196, 75.8577], ['Jabalpur', 23.1815, 79.9864], ['Gwalior', 26.2183, 78.1828]] },
  'West Bengal': { count: 8, cities: [['Kolkata', 22.5726, 88.3639], ['Howrah', 22.5958, 88.3110], ['Siliguri', 26.7271, 88.3953], ['Durgapur', 23.5204, 87.3119]] },
  'Telangana': { count: 8, cities: [['Hyderabad', 17.3850, 78.4867], ['Warangal', 17.9689, 79.5941], ['Karimnagar', 18.4386, 79.1288]] },
  'Kerala': { count: 6, cities: [['Thiruvananthapuram', 8.5241, 76.9366], ['Kochi', 9.9312, 76.2673], ['Kozhikode', 11.2588, 75.7804]] },
  'Punjab': { count: 6, cities: [['Chandigarh', 30.7333, 76.7794], ['Ludhiana', 30.9010, 75.8573], ['Amritsar', 31.6340, 74.8723]] },
  'Others': { count: 8, cities: [['Bhubaneswar', 20.2961, 85.8245], ['Cuttack', 20.4625, 85.8828], ['Patna', 25.5941, 85.1376], ['Gaya', 24.7914, 85.0002], ['Ranchi', 23.3441, 85.3096], ['Guwahati', 26.1445, 91.7362]] }
};

const projectTypes = ['Highway', 'Railway', 'Industrial Corridor', 'Expressway', 'Dam', 'Power Plant', 'Smart City', 'Airport', 'Port', 'Canal'];
const stages = ['Notification', 'Survey & Demarcation', 'Compensation', 'Legal Clearance', 'Possession', 'R&R'];
const departments = ['NHAI', 'Railways', 'State Govt', 'Airport Authority', 'Port Trust', 'NTPC'];
const managers = ['Rajesh Kumar', 'Amit Singh', 'Priya Sharma', 'Suresh Patel', 'Anita Desai', 'Manoj Tiwari', 'Sunil Verma', 'Neha Gupta'];

// Seeded random generator for reproducible results
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function generateProjects() {
  const generated = [];
  let idCounter = 1;
  let seed = 42;

  // Distribution: ~32 high (25%), ~54 medium (42%), ~42 low (33%)
  const riskProfiles = [];
  for (let i=0; i<32; i++) riskProfiles.push('High');
  for (let i=0; i<54; i++) riskProfiles.push('Medium');
  for (let i=0; i<42; i++) riskProfiles.push('Low');

  // Shuffle risks
  for (let i = riskProfiles.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed++) * (i + 1));
    [riskProfiles[i], riskProfiles[j]] = [riskProfiles[j], riskProfiles[i]];
  }

  const getRand = (min, max) => min + seededRandom(seed++) * (max - min);
  const getInt = (min, max) => Math.floor(getRand(min, max + 1));
  const getChoice = (arr) => arr[getInt(0, arr.length - 1)];

  Object.entries(statesData).forEach(([state, data]) => {
    for (let i = 0; i < data.count; i++) {
      const cityData = getChoice(data.cities);
      const city = cityData[0];
      const lat = cityData[1] + getRand(-0.05, 0.05);
      const lng = cityData[2] + getRand(-0.05, 0.05);
      
      const risk = riskProfiles.pop();
      let compDisp, legalDisp, appDays, docComp, poss;
      
      if (risk === 'High') {
        compDisp = getRand(0.1, 0.4);
        legalDisp = getInt(15, 30);
        appDays = getInt(100, 250);
        docComp = getInt(30, 60);
        poss = getInt(10, 40);
      } else if (risk === 'Medium') {
        compDisp = getRand(0.4, 0.7);
        legalDisp = getInt(5, 15);
        appDays = getInt(60, 100);
        docComp = getInt(60, 85);
        poss = getInt(40, 70);
      } else {
        compDisp = getRand(0.7, 1.0);
        legalDisp = getInt(0, 5);
        appDays = getInt(20, 60);
        docComp = getInt(85, 100);
        poss = getInt(70, 100);
      }
      
      const totalLegal = legalDisp + getInt(2, 10);
      const compAmt = Math.round(getRand(50, 5000) * 10) / 10;
      const projType = getChoice(projectTypes);
      const name = `${city} ${projType} Phase ${getInt(1, 3)}`;
      const compStatus = Math.round(compDisp * 100);
      
      const p = {
        id: `LA-${String(idCounter).padStart(3, '0')}`,
        name,
        type: projType,
        state: state === 'Others' ? getChoice(['Odisha', 'Bihar', 'Jharkhand', 'Assam']) : state,
        district: city,
        landArea: Math.round(getRand(50, 2000) * 10) / 10,
        affectedFamilies: getInt(50, 2000),
        currentStage: getChoice(stages),
        stageProgress: getInt(10, 90),
        compensationStatus: compStatus,
        compensationAmount: compAmt,
        compensationDisbursed: Math.round(compAmt * compDisp * 10) / 10,
        approvalDays: appDays,
        expectedApprovalDays: 60,
        legalDisputes: legalDisp,
        totalLegalCases: totalLegal,
        possessionStatus: poss,
        rehabilitationProgress: poss > 10 ? getInt(poss - 10, Math.min(poss + 10, 100)) : poss,
        documentationComplete: docComp,
        stakeholderResponseDays: getInt(5, 40),
        startDate: `${getInt(2022, 2024)}-${String(getInt(1, 12)).padStart(2, '0')}-15`,
        expectedEndDate: '2026-12-31',
        lastUpdated: '2025-05-10',
        coordinates: { lat: Math.round(lat*10000)/10000, lng: Math.round(lng*10000)/10000 },
        projectManager: getChoice(managers),
        department: getChoice(departments),
        budget: Math.round(compAmt * getRand(1.5, 3.0)),
        notifications: [
          { date: '2025-05-01', type: risk === 'High' ? 'warning' : 'info', message: risk === 'High' ? `Warning: Delay detected for ${name}` : `Routine update for ${name}` }
        ],
      };
      
      generated.push(p);
      idCounter++;
    }
  });
  
  return generated;
}

export const projects = generateProjects();
