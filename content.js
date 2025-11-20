// Content script that runs automatically on LinkedIn jobs pages

// Function to remove Easy Apply jobs
function removeEasyApplyJobs() {
  const listItems = document.querySelectorAll("li");
  listItems.forEach((item) => {
    if (
      item.querySelector(
        ".job-card-container__apply-method.job-card-container__footer-item.inline-flex.align-items-center"
      )
    ) {
      item.remove();
    }
  });
}

// Function to remove Promoted jobs
function removePromotedJobs() {
  const listItems = document.querySelectorAll("li");
  listItems.forEach((item) => {
    if (
      item
        .querySelector(
          ".job-card-container__footer-item.inline-flex.align-items-center"
        )
        ?.textContent.includes("Promoted")
    ) {
      item.remove();
    }
  });
}

// Function to remove Viewed jobs
function removeViewedJobs() {
  const listItems = document.querySelectorAll("li");
  listItems.forEach((item) => {
    if (
      item
        .querySelector(
          ".job-card-container__footer-item.job-card-container__footer-job-state.t-bold"
        )
        ?.textContent.includes("Viewed")
    ) {
      item.remove();
    }
  });
}

// Function to remove jobs from blocked companies
function removeJobsFromBlockedCompanies(blockedCompanies) {
  if (!blockedCompanies || blockedCompanies.length === 0) return;

  const listItems = document.querySelectorAll("li");
  listItems.forEach((item) => {
    // Look for company name in job card
    const companyElement = item.querySelector(
      ".job-card-container__company-name, .artdeco-entity-lockup__subtitle, .job-card-container__primary-description"
    );

    if (companyElement) {
      const companyText = companyElement.textContent.trim().toLowerCase();

      // Check if any blocked company name matches
      const isBlocked = blockedCompanies.some((company) => {
        const companyLower = company.toLowerCase().trim();
        return companyText.includes(companyLower);
      });

      if (isBlocked) {
        item.remove();
      }
    }
  });
}

// Main filtering function
function applyFilters() {
  chrome.storage.sync.get(
    ["removeEasyApply", "removePromoted", "removeViewed", "blockedCompanies"],
    (data) => {
      if (data.removeEasyApply) {
        removeEasyApplyJobs();
      }
      if (data.removePromoted) {
        removePromotedJobs();
      }
      if (data.removeViewed) {
        removeViewedJobs();
      }
      if (data.blockedCompanies && data.blockedCompanies.length > 0) {
        removeJobsFromBlockedCompanies(data.blockedCompanies);
      }
    }
  );
}

// Run filters on initial page load
applyFilters();

// Create a MutationObserver to watch for new jobs being added (pagination, infinite scroll)
const observer = new MutationObserver((mutations) => {
  // Check if new job listings were added
  const jobListingsAdded = mutations.some((mutation) => {
    return Array.from(mutation.addedNodes).some((node) => {
      return (
        node.nodeType === 1 &&
        node.matches &&
        (node.matches("li") ||
          node.querySelector("li") ||
          node.matches(".jobs-search-results__list") ||
          node.querySelector(".jobs-search-results__list"))
      );
    });
  });

  if (jobListingsAdded) {
    // Delay slightly to allow LinkedIn to fully render the new jobs
    setTimeout(applyFilters, 500);
  }
});

// Start observing the document for changes
const targetNode = document.body;
const config = {
  childList: true,
  subtree: true,
};

observer.observe(targetNode, config);

// Listen for messages from the popup (when settings change)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyFilters") {
    applyFilters();
    sendResponse({ success: true });
  }
});
