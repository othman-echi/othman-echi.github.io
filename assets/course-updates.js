(() => {
  'use strict';
  // Set after deploying Apps Script as a public web app that executes as its owner.
  const webAppUrl = '';
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(webAppUrl)) return;
  const panel = document.getElementById('combinatorics-updates');
  if (!panel) return;
  panel.querySelector('iframe').src = webAppUrl;
  panel.querySelector('[data-course-alerts-link]').href = webAppUrl;
  panel.hidden = false;
})();
