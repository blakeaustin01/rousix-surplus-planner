const machineTiers = {
  basic: {
    name: "Rousix Basic Tablet",
    shortName: "Basic Tablet",
    price: 1250,
    capacity: "Entry mobile access",
    bestFor: "students, first-time participants, and price-conscious households"
  },
  standard: {
    name: "Rousix Standard",
    shortName: "Standard",
    price: 4100,
    capacity: "1× baseline capacity",
    bestFor: "everyday households and simple ownership goals"
  },
  standardPlus: {
    name: "Rousix Standard Plus",
    shortName: "Standard Plus",
    price: 8250,
    capacity: "2× enhanced capacity",
    bestFor: "larger goals, stronger monthly participation, and faster planning conversations"
  },
  premium: {
    name: "Rousix Premium",
    shortName: "Premium",
    price: 12450,
    capacity: "3× high-performance capacity",
    bestFor: "serious operators and higher-value ownership goals"
  },
  titan: {
    name: "Rousix Titan",
    shortName: "Titan",
    price: 75000,
    capacity: "Enterprise workstation",
    bestFor: "boutique firms and institutional-grade planning conversations"
  },
  colossus: {
    name: "Rousix Colossus",
    shortName: "Colossus",
    price: 150000,
    capacity: "Cluster array system",
    bestFor: "scaled operators, syndicates, and enterprise collectives"
  },
  olympus: {
    name: "Rousix Olympus",
    shortName: "Olympus",
    price: 300000,
    capacity: "Data center in a box",
    bestFor: "large-scale institutional infrastructure conversations"
  }
};

const samples = {
  vehicle: {
    goalType: "Vehicle",
    assetName: "Family vehicle",
    targetPrice: 42000,
    startingContribution: 4100,
    monthlyContribution: 350,
    timelineMonths: 24,
    pace: "balanced",
    machineTier: "standard"
  },
  home: {
    goalType: "Home",
    assetName: "Starter home",
    targetPrice: 240000,
    startingContribution: 25000,
    monthlyContribution: 900,
    timelineMonths: 24,
    pace: "balanced",
    machineTier: "premium"
  },
  equipment: {
    goalType: "Business equipment",
    assetName: "Commercial equipment package",
    targetPrice: 85000,
    startingContribution: 8250,
    monthlyContribution: 750,
    timelineMonths: 24,
    pace: "balanced",
    machineTier: "standardPlus"
  },
  business: {
    goalType: "Business asset",
    assetName: "Local business expansion",
    targetPrice: 150000,
    startingContribution: 12500,
    monthlyContribution: 1200,
    timelineMonths: 36,
    pace: "ambitious",
    machineTier: "premium"
  }
};

const $ = (id) => document.getElementById(id);

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function money(value) {
  const number = Number.isFinite(value) ? value : 0;
  return formatter.format(number);
}

function cleanNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return 0;
  }
  return number;
}

function percent(value) {
  const safe = Number.isFinite(value) ? value : 0;
  return `${Math.round(safe * 100)}%`;
}

function getInputs() {
  const machineTierKey = $("machineTier").value;

  return {
    goalType: $("goalType").value,
    assetName: $("assetName").value.trim() || "Ownership goal",
    targetPrice: cleanNumber($("targetPrice").value),
    startingContribution: cleanNumber($("startingContribution").value),
    monthlyContribution: cleanNumber($("monthlyContribution").value),
    timelineMonths: cleanNumber($("timelineMonths").value),
    pace: $("pace").value,
    includeMachineCost: $("includeMachineCost").checked,
    machineTierKey,
    machineTier: machineTiers[machineTierKey]
  };
}

function getPaceLabel(pace) {
  const labels = {
    conservative: "conservative",
    balanced: "balanced",
    ambitious: "ambitious"
  };

  return labels[pace] || "balanced";
}

function getSuggestedTier(targetPrice, monthlyContribution, timelineMonths) {
  const monthlyTotal = monthlyContribution * timelineMonths;

  if (targetPrice <= 15000 || monthlyContribution < 200) {
    return machineTiers.basic;
  }

  if (targetPrice <= 55000 || monthlyTotal < 12000) {
    return machineTiers.standard;
  }

  if (targetPrice <= 110000 || monthlyTotal < 24000) {
    return machineTiers.standardPlus;
  }

  if (targetPrice <= 300000 || monthlyTotal < 55000) {
    return machineTiers.premium;
  }

  if (targetPrice <= 650000) {
    return machineTiers.titan;
  }

  return machineTiers.colossus;
}

