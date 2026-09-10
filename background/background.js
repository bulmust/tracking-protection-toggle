/**
 * Background script for Tracking Protection Toggle.
 * Manages reading/writing the trackingProtectionMode privacy setting
 * and keeps the browser action badge in sync.
 *
 * Two states:
 *   "always" → Enabled  (ETP on for all browsing)
 *   "never"  → Disabled (ETP fully off)
 *
 * Badge behaviour:
 *   Enabled  → no badge (clean icon — no clutter when things are fine)
 *   Disabled → "OFF" badge in red (visible warning on the toolbar)
 */

const DISABLED_COLOR = "#e05252"; // red

/** Read the raw tracking protection mode from Firefox. */
async function getMode() {
  const setting = await browser.privacy.websites.trackingProtectionMode.get({});
  return setting.value; // "always" | "private_browsing" | "never"
}

/** Returns true when ETP is fully enabled. */
async function isEnabled() {
  return (await getMode()) === "always";
}

/** Update the toolbar badge and tooltip title. */
async function updateBadge() {
  const enabled = await isEnabled();

  if (enabled) {
    // No badge when enabled — clean icon is enough
    await browser.browserAction.setBadgeText({ text: "" });
    await browser.browserAction.setTitle({
      title: "Enhanced Tracking Protection: ON — click to disable",
    });
  } else {
    await browser.browserAction.setBadgeText({ text: "OFF" });
    await browser.browserAction.setBadgeBackgroundColor({ color: DISABLED_COLOR });
    await browser.browserAction.setTitle({
      title: "Enhanced Tracking Protection: OFF — click to enable",
    });
  }
}

/**
 * Toggle between enabled ("always") and disabled ("never").
 * Returns the new enabled boolean so the popup can react immediately.
 */
async function toggle() {
  const enabled = await isEnabled();
  const nextMode = enabled ? "never" : "always";
  await browser.privacy.websites.trackingProtectionMode.set({ value: nextMode });
  await updateBadge();
  return !enabled;
}

// Keep the badge up-to-date on startup.
updateBadge();

// Listen for messages from the popup.
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "GET_STATE") {
    return isEnabled();
  }
  if (message.type === "TOGGLE") {
    return toggle();
  }
});
