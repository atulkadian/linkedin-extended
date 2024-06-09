document.getElementById("clean-jobs").addEventListener("click", () => {
  const removeEasyApplyJobsChecked = document.getElementById(
    "remove-easy-apply-jobs"
  ).checked;
  const removePromotedJobsChecked = document.getElementById(
    "remove-promoted-jobs"
  ).checked;
  const removeViewedJobsChecked =
    document.getElementById("remove-viewed-jobs").checked;

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (
        removeEasyApplyJobsChecked,
        removePromotedJobsChecked,
        removeViewedJobsChecked
      ) => {
        function removeEasyApplyJobs() {
          console.log("Removing Easy Apply Jobs");

          // Select all list items on the page
          const listItems = document.querySelectorAll("li");

          listItems.forEach((item) => {
            // Check if the list item contains a descendant with the target class for Easy Apply
            if (
              item.querySelector(
                ".job-card-container__apply-method.job-card-container__footer-item.inline-flex.align-items-center"
              )
            ) {
              // Remove the list item if the class is found
              item.remove();
            }
          });
        }

        function removePromotedJobs() {
          console.log("Removing Promoted Jobs");

          // Select all list items on the page
          const listItems = document.querySelectorAll("li");

          listItems.forEach((item) => {
            // Check if the list item contains a descendant with the target class for Promoted
            if (
              item
                .querySelector(
                  ".job-card-container__footer-item.inline-flex.align-items-center"
                )
                ?.textContent.includes("Promoted")
            ) {
              // Remove the list item if the class is found
              item.remove();
            }
          });
        }

        function removeViewedJobs() {
          console.log("Removing Viewed Jobs");

          // Select all list items on the page
          const listItems = document.querySelectorAll("li");

          listItems.forEach((item) => {
            // Check if the list item contains a descendant with the target class for Viewed
            if (
              item
                .querySelector(
                  ".job-card-container__footer-item.job-card-container__footer-job-state.t-bold"
                )
                ?.textContent.includes("Viewed")
            ) {
              // Remove the list item if the class is found
              item.remove();
            }
          });
        }

        if (removeEasyApplyJobsChecked) {
          removeEasyApplyJobs();
        }
        if (removePromotedJobsChecked) {
          removePromotedJobs();
        }
        if (removeViewedJobsChecked) {
          removeViewedJobs();
        }
      },
      args: [
        removeEasyApplyJobsChecked,
        removePromotedJobsChecked,
        removeViewedJobsChecked,
      ],
    });
  });
});