function getStatus(monthlyRatio, coverageRatio) {
  if (coverageRatio >= 1) {
    return {
      className: "",
      badge: "Directly funded",
      text:
        "Your direct planned contributions meet or exceed the target amount within this timeline. A representative conversation could focus on timing, documentation, and readiness rather than a major contribution gap."
    };
  }

  if (monthlyRatio >= 0.65) {
    return {
      className: "",
      badge: "Strong planning base",
      text:
        "Your monthly plan covers a meaningful portion of the target. The remaining gap is the main item to discuss during onboarding, especially if the goal is to use a surplus strategy rather than ordinary debt."
    };
  }

  if (monthlyRatio >= 0.35) {
    return {
      className: "is-stretch",
      badge: "Stretch pathway",
      text:
        "This plan has a visible gap, but it also creates a concrete starting point. The next step would be to discuss timeline, machine tier, contribution level, and whether the ownership target should be staged."
    };
  }

  return {
    className: "is-long-range",
    badge: "Long-range pathway",
    text:
      "This goal is currently far beyond the direct contribution plan. That does not make it impossible as a planning conversation, but it means the roadmap should be treated as long-range and representative-guided."
  };
}

function getRoadmap(inputs, totals) {
  const months = inputs.timelineMonths;
  const middleMonth = Math.max(4, Math.round(months / 2));
  const finalReview = months;

  return [
    {
      time: "Month 0",
      title: "Onboarding and goal confirmation",
      text:
        `Clarify the ${inputs.goalType.toLowerCase()} goal, confirm the target price, document the starting contribution, and choose the machine tier to discuss.`
    },
    {
      time: "Months 1–3",
      title: "Contribution foundation",
      text:
        `Build the habit around the planned ${money(inputs.monthlyContribution)} monthly contribution and compare the early progress against the ownership target.`
    },
    {
      time: `Months 4–${middleMonth}`,
      title: "Surplus planning checkpoint",
      text:
        `Review the remaining ${money(totals.gap)} planning gap and identify whether the timeline, tier, or contribution level should be adjusted.`
    },
    {
      time: `Months ${middleMonth + 1}–${Math.max(middleMonth + 1, finalReview - 2)}`,
      title: "Liquidity and strategy review",
      text:
        "Use this stage for representative-guided planning. This prototype does not estimate appreciation, mining output, or market performance."
    },
    {
      time: `Month ${finalReview}`,
      title: "Ownership readiness review",
      text:
        "Compare the final contribution base, remaining gap, documentation needs, and next steps before making any real-world purchase or participation decision."
    }
  ];
}

function buildNarrative(inputs, totals, suggestedTier, status) {
  const machineCostSentence = inputs.includeMachineCost
    ? `Including the selected ${inputs.machineTier.shortName} discussion tier, the starting commitment snapshot is ${money(totals.startingSnapshot)}.`
    : "The selected machine tier is shown for discussion only and is not included in the contribution math.";

  const gapSentence =
    totals.gap > 0
      ? `The direct contribution plan leaves a ${money(totals.gap)} planning gap. That gap is the educational purpose of the roadmap: it shows what would need to be addressed through savings, timeline changes, representative-guided surplus strategy, or a revised ownership target.`
      : "The direct contribution plan reaches the stated target within the selected timeline before any separate surplus strategy is considered.";

  return (
    `${inputs.assetName} is modeled as a ${getPaceLabel(inputs.pace)} ${inputs.timelineMonths}-month ownership pathway. ` +
    `The target price is ${money(inputs.targetPrice)}, with ${money(inputs.startingContribution)} available at the start and ${money(inputs.monthlyContribution)} planned each month. ` +
    `${machineCostSentence} ` +
    `${gapSentence} ` +
    `For discussion purposes, the planner suggests the ${suggestedTier.shortName} tier because it fits the scale of this goal and the current contribution pattern. ` +
    `Status: ${status.badge}. This is an educational planning snapshot, not a promise of liquidity, appreciation, profit, or final ownership.`
  );
}

function calculatePlan() {
  const inputs = getInputs();

  const totalMonthlyContribution =
    inputs.monthlyContribution * inputs.timelineMonths;

  const totalContribution =
    inputs.startingContribution + totalMonthlyContribution;

  const targetPrice = inputs.targetPrice;
  const coverageRatio = targetPrice > 0 ? totalContribution / targetPrice : 0;
  const gap = Math.max(targetPrice - totalContribution, 0);
  const requiredMonthly =
    inputs.timelineMonths > 0
      ? Math.max(targetPrice - inputs.startingContribution, 0) /
        inputs.timelineMonths
      : 0;

  const monthlyRatio = requiredMonthly > 0
    ? inputs.monthlyContribution / requiredMonthly
    : 1;

  const selectedMachineCost = inputs.includeMachineCost
    ? inputs.machineTier.price
    : 0;

  const startingSnapshot = inputs.startingContribution + selectedMachineCost;

  const totals = {
    totalMonthlyContribution,
    totalContribution,
    targetPrice,
    coverageRatio,
    gap,
    requiredMonthly,
    monthlyRatio,
    selectedMachineCost,
    startingSnapshot
  };

  const suggestedTier = getSuggestedTier(
    inputs.targetPrice,
    inputs.monthlyContribution,
    inputs.timelineMonths
  );

  const status = getStatus(monthlyRatio, coverageRatio);
  const roadmap = getRoadmap(inputs, totals);
  const narrative = buildNarrative(inputs, totals, suggestedTier, status);

  renderPlan(inputs, totals, suggestedTier, status, roadmap, narrative);
}

