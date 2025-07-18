// SpeedSense ROI Calculator Logic

// --- Models ---
const violationModel = {
  violationReduction: 0.90, // 90% reduction
  recoveryRates: {
    instant: 0.60,
    twentyFourHour: 0.25,
    borderEnforcement: 0.15,
    total: 1.0
  },
  calculateCurrentLosses: (fleetSize, monthlyViolations, avgFine, currentRecovery) => {
    const totalViolations = fleetSize * monthlyViolations;
    const totalFines = totalViolations * avgFine;
    const uncoveredAmount = totalFines * (1 - currentRecovery);
    return {
      totalViolations,
      totalFines,
      uncoveredAmount,
      monthlyLoss: uncoveredAmount
    };
  },
  calculateSpeedSenseImpact: (fleetSize, monthlyViolations, avgFine) => {
    const originalViolations = fleetSize * monthlyViolations;
    const reducedViolations = originalViolations * (1 - violationModel.violationReduction);
    const protectedViolations = originalViolations * violationModel.violationReduction;
    return {
      violationsPrevented: protectedViolations,
      remainingViolations: reducedViolations,
      protectedAmount: protectedViolations * avgFine,
      fullyRecoveredAmount: reducedViolations * avgFine * violationModel.recoveryRates.total
    };
  }
};

const administrativeModel = {
  avgProcessingTimePerViolation: 2, // hours
  timeReductionWithSpeedSense: 0.85, // 85% reduction
  calculateAdminSavings: (totalViolations, hourlyRate) => {
    const currentAdminTime = totalViolations * administrativeModel.avgProcessingTimePerViolation;
    const currentAdminCost = currentAdminTime * hourlyRate;
    const savedTime = currentAdminTime * administrativeModel.timeReductionWithSpeedSense;
    const savedCost = savedTime * hourlyRate;
    return {
      currentMonthlyAdminHours: currentAdminTime,
      currentMonthlyAdminCost: currentAdminCost,
      savedMonthlyHours: savedTime,
      savedMonthlyCost: savedCost
    };
  }
};

const pricingModel = {
  packages: {
    basic: { pricePerVehicle: 75 },
    connect: { pricePerVehicle: 125 },
    premium: { pricePerVehicle: 200 }
  },
  getVolumeDiscount: (fleetSize) => {
    if (fleetSize >= 500) return 0.25;
    if (fleetSize >= 200) return 0.20;
    if (fleetSize >= 100) return 0.15;
    if (fleetSize >= 50) return 0.10;
    return 0;
  },
  calculateMonthlyPackageCost: (fleetSize, packageType) => {
    const basePrice = pricingModel.packages[packageType].pricePerVehicle;
    const discount = pricingModel.getVolumeDiscount(fleetSize);
    const discountedPrice = basePrice * (1 - discount);
    return fleetSize * discountedPrice;
  }
};

// --- Utility Functions ---
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

function animateCounter(element, start, end, duration, prefix = '', suffix = '') {
  if (!element) return;
  const range = end - start;
  const minTimer = 30;
  const steps = Math.ceil(duration / minTimer);
  let stepCount = 0;
  const step = () => {
    stepCount++;
    const progress = stepCount / steps;
    const value = Math.round(start + range * progress);
    element.textContent = prefix + value.toLocaleString() + suffix;
    if (stepCount < steps) {
      setTimeout(step, minTimer);
    } else {
      element.textContent = prefix + Math.round(end).toLocaleString() + suffix;
    }
  };
  step();
}

// --- Main Calculation Logic ---
function getInputs() {
  return {
    fleetSize: parseInt(document.getElementById('fleet-size').value, 10),
    monthlyViolations: parseFloat(document.getElementById('violations-per-vehicle').value),
    avgFine: parseInt(document.getElementById('avg-fine').value, 10),
    currentRecovery: parseInt(document.getElementById('recovery-rate').value, 10) / 100,
    adminCost: parseInt(document.getElementById('admin-cost').value, 10)
  };
}

function updateInputDisplays() {
  document.getElementById('fleet-size-value').textContent = document.getElementById('fleet-size').value;
  document.getElementById('violations-per-vehicle-value').textContent = document.getElementById('violations-per-vehicle').value;
  document.getElementById('avg-fine-value').textContent = document.getElementById('avg-fine').value;
  document.getElementById('recovery-rate-value').textContent = document.getElementById('recovery-rate').value + '%';
  document.getElementById('admin-cost-value').textContent = document.getElementById('admin-cost').value;
}

