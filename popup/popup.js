/**
 * Popup script for Tracking Protection Toggle.
 * Two states: enabled ("always") and disabled ("never").
 */

const toggleSection = document.getElementById("toggle-section");
const statusLabel   = document.getElementById("status-label");
const toggleBtn     = document.getElementById("toggle-btn");
const hintText      = document.getElementById("hint-text");
const warningEl     = document.getElementById("warning");
const infoEl        = document.getElementById("info");

let busy = false; // prevent rapid double-clicks

/** Reliably show an element. */
function show(el) {
  el.hidden = false;
  el.style.display = '';
}

/** Reliably hide an element. */
function hide(el) {
  el.hidden = true;
  el.style.display = 'none';
}

/**
 * Apply visual state.
 * @param {boolean} enabled
 */
function applyState(enabled) {
  toggleSection.classList.remove("is-enabled", "is-disabled", "loading");

  if (enabled) {
    toggleSection.classList.add("is-enabled");
    statusLabel.textContent = "Protected";
    toggleBtn.setAttribute("aria-pressed", "true");
    hintText.textContent =
      "Firefox's Enhanced Tracking Protection (ETP) is enabled.";
    hide(warningEl);
    show(infoEl);
  } else {
    toggleSection.classList.add("is-disabled");
    statusLabel.textContent = "Unprotected";
    toggleBtn.setAttribute("aria-pressed", "false");
    hintText.textContent =
      "ETP is disabled — embedded videos and some sites may work again.";
    show(warningEl);
    hide(infoEl);
  }
}

/** Show the loading/checking state. */
function applyLoading() {
  toggleSection.classList.remove("is-enabled", "is-disabled");
  toggleSection.classList.add("loading");
  statusLabel.textContent = "Checking";
  hintText.textContent = "Reading Firefox privacy settings…";
  hide(warningEl);
  hide(infoEl);
}

/** Pulse the card briefly on state change. */
function pulseCard() {
  toggleSection.classList.add("animating");
  toggleSection.addEventListener(
    "animationend",
    () => toggleSection.classList.remove("animating"),
    { once: true }
  );
}

async function init() {
  applyLoading();
  try {
    const enabled = await browser.runtime.sendMessage({ type: "GET_STATE" });
    applyState(enabled);
  } catch (err) {
    statusLabel.textContent = "Error";
    hintText.textContent = "Could not read tracking protection state.";
    console.error("GET_STATE failed:", err);
  }
}

toggleBtn.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  try {
    const newEnabled = await browser.runtime.sendMessage({ type: "TOGGLE" });
    applyState(newEnabled);
    pulseCard();
  } catch (err) {
    hintText.textContent = "Failed to toggle — please try again.";
    console.error("TOGGLE failed:", err);
  } finally {
    busy = false;
  }
});

init();
