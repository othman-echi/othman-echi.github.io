const publications = [
  {
    year: 2025,
    tags: ["words"],
    title: "Spheres of strings under the Levenshtein distance",
    meta: "Said Algarni; Othman Echi. Axioms 14, Article 550.",
    link: "https://doi.org/10.3390/axioms14080550"
  },
  {
    year: 2025,
    tags: ["words"],
    title: "The primitive deficiency of two primitive strings",
    meta: "Othman Echi. Acta Informatica 62, Article 26.",
    link: "https://doi.org/10.1007/s00236-025-00494-y"
  },
  {
    year: 2025,
    tags: ["topology"],
    title: "The group of autohomeomorphisms of some digital topologies on the integers",
    meta: "Othman Echi. Filomat 39, no. 9, 2985-3001.",
    link: "https://doi.org/10.2298/FIL2509985E"
  },
  {
    year: 2023,
    tags: ["topology", "algebra"],
    title: "Quasihomeomorphisms and Skula spaces",
    meta: "Othman Echi. Journal of Algebra and its Applications 22, Article 2350020.",
    link: "https://doi.org/10.1142/S0219498823500202"
  },
  {
    year: 2023,
    tags: ["number"],
    title: "Estimating the remainder of an alternating p-series using hypergeometric functions",
    meta: "Othman Echi; Adel Khalfallah; Dhaker Kroumi. Journal of Mathematical Inequalities 17, 569-580.",
    link: "https://doi.org/10.7153/jmi-2023-17-36"
  },
  {
    year: 2023,
    tags: ["number"],
    title: "Sharp estimate of the remainder of some alternating series",
    meta: "Othman Echi; Adel Khalfallah; Dhaker Kroumi. Mathematical Inequalities & Applications 26, 83-91.",
    link: ""
  },
  {
    year: 2022,
    tags: ["words"],
    title: "On primitive words with non-primitive product",
    meta: "Othman Echi; Adel Khalfallah; Dhaker Kroumi. RAIRO - Theoretical Informatics and Applications 56, Article 4.",
    link: "https://doi.org/10.1051/ita/2022004"
  },
  {
    year: 2022,
    tags: ["topology"],
    title: "On a topology defined by primitive words",
    meta: "Othman Echi. Missouri Journal of Mathematical Sciences 34, 221-229.",
    link: "https://doi.org/10.35834/2022/3402221"
  },
  {
    year: 2022,
    tags: ["topology"],
    title: "On the product of primal spaces",
    meta: "Othman Echi. Quaestiones Mathematicae 45, 1-10.",
    link: "https://doi.org/10.2989/16073606.2020.1836062"
  },
  {
    year: 2021,
    tags: ["algebra", "topology"],
    title: "Subrings of a power set and clopen topologies",
    meta: "Ahmed Ayache; Othman Echi; Adel Khalfallah. Journal of Algebra and its Applications 20, Paper 2150224.",
    link: ""
  },
  {
    year: 2019,
    tags: ["topology", "algebra"],
    title: "On spectral primal spaces",
    meta: "Othman Echi; Tarek Turki. Journal of Algebra and its Applications 18, Article 1950030.",
    link: ""
  },
  {
    year: 2019,
    tags: ["algebra"],
    title: "On the prime spectrum of the ring of bounded nonstandard complex numbers",
    meta: "Othman Echi; Adel Khalfallah. Proceedings of the American Mathematical Society 147, 687-699.",
    link: "https://doi.org/10.1090/proc/14204"
  },
  {
    year: 2017,
    tags: ["words"],
    title: "Non-primitive words of the form pq^m",
    meta: "Othman Echi. RAIRO - Theoretical Informatics and Applications 51, 141-166.",
    link: "https://doi.org/10.1051/ita/2017012"
  },
  {
    year: 2012,
    tags: ["topology"],
    title: "The categories of flows of Set and Top",
    meta: "Othman Echi. Topology and its Applications 159, 2357-2366.",
    link: "https://doi.org/10.1016/j.topol.2011.11.059"
  },
  {
    year: 2010,
    tags: ["number"],
    title: "Korselt numbers and sets",
    meta: "Kais Bouallegue; Othman Echi; Richard Pinch. International Journal of Number Theory 6, 257-269.",
    link: ""
  },
  {
    year: 2000,
    tags: ["algebra", "topology"],
    title: "A topological characterization of the Goldman prime spectrum of a commutative ring",
    meta: "Othman Echi. Communications in Algebra 28, 2329-2337.",
    link: ""
  }
];

const state = {
  filter: "all",
  query: ""
};

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

function renderPublications() {
  const list = qs("#publicationList");
  const status = qs("#publicationStatus");
  const query = state.query.trim().toLowerCase();

  const items = publications.filter((publication) => {
    const matchesFilter = state.filter === "all" || publication.tags.includes(state.filter);
    const haystack = `${publication.year} ${publication.title} ${publication.meta} ${publication.tags.join(" ")}`.toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });

  status.textContent = `${items.length} publication${items.length === 1 ? "" : "s"} shown`;

  list.innerHTML = items.map((publication) => `
    <article class="publication" data-reveal>
      <time datetime="${publication.year}">${publication.year}</time>
      <div>
        <h3>${publication.title}</h3>
        <p>${publication.meta}</p>
        ${publication.link ? `<a href="${publication.link}">Open DOI</a>` : ""}
      </div>
    </article>
  `).join("");

  observeReveals();
}

function setHeaderState() {
  const header = qs("[data-header]");
  header.classList.toggle("scrolled", window.scrollY > 24);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  qs("#scrollProgress").style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function setActiveNav() {
  const sections = qsa("main section[id]");
  const navLinks = qsa(".site-nav a");
  const current = sections
    .filter((section) => section.getBoundingClientRect().top < 140)
    .pop();

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("active", current && href === `#${current.id}`);
  });
}

let revealObserver;

function observeReveals() {
  const revealItems = qsa("[data-reveal]:not(.visible)");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }

  revealItems.forEach((item) => revealObserver.observe(item));
}

function animateFacts() {
  const facts = qsa("[data-count]");
  if (!("IntersectionObserver" in window)) {
    facts.forEach((fact) => {
      fact.textContent = fact.dataset.count;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const item = entry.target;
      const end = Number(item.dataset.count);
      const duration = 900;
      const startTime = performance.now();
      item.textContent = "0";

      function tick(now) {
        const progress = Math.min(1, (now - startTime) / duration);
        item.textContent = Math.round(end * progress);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(item);
    });
  }, { threshold: 0.6 });

  facts.forEach((fact) => observer.observe(fact));
}

function initNavigation() {
  const nav = qs("[data-nav]");
  const toggle = qs("[data-nav-toggle]");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  qsa(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initPublicationControls() {
  qs("#publicationSearch").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderPublications();
  });

  qsa(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      qsa(".filter").forEach((item) => item.classList.toggle("active", item === button));
      renderPublications();
    });
  });
}

function init() {
  qsa(".section:not(.intro), .research-item, .service-grid article, .timeline article, .contact-panel").forEach((item) => {
    item.setAttribute("data-reveal", "");
  });

  qs("#currentYear").textContent = new Date().getFullYear();
  initNavigation();
  initPublicationControls();
  renderPublications();
  observeReveals();
  animateFacts();
  setHeaderState();
  setActiveNav();

  window.addEventListener("scroll", () => {
    setHeaderState();
    setActiveNav();
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", init);
