/* =========================================================================
   RegoCheck — Vehicle Registration Number Validator
   Rules:
   1. Registration number must not be empty.
   2. Length must be exactly 10 characters.
   3. First 2 characters must be uppercase letters   (State code).
   4. Next  2 characters must be digits               (District code).
   5. Next  2 characters must be uppercase letters    (Series).
   6. Last  4 characters must be digits               (Vehicle number).
   Example of a valid plate: MH31AB1234
========================================================================= */

/* -------------------------------------------------------------------------
   1. Custom error classes — one per broken rule.
   Giving each rule its own Error subclass means a catch block can tell
   the failures apart with `instanceof` instead of parsing strings.
------------------------------------------------------------------------- */
class EmptyInputError extends Error {
  constructor() {
    super("Registration number cannot be empty.");
    this.name = "EmptyInputError";
  }
}

class InvalidLengthError extends Error {
  constructor(actualLength) {
    super(`Expected exactly 10 characters, got ${actualLength}.`);
    this.name = "InvalidLengthError";
  }
}

class InvalidStateCodeError extends Error {
  constructor(segment) {
    super(`"${segment}" is not a valid state code — expected 2 uppercase letters.`);
    this.name = "InvalidStateCodeError";
  }
}

class InvalidDistrictCodeError extends Error {
  constructor(segment) {
    super(`"${segment}" is not a valid district code — expected 2 digits.`);
    this.name = "InvalidDistrictCodeError";
  }
}

class InvalidSeriesError extends Error {
  constructor(segment) {
    super(`"${segment}" is not a valid series — expected 2 uppercase letters.`);
    this.name = "InvalidSeriesError";
  }
}

class InvalidVehicleNumberError extends Error {
  constructor(segment) {
    super(`"${segment}" is not a valid vehicle number — expected 4 digits.`);
    this.name = "InvalidVehicleNumberError";
  }
}

/* -------------------------------------------------------------------------
   2. Individual rule checks.
   Each function inspects one rule and THROWS the matching custom error
   when that rule is broken. They throw nothing when the rule passes.
------------------------------------------------------------------------- */
const ruleDefinitions = [
  {
    key: "notEmpty",
    label: "Not empty",
    check(raw) {
      if (raw === null || raw === undefined || raw.trim() === "") {
        throw new EmptyInputError();
      }
    },
  },
  {
    key: "length",
    label: "Exactly 10 characters",
    check(raw, value) {
      if (value.length !== 10) {
        throw new InvalidLengthError(value.length);
      }
    },
  },
  {
    key: "state",
    label: "State code — 2 uppercase letters",
    check(raw, value) {
      const segment = value.slice(0, 2);
      if (!/^[A-Z]{2}$/.test(segment)) {
        throw new InvalidStateCodeError(segment);
      }
    },
  },
  {
    key: "district",
    label: "District code — 2 digits",
    check(raw, value) {
      const segment = value.slice(2, 4);
      if (!/^[0-9]{2}$/.test(segment)) {
        throw new InvalidDistrictCodeError(segment);
      }
    },
  },
  {
    key: "series",
    label: "Series — 2 uppercase letters",
    check(raw, value) {
      const segment = value.slice(4, 6);
      if (!/^[A-Z]{2}$/.test(segment)) {
        throw new InvalidSeriesError(segment);
      }
    },
  },
  {
    key: "number",
    label: "Vehicle number — 4 digits",
    check(raw, value) {
      const segment = value.slice(6, 10);
      if (!/^[0-9]{4}$/.test(segment)) {
        throw new InvalidVehicleNumberError(segment);
      }
    },
  },
];

/* -------------------------------------------------------------------------
   3. The authoritative validator.
   Runs every rule in order inside ONE try block. The first rule that
   throws stops the function — that thrown error IS the reason the plate
   is invalid. If nothing throws, the plate is valid.
------------------------------------------------------------------------- */
function validateRegistrationNumber(rawInput) {
  try {
    const value = rawInput.trim().toUpperCase();

    for (const rule of ruleDefinitions) {
      rule.check(rawInput, value);
    }

    return {
      formatted: value,
      state: value.slice(0, 2),
      district: value.slice(2, 4),
      series: value.slice(4, 6),
      number: value.slice(6, 10),
    };
  } catch (err) {
    // Re-throw so the caller's own try/catch decides how to present it —
    // this inner catch exists so we can label / log before it travels up.
    console.warn(`[RegoCheck] validation failed: ${err.name} — ${err.message}`);
    throw err;
  }
}

/* -------------------------------------------------------------------------
   4. Checklist evaluation.
   Each rule gets its OWN try/catch so a single bad segment doesn't stop
   the others from being reported — this is what powers the checklist UI.
------------------------------------------------------------------------- */
function evaluateAllRules(rawInput) {
  const value = (rawInput ?? "").trim().toUpperCase();

  return ruleDefinitions.map((rule) => {
    try {
      rule.check(rawInput, value);
      return { key: rule.key, label: rule.label, passed: true, message: "Looks good." };
    } catch (err) {
      return { key: rule.key, label: rule.label, passed: false, message: err.message, errorName: err.name };
    }
  });
}

