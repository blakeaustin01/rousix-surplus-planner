const machineTiers = {
  basic: {
    name: "Rousix Basic Tablet",
    shortName: "Basic Tablet",
    price: 1250,
    capacity: "entry mobile access",
    bestFor: "first-time planning conversations and lower starting amounts"
  },
  standard: {
    name: "Rousix Standard",
    shortName: "Standard",
    price: 4100,
    capacity: "baseline capacity",
    bestFor: "everyday household goals and simple starting plans"
  },
  standardPlus: {
    name: "Rousix Standard Plus",
    shortName: "Standard Plus",
    price: 8250,
    capacity: "enhanced capacity",
    bestFor: "larger goals and stronger monthly contribution plans"
  },
  premium: {
    name: "Rousix Premium",
    shortName: "Premium",
    price: 12450,
    capacity: "high-performance capacity",
    bestFor: "higher-value goals and more serious planning conversations"
  },
  titan: {
    name: "Rousix Titan",
    shortName: "Titan",
    price: 75000,
    capacity: "enterprise workstation capacity",
    bestFor: "businesses and larger-scale planning conversations"
  },
  colossus: {
    name: "Rousix Colossus",
    shortName: "Colossus",
    price: 150000,
    capacity: "cluster array capacity",
    bestFor: "scaled operators and institutional conversations"
  },
  olympus: {
    name: "Rousix Olympus",
    shortName: "Olympus",
    price: 300000,
    capacity: "large-scale infrastructure capacity",
    bestFor: "major infrastructure and institutional planning"
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
  const totalMonthlyPlan = monthlyContribution * timelineMonths;

  if (targetPrice <= 15000 || monthlyContribution < 200) {
    return machineTiers.basic;
  }

  if (targetPrice <= 55000 || totalMonthlyPlan < 12000) {
    return machineTiers.standard;
  }

  if (targetPrice <= 110000 || totalMonthlyPlan < 24000) {
    return machineTiers.standardPlus;
  }

  if (targetPrice <= 300000 || totalMonthlyPlan < 55000) {
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
      badge: "Fully covered by direct contributions",
      text:
        "Your planned direct contributions meet or exceed the target amount within the selected timeline. A real planning conversation could focus on timing, documentation, and readiness."
    };
  }

  if (monthlyRatio >= 0.65) {
    return {
      className: "",
      badge: "Strong planning base",
      text:
        "Your monthly contribution covers a meaningful share of the cash-only target. The next step is to review the remaining gap and decide whether the timeline or goal should be adjusted."
    };
  }

  if (monthlyRatio >= 0.35) {
    return {
      className: "is-stretch",
      badge: "Stretch pathway",
      text:
        "Your plan creates a real starting point, but the remaining gap is significant. It may help to compare a longer timeline, a higher monthly contribution, a smaller first goal, or a different tier."
    };
  }

  return {
    className: "is-long-range",
    badge: "Long-range pathway",
    text:
      "Your current contribution plan is far below the cash-only target. This roadmap should be treated as an early planning tool, not as a near-term ownership estimate."
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
  const roadmap = buildRoadmap(inputs, totals, suggestedTier);

  renderPlan(inputs, totals, suggestedTier, status, narrative, roadmap);
}

function buildNarrative(inputs, totals, suggestedTier, status) {
  const machineSentence = inputs.includeMachineCost
    ? `With the selected ${inputs.machineTier.shortName} tier included in the starting snapshot, your initial planning amount is ${money(totals.startingSnapshot)}.`
    : `The selected ${inputs.machineTier.shortName} tier is shown for discussion, but its cost is not included in the contribution math.`;

  const gapSentence =
    totals.gap > 0
      ? `After your planned direct contributions, the remaining planning gap is ${money(totals.gap)}.`
      : "Your direct contribution plan reaches the stated target within the selected timeline.";

  return (
    `Your ${inputs.assetName} plan uses a ${paceLabel(inputs.pace)} ${inputs.timelineMonths}-month timeline. ` +
    `The target price is ${money(inputs.targetPrice)}, with ${money(inputs.startingContribution)} available at the start and ${money(inputs.monthlyContribution)} planned each month. ` +
    `${machineSentence} ` +
    `${gapSentence} ` +
    `The suggested discussion tier is ${suggestedTier.shortName}, based on the size of the goal and the current contribution pattern. ` +
    `Status: ${status.badge}. This is an educational planning snapshot, not a promise of liquidity, appreciation, profit, financing, or ownership.`
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

function buildRoadmap(inputs, totals, suggestedTier) {
  const ranges = getRoadmapRanges(inputs.timelineMonths);

  const gapText = money(totals.gap);
  const contributionText = money(totals.totalContribution);
  const requiredMonthlyText = money(totals.requiredMonthly);
  const currentMonthlyText = money(inputs.monthlyContribution);
  const targetText = money(inputs.targetPrice);
  const startingText = money(inputs.startingContribution);

  return [
    {
      time: "Month 0",
      title: "Goal setup",
      summary:
        `Set the target for ${inputs.assetName} and define the starting point.`,
      happens:
        `You begin by naming the asset you want to plan around and entering an estimated target price. For this plan, the target is ${targetText} and the starting contribution is ${startingText}.`,
      review:
        `Check whether the target price is realistic, whether the starting contribution is actually available, and whether this goal should be treated as immediate, staged, or long-range.`,
      help:
        `Rousix may help clarify the planning goal, explain onboarding steps, review the selected ${inputs.machineTier.shortName} tier, and identify what information would be needed before any real next step.`,
      note:
        `This stage does not approve financing, guarantee ownership, or promise that any machine tier will produce a specific result. It only defines the starting point for the roadmap.`
    },
    {
      time: ranges.early,
      title: "Contribution rhythm",
      summary:
        `Begin with a monthly contribution rhythm of ${currentMonthlyText}.`,
      happens:
        `This phase focuses on whether your monthly contribution feels sustainable. Your plan currently uses ${currentMonthlyText} per month over a ${inputs.timelineMonths}-month timeline.`,
      review:
        `Review whether that monthly amount fits your real budget, income timing, business cash flow, household obligations, and emergency reserves. If it feels too high or too low, the plan can be adjusted.`,
      help:
        `Rousix may help compare a smaller starting goal, a longer timeline, a different tier, or a contribution amount that better fits your situation.`,
      note:
        `This phase does not create automatic profit, appreciation, liquidity, or ownership. It simply organizes a realistic contribution starting point.`
    },
    {
      time: ranges.middle,
      title: "Surplus gap review",
      summary:
        `See what remains after your direct planned contributions.`,
      happens:
        `This checkpoint shows the difference between your ownership target and your planned direct contributions. Your current plan produces ${contributionText} in direct contributions, leaving a remaining planning gap of ${gapText}.`,
      review:
        `Review the main adjustment choices: increase the monthly contribution, extend the timeline, choose a smaller first goal, or revisit the discussion tier. For a cash-only path, the monthly target would be about ${requiredMonthlyText}.`,
      help:
        `Rousix may help turn the gap into a structured planning conversation. That could include comparing timelines, contribution levels, staged goals, or whether the ${suggestedTier.shortName} tier is a better discussion fit.`,
      note:
        `This checkpoint does not predict that the gap will be filled by mining, staking, appreciation, liquidity, or market performance. It only makes the gap clear enough to discuss.`
    },
    {
      time: ranges.review,
      title: "Strategy review",
      summary:
        `Compare the original plan with the progress needed to keep moving.`,
      happens:
        `This stage is a review point. You look back at the original target, the contribution plan, the selected timeline, and the remaining gap to decide whether the roadmap still makes sense.`,
      review:
        `Review whether the contribution pace is working, whether the target asset still fits, whether documentation is ready, and whether the timeline should be revised before moving further.`,
      help:
        `Rousix may help discuss available program options, operational realities, participation structure, and whether the plan should continue, pause, or be redesigned.`,
      note:
        `This stage does not mean liquidity has been created or that the asset is ready to purchase. It is a review point for understanding progress and deciding what should happen next.`
    },
    {
      time: ranges.final,
      title: "Readiness check",
      summary:
        `Decide whether the next step is purchase planning, more time, or a revised goal.`,
      happens:
        `At the end of the selected timeline, you compare the original goal with the planned contribution base and the remaining gap. In this plan, the target is ${targetText}, planned direct contributions are ${contributionText}, and the remaining gap is ${gapText}.`,
      review:
        `Review whether the goal is closer, whether the plan needs more time, whether a smaller or staged ownership target makes more sense, and whether professional advice is needed before any real-world decision.`,
      help:
        `Rousix may help organize the next planning conversation, identify missing information, and decide whether the roadmap should move into another cycle.`,
      note:
        `This stage does not mean you now own the asset. It does not guarantee approval, financing, profit, liquidity, or acquisition. It is a readiness review.`
    }
  ];
}

function renderPlan(inputs, totals, suggestedTier, status, narrative, roadmap) {
  const cappedCoverage = Math.max(0, Math.min(totals.coverageRatio, 1));

  $("resultTitle").textContent = `${inputs.assetName} pathway`;
  $("resultSubtitle").textContent =
    `A ${paceLabel(inputs.pace)} ${inputs.timelineMonths}-month planning snapshot.`;

  $("coveragePercent").textContent = percent(cappedCoverage);
  $("coverageBar").style.width = percent(cappedCoverage);

  $("coverageNote").textContent =
    `${money(totals.totalContribution)} in planned direct contributions toward a ${money(inputs.targetPrice)} target. This does not include projected returns.`;

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

    detailGrid.appendChild(makeDetailCard("What happens here", item.happens));
    detailGrid.appendChild(makeDetailCard("What to review", item.review));
    detailGrid.appendChild(makeDetailCard("How Rousix may help", item.help));
    detailGrid.appendChild(makeDetailCard("Important note", item.note, true));

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
        `What happens here: ${item.happens}`,
        `What to review: ${item.review}`,
        `How Rousix may help: ${item.help}`,
        `Important note: ${item.note}`
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
    `Remaining planning gap: ${money(totals.gap)}`,
    `Cash-only monthly target: ${money(totals.requiredMonthly)}`,
    `Selected machine tier: ${inputs.machineTier.name}`,
    `Suggested discussion tier: ${suggestedTier.name}`,
    `Status: ${status.badge}`,
    "",
    "Plain-English summary:",
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
