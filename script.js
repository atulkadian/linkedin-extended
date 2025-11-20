// Load saved settings when popup opens
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(
    ["removeEasyApply", "removePromoted", "removeViewed", "blockedCompanies"],
    (data) => {
      document.getElementById("remove-easy-apply-jobs").checked =
        data.removeEasyApply || false;
      document.getElementById("remove-promoted-jobs").checked =
        data.removePromoted || false;
      document.getElementById("remove-viewed-jobs").checked =
        data.removeViewed || false;

      // Load blocked companies
      if (data.blockedCompanies && data.blockedCompanies.length > 0) {
        document.getElementById("blocked-companies").value =
          data.blockedCompanies.join("\n");
      }
    }
  );
});

// Save settings and apply filters
document.getElementById("save-settings").addEventListener("click", () => {
  const removeEasyApply = document.getElementById(
    "remove-easy-apply-jobs"
  ).checked;
  const removePromoted = document.getElementById(
    "remove-promoted-jobs"
  ).checked;
  const removeViewed = document.getElementById("remove-viewed-jobs").checked;

  // Get blocked companies from textarea
  const blockedCompaniesText =
    document.getElementById("blocked-companies").value;
  const blockedCompanies = blockedCompaniesText
    .split("\n")
    .map((company) => company.trim())
    .filter((company) => company.length > 0);

  // Save settings to chrome.storage
  chrome.storage.sync.set(
    {
      removeEasyApply,
      removePromoted,
      removeViewed,
      blockedCompanies,
    },
    () => {
      // Send message to content script to apply filters immediately
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab && tab.id) {
          chrome.tabs.sendMessage(
            tab.id,
            { action: "applyFilters" },
            (response) => {
              // Show feedback to user
              const button = document.getElementById("save-settings");
              const originalText = button.textContent;
              button.textContent = "Settings Saved!";
              button.style.backgroundColor = "#057642";

              setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = "#0a66c2";
              }, 2000);
            }
          );
        }
      });
    }
  );
});