function renderPlan(inputs, totals, suggestedTier, status, roadmap, narrative) {
  const cappedCoverage = Math.max(0, Math.min(totals.coverageRatio, 1));

  $("resultTitle").textContent = `${inputs.assetName} pathway`;
  $("resultSubtitle").textContent =
    `A ${getPaceLabel(inputs.pace)} ${inputs.timelineMonths}-month educational planning snapshot.`;

  $("coveragePercent").textContent = percent(cappedCoverage);
  $("coverageBar").style.width = percent(cappedCoverage);

  $("coverageNote").textContent =
    `${money(totals.totalContribution)} in direct planned contributions toward a ${money(inputs.targetPrice)} target. This does not include projected returns.`;

  $("totalContribution").textContent = money(totals.totalContribution);
  $("planningGap").textContent = money(totals.gap);
  $("monthlyTarget").textContent = money(totals.requiredMonthly);
  $("suggestedTier").textContent = suggestedTier.shortName;
  $("tierReason").textContent =
    `${suggestedTier.capacity}; often discussed for ${suggestedTier.bestFor}.`;

  const statusPanel = $("statusPanel");
  statusPanel.className = `status-panel ${status.className}`;
  $("statusBadge").textContent = status.badge;
  $("statusText").textContent = status.text;

  $("roadmapSummary").textContent =
    `Contribution → Surplus → Liquidity → Appreciation → Ownership, shown as a ${inputs.timelineMonths}-month planning conversation.`;

  const timelineList = $("timelineList");
  timelineList.innerHTML = "";

  roadmap.forEach((item) => {
    const li = document.createElement("li");

    const time = document.createElement("time");
    time.textContent = item.time;

    const content = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = item.title;

    const text = document.createElement("p");
    text.textContent = item.text;

    content.appendChild(title);
    content.appendChild(text);

    li.appendChild(time);
    li.appendChild(content);

    timelineList.appendChild(li);
  });

  $("narrativeText").textContent = narrative;

  window.latestSummary = {
    inputs,
    totals,
    suggestedTier,
    status,
    narrative
  };
}

function applySample(sampleKey) {
  const sample = samples[sampleKey];

  if (!sample) {
    return;
  }

  $("goalType").value = sample.goalType;
  $("assetName").value = sample.assetName;
  $("targetPrice").value = sample.targetPrice;
  $("startingContribution").value = sample.startingContribution;
  $("monthlyContribution").value = sample.monthlyContribution;
  $("timelineMonths").value = sample.timelineMonths;
  $("pace").value = sample.pace;
  $("machineTier").value = sample.machineTier;

  calculatePlan();

  document.querySelectorAll(".sample-button").forEach((button) => {
    button.blur();
  });
}

function buildCopyText() {
  const summary = window.latestSummary;

  if (!summary) {
    return "Rousix Surplus Ownership Planner summary is not available yet.";
  }

  const { inputs, totals, suggestedTier, narrative } = summary;

  return [
    "Rousix Surplus Ownership Planner",
    "--------------------------------",
    `Goal: ${inputs.assetName}`,
    `Goal type: ${inputs.goalType}`,
    `Target price: ${money(inputs.targetPrice)}`,
    `Starting contribution: ${money(inputs.startingContribution)}`,
    `Monthly contribution: ${money(inputs.monthlyContribution)}`,
    `Timeline: ${inputs.timelineMonths} months`,
    `Total planned contribution: ${money(totals.totalContribution)}`,
    `Planning gap: ${money(totals.gap)}`,
    `Cash-only monthly target: ${money(totals.requiredMonthly)}`,
    `Selected machine tier: ${inputs.machineTier.name}`,
    `Suggested discussion tier: ${suggestedTier.name}`,
    "",
    "Plain-English explanation:",
    narrative,
    "",
    "Disclaimer: This is an educational prototype. It does not predict returns, liquidity, appreciation, mining output, profit, or ownership outcomes."
  ].join("\n");
}

async function copySummary() {
  const text = buildCopyText();

  try {
    await navigator.clipboard.writeText(text);
    showToast("Summary copied.");
  } catch (error) {
    showToast("Copy failed. Use print instead.");
  }
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(window.toastTimer);

  window.toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function bindEvents() {
  const inputIds = [
    "goalType",
    "assetName",
    "targetPrice",
    "startingContribution",
    "monthlyContribution",
    "timelineMonths",
    "pace",
    "machineTier",
    "includeMachineCost"
  ];

  inputIds.forEach((id) => {
    const element = $(id);
    element.addEventListener("input", calculatePlan);
    element.addEventListener("change", calculatePlan);
  });

  document.querySelectorAll(".sample-button").forEach((button) => {
    button.addEventListener("click", () => {
      applySample(button.dataset.sample);
    });
  });

  $("copySummary").addEventListener("click", copySummary);

  $("printPlan").addEventListener("click", () => {
    window.print();
  });
}

function init() {
  $("year").textContent = new Date().getFullYear();
  bindEvents();
  calculatePlan();
}

document.addEventListener("DOMContentLoaded", init);
