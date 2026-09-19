(() => {
  "use strict";

  const siteCode = "othman-echi";
  const courses = new Map([
    ["/drive/folders/1UjDDTHxBOWgyOfvKD9Ov06tSq1WuuK6s", {
      event: "course-combinatoire-lsm1",
      title: "Combinatoire-LSM1"
    }],
    ["/drive/folders/14zMOgdNLsMqSFA5qNI2-kKv99u6Kudml", {
      event: "course-general-topology-lmi3",
      title: "General Topology-LMI3"
    }]
  ]);

  document.querySelectorAll("a[href]").forEach((link) => {
    const url = new URL(link.href, document.baseURI);
    if (url.origin !== "https://drive.google.com") return;
    const course = courses.get(url.pathname);
    if (!course) return;
    link.setAttribute("data-goatcounter-click", course.event);
    link.setAttribute("data-goatcounter-title", course.title);
    if (link.closest(".hero-actions, #teaching")) {
      const counter = document.createElement("span");
      counter.className = "course-counter";
      counter.dataset.courseCounter = course.event;
      counter.textContent = "Visitors: ...";
      counter.title = "Recorded course-link visitors since September 2026; totals may take four hours to refresh.";
      link.appendChild(counter);
    }
  });

  // Reading totals does not record a visit. A new, unvisited event returns 404/0.
  courses.forEach(async (course) => {
    let label = "Visitors: unavailable";
    try {
      const response = await fetch(
        `https://${siteCode}.goatcounter.com/counter/${encodeURIComponent(course.event)}.json`,
        { credentials: "omit", signal: AbortSignal.timeout(10000) }
      );
      const data = await response.json();
      if ((response.ok || (response.status === 404 && data.count === "0")) &&
          typeof data.count === "string" && /^[0-9][0-9,.\s]*$/.test(data.count)) {
        label = `Visitors: ${data.count}`;
      }
    } catch {
      // Keep the course links usable when analytics is blocked or offline.
    }
    document.querySelectorAll(`[data-course-counter="${course.event}"]`).forEach((counter) => {
      counter.textContent = label;
    });
  });

  // Never record local previews.
  if (!/^[a-z0-9][a-z0-9-]*$/.test(siteCode) ||
      location.hostname !== "othman-echi.github.io") return;

  const script = document.createElement("script");
  script.src = "https://gc.zgo.at/count.js";
  script.async = true;
  script.setAttribute("data-goatcounter", `https://${siteCode}.goatcounter.com/count`);
  // Bind course events without recording an additional homepage view.
  script.setAttribute("data-goatcounter-settings", '{"no_onload":true}');
  script.addEventListener("load", () => window.goatcounter?.bind_events());
  document.head.appendChild(script);
})();
