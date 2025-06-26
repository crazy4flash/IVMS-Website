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

  // Animate Results
  animateCounter(document.getElementById('current-losses'), 0, Math.round(currentMonthlyLoss), 700, 'AED ');
  animateCounter(document.getElementById('speedsense-protection'), 0, Math.round(ssMonthlyProtection), 700, 'AED ');
  animateCounter(document.getElementById('net-savings'), 0, Math.round(ssNetSavings), 700, 'AED ');
  animateCounter(document.getElementById('annual-roi'), 0, Math.round(annualROI), 700, '', '%');

  // Breakdown Texts
  document.getElementById('current-losses-breakdown').innerHTML =
    `<b>Total Violations:</b> ${current.totalViolations.toLocaleString()}<br>` +
    `<b>Uncovered Amount:</b> AED ${current.uncoveredAmount.toLocaleString()}<br>` +
    `<b>Admin Costs:</b> AED ${admin.currentMonthlyAdminCost.toLocaleString()}`;

  document.getElementById('speedsense-protection-breakdown').innerHTML =
    `<b>Violations Prevented:</b> ${ss.violationsPrevented.toLocaleString()}<br>` +
    `<b>Protected Amount:</b> AED ${ss.protectedAmount.toLocaleString()}<br>` +
    `<b>Package Cost:</b> AED ${ssPackageCost.toLocaleString()}<br>` +
    `<b>Admin Time Saved:</b> AED ${admin.currentMonthlyAdminCost - ssAdmin.currentMonthlyAdminCost >= 0 ? (admin.currentMonthlyAdminCost - ssAdmin.currentMonthlyAdminCost).toLocaleString() : 0}`;

  document.getElementById('net-savings-breakdown').innerHTML =
    `<b>Current Losses:</b> AED ${currentMonthlyLoss.toLocaleString()}<br>` +
    `<b>SpeedSense Cost:</b> AED ${ssTotalCost.toLocaleString()}<br>` +
    `<b>Net Savings:</b> AED ${ssNetSavings.toLocaleString()}`;

  document.getElementById('annual-roi-breakdown').innerHTML =
    `<b>Annual Savings:</b> AED ${annualSavings.toLocaleString()}<br>` +
    `<b>Annual Cost:</b> AED ${annualCost.toLocaleString()}<br>` +
    `<b>Payback Period:</b> ${paybackPeriod > 0 ? paybackPeriod.toFixed(2) : 'N/A'} months`;
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
    document.getElementById(id).addEventListener('input', debouncedCalculate);
  });

  // CTA buttons
  document.getElementById('book-demo-btn').addEventListener('click', function() {
    const fleetSize = document.getElementById('fleet-size').value;
    window.location.href = `contact.html?fleetSize=${fleetSize}`;
  });
  document.getElementById('download-guide-btn').addEventListener('click', function() {
    window.open('https://ivmsgroup.com/implementation-guide.pdf', '_blank');
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function() {
  updateInputDisplays();
  setupEventListeners();
  calculateAndDisplay();
}); 