/* =========================================================================
   5. DOM wiring
========================================================================= */
const input        = document.getElementById("regInput");
const checkBtn      = document.getElementById("checkBtn");
const clearBtn       = document.getElementById("clearBtn");
const resultBanner  = document.getElementById("resultBanner");
const resultIcon    = document.getElementById("resultIcon");
const resultTitle   = document.getElementById("resultTitle");
const resultDesc    = document.getElementById("resultDesc");
const checklistEl   = document.getElementById("checklist");

const chips = {
  state:    document.getElementById("chipState"),
  district: document.getElementById("chipDistrict"),
  series:   document.getElementById("chipSeries"),
  number:   document.getElementById("chipNumber"),
};
const badges = {
  state:    document.getElementById("badgeState"),
  district: document.getElementById("badgeDistrict"),
  series:   document.getElementById("badgeSeries"),
  number:   document.getElementById("badgeNumber"),
};

function setBanner(mode, title, desc) {
  resultBanner.className = `result-banner result-banner--${mode}`;
  resultTitle.textContent = title;
  resultDesc.textContent = desc;
  resultIcon.textContent = mode === "valid" ? "✓" : mode === "invalid" ? "✕" : "?";
}

function renderChecklist(results) {
  checklistEl.innerHTML = "";
  results.forEach((r) => {
    const li = document.createElement("li");
    li.className = `checklist__item ${r.passed ? "pass" : "fail"}`;
    li.innerHTML = `
      <span class="checklist__mark">${r.passed ? "✓" : "✕"}</span>
      <span class="checklist__label">${r.label}</span>
      <span class="checklist__msg">— ${r.message}</span>
    `;
    checklistEl.appendChild(li);
  });
}

// Reflects the live segments into the hero "plate preview" chips and the
// floating rule badges, using the same per-rule results as the checklist.
function updateHeroPreview(rawInput, ruleResults) {
  const value = (rawInput ?? "").trim().toUpperCase();
  const lengthOk = ruleResults.find((r) => r.key === "length").passed;

  const segmentMap = {
    state:    value.slice(0, 2)  || "MH",
    district: value.slice(2, 4)  || "31",
    series:   value.slice(4, 6)  || "AB",
    number:   value.slice(6, 10) || "1234",
  };

  ["state", "district", "series", "number"].forEach((key) => {
    const chip = chips[key];
    const badge = badges[key];
    const segmentResult = ruleResults.find((r) => r.key === key);

    chip.textContent = value ? segmentMap[key] : chip.textContent;
    chip.classList.remove("is-good", "is-bad");
    badge.classList.remove("is-good", "is-bad");

    if (!value || !lengthOk) return; // not enough characters to judge a segment yet

    if (segmentResult.passed) {
      chip.classList.add("is-good");
      badge.classList.add("is-good");
    } else {
      chip.classList.add("is-bad");
      badge.classList.add("is-bad");
    }
  });
}

/* -------------------------------------------------------------------------
   6. Main "Check plate" action — the try/catch that drives the page.
------------------------------------------------------------------------- */
function handleCheck() {
  const raw = input.value;

  try {
    const result = validateRegistrationNumber(raw);

    setBanner(
      "valid",
      "Valid plate",
      `${result.formatted} follows the format: ${result.state} · ${result.district} · ${result.series} · ${result.number}.`
    );

  } catch (err) {
    if (err instanceof EmptyInputError) {
      setBanner("invalid", "Nothing to check", err.message);
    } else if (err instanceof InvalidLengthError) {
      setBanner("invalid", "Wrong length", err.message);
    } else if (err instanceof InvalidStateCodeError) {
      setBanner("invalid", "Bad state code", err.message);
    } else if (err instanceof InvalidDistrictCodeError) {
      setBanner("invalid", "Bad district code", err.message);
    } else if (err instanceof InvalidSeriesError) {
      setBanner("invalid", "Bad series", err.message);
    } else if (err instanceof InvalidVehicleNumberError) {
      setBanner("invalid", "Bad vehicle number", err.message);
    } else {
      // Anything unexpected (not one of our custom errors) still gets caught
      // here instead of crashing the page.
      console.error("[RegoCheck] unexpected error:", err);
      setBanner("invalid", "Couldn't check that", "Something unexpected went wrong while reading this plate.");
    }

  } finally {
    // Runs whether the plate was valid or not — keeps the checklist and
    // hero preview in sync with whatever was just typed.
    const ruleResults = evaluateAllRules(raw);
    renderChecklist(ruleResults);
    updateHeroPreview(raw, ruleResults);
  }
}

function handleClear() {
  input.value = "";
  setBanner("idle", "Waiting for a plate", "Type a registration number above and press Check plate.");
  checklistEl.innerHTML = "";
  const ruleResults = evaluateAllRules("");
  updateHeroPreview("", ruleResults);
  input.focus();
}

// Live preview while typing — reuses the exact same rule engine.
input.addEventListener("input", () => {
  const ruleResults = evaluateAllRules(input.value);
  updateHeroPreview(input.value, ruleResults);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleCheck();
});

checkBtn.addEventListener("click", handleCheck);
clearBtn.addEventListener("click", handleClear);

/* -------------------------------------------------------------------------
   7. Initial paint.
------------------------------------------------------------------------- */
(function init() {
  const ruleResults = evaluateAllRules("");
  renderChecklist(ruleResults.map((r) => ({ ...r, message: "Type a plate to check this rule." })));
})();