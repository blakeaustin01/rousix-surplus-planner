const machineTiers = {
  basic: {
    name: "Rousix Basic Tablet",
    shortName: "Basic Tablet",
    price: 1250,
    capacity: "entry mobile access",
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
    capacity: "enterprise workstation capacity",
    bestFor: "boutique firms and institutional-grade planning conversations"
  },
  colossus: {
    name: "Rousix Colossus",
    shortName: "Colossus",
    price: 150000,
    capacity: "cluster array system capacity",
    bestFor: "scaled operators, syndicates, and enterprise collectives"
  },
  olympus: {
    name: "Rousix Olympus",
    shortName: "Olympus",
    price: 300000,
    capacity: "data-center-in-a-box capacity",
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

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function money(value) {
  const number = Number.isFinite(value) ? value : 0;
  return currency.format(number);
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

function paceLabel(pace) {
  const labels = {
    conservative: "conservative",
    balanced: "balanced",
    ambitious: "ambitious"
  };

  return labels[pace] || "balanced";
}

function chooseSuggestedTier(targetPrice, monthlyContribution, timelineMonths) {
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
        "Your direct planned contributions meet or exceed the target amount within this timeline. A real onboarding conversation could focus on timing, documentation, and readiness rather than a major contribution gap."
    };
  }

  if (monthlyRatio >= 0.65) {
    return {
      className: "",
      badge: "Strong planning base",
      text:
        "Your monthly plan covers a meaningful portion of the target. The remaining gap is the central issue for the planning conversation."
    };
  }

  if (monthlyRatio >= 0.35) {
    return {
      className: "is-stretch",
      badge: "Stretch pathway",
      text:
        "This plan has a visible gap, but it creates a concrete starting point. The next step is to compare timeline, contribution level, tier, and whether the ownership target should be staged."
    };
  }

  return {
    className: "is-long-range",
    badge: "Long-range pathway",
    text:
      "This goal is far beyond the direct contribution plan as entered. The roadmap should be treated as long-range and representative-guided, not as a near-term ownership estimate."
  };
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
      ? Math.max(targetPrice - inputs.startingContribution, 0) / inputs.timelineMonths
      : 0;

  const monthlyRatio =
    requiredMonthly > 0 ? inputs.monthlyContribution / requiredMonthly : 1;

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

  const suggestedTier = chooseSuggestedTier(
    inputs.targetPrice,
    inputs.monthlyContribution,
    inputs.timelineMonths
  );

  const status = getStatus(monthlyRatio, coverageRatio);
  const narrative = buildNarrative(inputs, totals, suggestedTier, status);
  const roadmap = buildRoadmap(inputs, totals, suggestedTier, status);

  renderPlan(inputs, totals, suggestedTier, status, narrative, roadmap);
}

function buildNarrative(inputs, totals, suggestedTier, status) {
  const machineSentence = inputs.includeMachineCost
    ? `Including the selected ${inputs.machineTier.shortName} discussion tier, the starting snapshot is ${money(totals.startingSnapshot)}.`
    : "The selected machine tier is shown for discussion only and is not included in the contribution math.";

  const gapSentence =
    totals.gap > 0
      ? `The direct contribution plan leaves a ${money(totals.gap)} planning gap. That gap is the main issue the roadmap is designed to make visible.`
      : "The direct contribution plan reaches the stated target within the selected timeline before any separate surplus strategy is considered.";

  return (
    `${inputs.assetName} is modeled as a ${paceLabel(inputs.pace)} ${inputs.timelineMonths}-month ownership pathway. ` +
    `The target price is ${money(inputs.targetPrice)}, with ${money(inputs.startingContribution)} available at the start and ${money(inputs.monthlyContribution)} planned each month. ` +
    `${machineSentence} ` +
    `${gapSentence} ` +
    `The planner suggests discussing the ${suggestedTier.shortName} tier because it fits the scale of the goal and the current contribution pattern. ` +
    `Status: ${status.badge}. This is an educational planning snapshot, not a promise of liquidity, appreciation, profit, financing, or final ownership.`
  );
}

function getRoadmapRanges(months) {
  const earlyEnd = Math.min(3, months);
  const middleStart = Math.min(4, months);
  const middleEnd = Math.max(middleStart, Math.round(months * 0.5));
  const reviewStart = Math.min(middleEnd + 1, months);
  const reviewEnd = Math.max(reviewStart, months - 2);
  const finalMonth = months;

  return {
    early: `Months 1–${earlyEnd}`,
    middle: middleStart === middleEnd ? `Month ${middleStart}` : `Months ${middleStart}–${middleEnd}`,
    review: reviewStart === reviewEnd ? `Month ${reviewStart}` : `Months ${reviewStart}–${reviewEnd}`,
    final: `Month ${finalMonth}`
  };
}

function buildRoadmap(inputs, totals, suggestedTier, status) {
  const ranges = getRoadmapRanges(inputs.timelineMonths);
  const gapText = money(totals.gap);
  const contributionText = money(totals.totalContribution);
  const requiredMonthlyText = money(totals.requiredMonthly);
  const currentMonthlyText = money(inputs.monthlyContribution);

  return [
    {
      time: "Month 0",
      title: "Onboarding and goal confirmation",
      summary:
        `Define the ${inputs.goalType.toLowerCase()} goal, target price, starting contribution, and selected discussion tier.`,
      means:
        `This stage turns a vague ownership goal into a specific planning target. Instead of saying “I want to own something,” the visitor names the asset, enters an estimated price, and identifies the starting contribution available now.`,
      review:
        `Review whether ${money(inputs.targetPrice)} is a realistic target price for ${inputs.assetName}, whether ${money(inputs.startingContribution)} is actually available, and whether the selected ${inputs.machineTier.shortName} tier is the right starting point to discuss.`,
      discuss:
        `Rousix could discuss goal definition, onboarding steps, machine tier selection, documentation needs, and whether the goal should be treated as immediate, staged, or long-range.`,
      notPromise:
        `This stage does not approve the visitor, guarantee ownership, create financing, or promise that the selected machine tier will produce any particular outcome.`
    },
    {
      time: ranges.early,
      title: "Contribution foundation",
      summary:
        `Test whether the planned ${currentMonthlyText} monthly contribution is realistic before building the rest of the roadmap around it.`,
      means:
        `This stage is about consistency. The planner assumes the visitor contributes ${currentMonthlyText} per month, but the real question is whether that amount can be maintained without making the plan artificial.`,
      review:
        `Review income timing, household obligations, business cash flow, emergency reserves, and whether the monthly contribution should be lowered, raised, or made more flexible.`,
      discuss:
        `Rousix could discuss whether the selected pace is conservative, balanced, or ambitious, and whether the plan should begin with a smaller goal or a longer timeline.`,
      notPromise:
        `This stage does not mean that contributions create profit, appreciation, liquidity, or ownership automatically. It only tests whether the contribution base is credible.`
    },
    {
      time: ranges.middle,
      title: "Surplus planning checkpoint",
      summary:
        `Compare the direct contribution path with the ownership target and identify the remaining ${gapText} planning gap.`,
      means:
        `This is the stage you were asking about. It is not just a vague instruction to “review the gap.” It means the app compares the target price with the direct contribution plan. In this case, the plan produces ${contributionText} in direct contributions, leaving a ${gapText} gap.`,
      review:
        `Review the three main adjustment levers: increase the monthly contribution above ${currentMonthlyText}, extend the timeline, or revise the ownership target. For a cash-only path, the monthly target would be about ${requiredMonthlyText}.`,
      discuss:
        `Rousix could discuss whether the gap should be handled through staged ownership, a different machine tier, a different timeline, or a representative-guided surplus strategy. This is where the roadmap becomes a planning conversation rather than a simple calculator.`,
      notPromise:
        `This checkpoint does not predict that the gap will be filled by mining, staking, appreciation, liquidity, or market performance. It only makes the gap visible so it can be discussed honestly.`
    },
    {
      time: ranges.review,
      title: "Liquidity and strategy review",
      summary:
        `Use the roadmap as a structured review point rather than as a promise that liquidity will exist by this date.`,
      means:
        `This stage marks the point where the original plan should be compared with actual progress. The visitor should ask whether the contribution base, machine tier, and timeline still match the ownership goal.`,
      review:
        `Review actual contributions made, remaining gap, documentation status, risk tolerance, and whether the goal still makes sense at the same size and timeline.`,
      discuss:
        `Rousix could discuss available program options, operational realities, participation structure, and whether the visitor should revise the pathway before moving further.`,
      notPromise:
        `This stage does not mean liquidity has been created, that assets have appreciated, or that the visitor is ready to buy the target asset. It is a review stage, not an outcome guarantee.`
    },
    {
      time: ranges.final,
      title: "Ownership readiness review",
      summary:
        `Compare the original goal with the final contribution base, remaining gap, and next steps.`,
      means:
        `This is the final checkpoint in the selected timeline. It asks whether the visitor is closer to ownership, whether the target should be revised, and whether the next step is purchase readiness, more planning, or a reset.`,
      review:
        `Review the original ${money(inputs.targetPrice)} target, the planned ${contributionText} contribution base, the remaining ${gapText} gap, and whether the plan has become stronger or needs to be redesigned.`,
      discuss:
        `Rousix could discuss whether the visitor is ready for a real-world next step, whether the plan needs professional review, and whether the pathway should continue into another planning cycle.`,
      notPromise:
        `This stage does not mean the visitor now owns the asset. It does not promise approval, financing, profit, liquidity, or final acquisition. It simply organizes the readiness conversation.`
    }
  ];
}

function renderPlan(inputs, totals, suggestedTier, status, narrative, roadmap) {
  const cappedCoverage = Math.max(0, Math.min(totals.coverageRatio, 1));

  $("resultTitle").textContent = `${inputs.assetName} pathway`;
  $("resultSubtitle").textContent =
    `A ${paceLabel(inputs.pace)} ${inputs.timelineMonths}-month educational planning snapshot.`;

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

  $("narrativeText").textContent = narrative;

  renderRoadmap(roadmap);

  window.latestSummary = {
    inputs,
    totals,
    suggestedTier,
    status,
    narrative,
    roadmap
  };
}

function renderRoadmap(roadmap) {
  const list = $("roadmapList");
  list.innerHTML = "";

  roadmap.forEach((item, index) => {
    const wrapper = document.createElement("article");
    wrapper.className = `roadmap-item ${index === 0 ? "open" : ""}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "roadmap-button";
    button.setAttribute("aria-expanded", index === 0 ? "true" : "false");

    const time = document.createElement("span");
    time.className = "roadmap-time";
    time.textContent = item.time;

    const titleWrap = document.createElement("span");
    titleWrap.className = "roadmap-title";

    const title = document.createElement("strong");
    title.textContent = item.title;

    const summary = document.createElement("small");
    summary.textContent = item.summary;

    titleWrap.appendChild(title);
    titleWrap.appendChild(summary);

    const chevron = document.createElement("span");
    chevron.className = "roadmap-chevron";
    chevron.textContent = "⌄";
    chevron.setAttribute("aria-hidden", "true");

    button.appendChild(time);
    button.appendChild(titleWrap);
    button.appendChild(chevron);

    const details = document.createElement("div");
    details.className = "roadmap-details";

    const detailGrid = document.createElement("div");
    detailGrid.className = "detail-grid";

    detailGrid.appendChild(makeDetailCard("What this stage means", item.means));
    detailGrid.appendChild(makeDetailCard("What the visitor should review", item.review));
    detailGrid.appendChild(makeDetailCard("What Rousix could discuss", item.discuss));
    detailGrid.appendChild(makeDetailCard("What this stage does not promise", item.notPromise, true));

    details.appendChild(detailGrid);

    button.addEventListener("click", () => {
      const isOpen = wrapper.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    wrapper.appendChild(button);
    wrapper.appendChild(details);
    list.appendChild(wrapper);
  });
}

function makeDetailCard(titleText, bodyText, warning = false) {
  const card = document.createElement("div");
  card.className = warning ? "detail-card warning" : "detail-card";

  const title = document.createElement("h4");
  title.textContent = titleText;

  const body = document.createElement("p");
  body.textContent = bodyText;

  card.appendChild(title);
  card.appendChild(body);

  return card;
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
}

function buildCopyText() {
  const summary = window.latestSummary;

  if (!summary) {
    return "Rousix Surplus Ownership Planner summary is not available yet.";
  }

  const { inputs, totals, suggestedTier, status, narrative, roadmap } = summary;

  const roadmapText = roadmap
    .map((item) => {
      return [
        `${item.time}: ${item.title}`,
        `Summary: ${item.summary}`,
        `Means: ${item.means}`,
        `Review: ${item.review}`,
        `Rousix could discuss: ${item.discuss}`,
        `Does not promise: ${item.notPromise}`
      ].join("\n");
    })
    .join("\n\n");

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
    `Status: ${status.badge}`,
    "",
    "Plain-English explanation:",
    narrative,
    "",
    "Guided roadmap:",
    roadmapText,
    "",
    "Disclaimer: This is an educational prototype. It does not predict returns, liquidity, appreciation, mining output, profit, financing approval, or ownership outcomes."
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