function calculateAndDisplay() {
  updateInputDisplays();
  const {
    fleetSize,
    monthlyViolations,
    avgFine,
    currentRecovery,
    adminCost
  } = getInputs();

  // Current Losses
  const current = violationModel.calculateCurrentLosses(fleetSize, monthlyViolations, avgFine, currentRecovery);
  const admin = administrativeModel.calculateAdminSavings(current.totalViolations, adminCost);
  const currentMonthlyLoss = current.uncoveredAmount + admin.currentMonthlyAdminCost;

  // SpeedSense Impact (always use 'connect' package)
  const ss = violationModel.calculateSpeedSenseImpact(fleetSize, monthlyViolations, avgFine);
  const ssAdmin = administrativeModel.calculateAdminSavings(ss.remainingViolations, adminCost);
  const ssPackageCost = pricingModel.calculateMonthlyPackageCost(fleetSize, 'connect');
  const ssTotalCost = ssPackageCost + ssAdmin.currentMonthlyAdminCost;
  const ssMonthlyProtection = ss.protectedAmount;
  const ssNetSavings = currentMonthlyLoss - ssTotalCost;

  // Annual ROI
  const annualSavings = ssNetSavings * 12;
  const annualCost = ssPackageCost * 12;
  const annualROI = annualCost > 0 ? ((annualSavings - annualCost) / annualCost) * 100 : 0;
  const paybackPeriod = ssNetSavings > 0 ? (ssPackageCost / ssNetSavings) : 0;

  // Per vehicle cost
  const perVehicleCost = fleetSize > 0 ? Math.round(ssPackageCost / fleetSize) : 0;

  // Format numbers
  function addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function formatK(num) {
    if (num >= 1000000) {
      return 'AED ' + (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    } else if (num >= 1000) {
      return 'AED ' + (num / 1000).toFixed(0) + 'k';
    }
    return 'AED ' + addCommas(Math.round(num));
  }
  function formatM(num) {
    if (num >= 1000000) {
      return 'AED ' + (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    }
    return 'AED ' + addCommas(Math.round(num));
  }
  function formatAED(num) {
    return 'AED ' + addCommas(Math.round(num));
  }
  function formatPercent(num) {
    return Math.round(num) + '%';
  }

  // Update new horizontal cards with improved formatting and typography
  var netSavingsElem = document.getElementById('net-savings');
  var currentLossesElem = document.getElementById('current-losses');
  var annualSavingsElem = document.getElementById('annual-savings');
  var annualRoiElem = document.getElementById('annual-roi');
  var paybackElem = document.getElementById('payback-period');
  var packageCostElem = document.getElementById('package-cost');
  var perVehicleElem = document.getElementById('per-vehicle-cost');
  
  // Debug: Check if all elements are found
  if (!paybackElem) {
    console.error('Payback period element not found!');
    return;
  }

  // Monthly Net Savings: k notation
  netSavingsElem.textContent = formatK(ssNetSavings);
  netSavingsElem.style.fontWeight = '700';
  netSavingsElem.style.fontSize = '32px';
  netSavingsElem.style.letterSpacing = '0.5px';
  netSavingsElem.style.lineHeight = '1.2';
  netSavingsElem.style.color = '#1db954';
  netSavingsElem.style.textAlign = 'right';

  // Current Losses: comma separated
  currentLossesElem.textContent = formatAED(currentMonthlyLoss);
  currentLossesElem.style.fontWeight = '600';
  currentLossesElem.style.letterSpacing = '0.5px';
  currentLossesElem.style.color = '#1db954';
  currentLossesElem.style.textAlign = 'right';

  // Annual Return: M notation
  annualSavingsElem.textContent = formatM(annualSavings);
  annualSavingsElem.style.fontWeight = '700';
  annualSavingsElem.style.fontSize = '32px';
  annualSavingsElem.style.letterSpacing = '0.5px';
  annualSavingsElem.style.lineHeight = '1.2';
  annualSavingsElem.style.color = 'var(--primary-blue)';
  annualSavingsElem.style.textAlign = 'right';

  // ROI and Payback
  annualRoiElem.textContent = formatPercent(annualROI);
  paybackElem.textContent = paybackPeriod > 0 ? paybackPeriod.toFixed(1) : '0';
  
  // Debug: Log payback period updates
  console.log('Payback period updated:', paybackPeriod, 'Element:', paybackElem);

  // Monthly Investment: comma separated
  packageCostElem.textContent = formatAED(ssPackageCost);
  packageCostElem.style.fontWeight = '700';
  packageCostElem.style.fontSize = '32px';
  packageCostElem.style.letterSpacing = '0.5px';
  packageCostElem.style.lineHeight = '1.2';
  packageCostElem.style.color = '#444';
  packageCostElem.style.textAlign = 'right';

  // Per vehicle: comma separated
  perVehicleElem.textContent = formatAED(perVehicleCost);
  perVehicleElem.style.fontWeight = '600';
  perVehicleElem.style.letterSpacing = '0.5px';
  perVehicleElem.style.color = '#444';
  perVehicleElem.style.textAlign = 'right';

  // Progress bar (protection level)
  const currentProtection = currentRecovery * 100;
  const speedsenseProtection = 90;
  const bar = document.getElementById('protection-bar');
  bar.style.width = speedsenseProtection + '%';

  // Summary section
  document.getElementById('violations-prevented').textContent = Math.round(ss.violationsPrevented);
}

const debouncedCalculate = debounce(calculateAndDisplay, 300);

// --- Event Listeners ---
function setupEventListeners() {
  [
    'fleet-size',
    'violations-per-vehicle',
    'avg-fine',
    'recovery-rate',
    'admin-cost'
  ].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', debouncedCalculate);
    } else {
      console.error(`Element with id '${id}' not found`);
    }
  });

  // CTA buttons - only add listeners if elements exist
  const bookDemoBtn = document.getElementById('book-demo-btn');
  if (bookDemoBtn) {
    bookDemoBtn.addEventListener('click', function() {
      const fleetSize = document.getElementById('fleet-size').value;
      window.location.href = `contact.html?fleetSize=${fleetSize}`;
    });
  }
  
  const downloadGuideBtn = document.getElementById('download-guide-btn');
  if (downloadGuideBtn) {
    downloadGuideBtn.addEventListener('click', function() {
      window.open('https://ivmsgroup.com/implementation-guide.pdf', '_blank');
    });
  }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function() {
  updateInputDisplays();
  setupEventListeners();
  calculateAndDisplay();
}); 