const publications = [
  {
    number: 1,
    year: 1993,
    tags: ["algebra"],
    title: "C-anneaux, E-anneaux et formule de la dimension",
    meta: "Othman Echi. Portugaliae Mathematica 50, no. 3, 277-295.",
    link: ""
  },
  {
    number: 2,
    year: 1994,
    tags: ["algebra"],
    title: "Transfert de la notion de C-anneaux aux produits fibres",
    meta: "Othman Echi. Portugaliae Mathematica 51, no. 1, 13-23.",
    link: ""
  },
  {
    number: 3,
    year: 1994,
    tags: ["algebra"],
    title: "The altitude formula",
    meta: "Othman Echi. In Commutative Ring Theory: Proceedings of the Fes International Conference, Lecture Notes in Pure and Applied Mathematics 153, Marcel Dekker, 99-104.",
    link: "https://doi.org/10.1201/9781003421917-10"
  },
  {
    number: 4,
    year: 1994,
    tags: ["algebra"],
    title: "Intersection de produits fibres et formule de la dimension",
    meta: "A. Ayache; P.-J. Cahen; Othman Echi. Communications in Algebra 22, no. 9, 3495-3509.",
    link: ""
  },
  {
    number: 5,
    year: 1995,
    tags: ["algebra"],
    title: "Sur les hauteurs valuatives",
    meta: "Othman Echi. Bollettino della Unione Matematica Italiana B (7) 9, no. 2, 281-297.",
    link: ""
  },
  {
    number: 6,
    year: 1995,
    tags: ["algebra"],
    title: "Valuative heights and infinite Nagata rings",
    meta: "A. Ayache; P.-J. Cahen; Othman Echi. Communications in Algebra 23, no. 5, 1913-1926.",
    link: ""
  },
  {
    number: 7,
    year: 1996,
    tags: ["algebra"],
    title: "Anneaux quasi-pruferiens et P-anneaux",
    meta: "A. Ayache; P.-J. Cahen; Othman Echi. Bollettino della Unione Matematica Italiana B (7) 10, no. 1, 1-24.",
    link: ""
  },
  {
    number: 8,
    year: 1996,
    tags: ["algebra"],
    title: "Topologies associees a une relation binaire et relation binaire spectrale",
    meta: "E. Bouacida; Othman Echi; E. Salhi. Bollettino della Unione Matematica Italiana B (7) 10, no. 2, 417-439.",
    link: ""
  },
  {
    number: 9,
    year: 1997,
    tags: ["algebra"],
    title: "On spectral binary relations",
    meta: "K. Belaid; B. Cherif; Othman Echi. In Commutative Ring Theory, Lecture Notes in Pure and Applied Mathematics 185, Marcel Dekker, 79-88.",
    link: ""
  },
  {
    number: 10,
    year: 1997,
    tags: ["algebra"],
    title: "Nonfinite heights",
    meta: "E. Bouacida; Othman Echi; E. Salhi. In Commutative Ring Theory, Lecture Notes in Pure and Applied Mathematics 185, Marcel Dekker, 113-130.",
    link: ""
  },
  {
    number: 11,
    year: 1999,
    tags: ["topology"],
    title: "Foliations, spectral topology, and special morphisms",
    meta: "E. Bouacida; Othman Echi; E. Salhi. In Advances in Commutative Ring Theory, Lecture Notes in Pure and Applied Mathematics 205, Marcel Dekker, 111-132.",
    link: ""
  },
  {
    number: 12,
    year: 2000,
    tags: ["algebra"],
    title: "Pairs of domains where all intermediate domains are Jaffard",
    meta: "M. Ben Nasr; Othman Echi; L. Izelgue; N. Jarboui. Journal of Pure and Applied Algebra 145, no. 1, 1-18.",
    link: ""
  },
  {
    number: 13,
    year: 2000,
    tags: ["algebra"],
    title: "Direct systems of localizations of polynomial rings",
    meta: "S. Ameziane; Othman Echi; I. Yengui. Acta Scientiarum Mathematicarum (Szeged) 66, no. 3-4, 465-476.",
    link: ""
  },
  {
    number: 14,
    year: 2000,
    tags: ["topology"],
    title: "Feuilletages et topologie spectrale",
    meta: "E. Bouacida; Othman Echi; E. Salhi. Journal of the Mathematical Society of Japan 52, no. 2, 447-464.",
    link: ""
  },
  {
    number: 15,
    year: 2000,
    tags: ["algebra"],
    title: "A topological characterization of the Goldman prime spectrum of a commutative ring",
    meta: "Othman Echi. Communications in Algebra 28, no. 5, 2329-2337.",
    link: ""
  },
  {
    number: 16,
    year: 2000,
    tags: ["topology"],
    title: "Quasi-spectral binary relations and ordered disjoint unions",
    meta: "K. Belaid; B. Cherif; Othman Echi. Journal of Mathematical Sciences (Calcutta) 11, no. 2, 139-157.",
    link: ""
  },
  {
    number: 17,
    year: 2001,
    tags: ["algebra"],
    title: "Universally catenarian and going-down pairs of rings",
    meta: "A. Ayache; M. Ben Nasr; Othman Echi; N. Jarboui. Mathematische Zeitschrift 238, no. 4, 695-731.",
    link: ""
  },
  {
    number: 19,
    year: 2003,
    tags: ["topology"],
    title: "Quasi-homeomorphisms, Goldspectral spaces and Jacspectral spaces",
    meta: "Othman Echi. Bollettino della Unione Matematica Italiana B (8) 6, no. 2, 489-507.",
    link: ""
  },
  {
    number: 20,
    year: 2003,
    tags: ["algebra", "topology"],
    title: "Topological characterizations of some subspaces of a spectral space",
    meta: "Othman Echi. Questions and Answers in General Topology 21, no. 2, 109-123.",
    link: ""
  },
  {
    number: 21,
    year: 2003,
    tags: ["topology"],
    title: "An extension theorem for sober spaces and the Goldman topology",
    meta: "E. Bouacida; Othman Echi; G. Picavet; E. Salhi. International Journal of Mathematics and Mathematical Sciences 2003, no. 51, 3217-3239.",
    link: ""
  },
  {
    number: 22,
    year: 2004,
    tags: ["topology"],
    title: "A-spectral spaces",
    meta: "K. Belaid; Othman Echi; R. Gargouri. Topology and its Applications 138, no. 1-3, 315-322.",
    link: "https://doi.org/10.1016/j.topol.2003.08.009"
  },
  {
    number: 23,
    year: 2004,
    tags: ["topology"],
    title: "On a conjecture about spectral sets",
    meta: "K. Belaid; Othman Echi. Topology and its Applications 139, no. 1-3, 1-15.",
    link: ""
  },
  {
    number: 24,
    year: 2004,
    tags: ["topology"],
    title: "An up-spectral space need not be A-spectral",
    meta: "Othman Echi; R. Gargouri. New York Journal of Mathematics 10, 271-277.",
    link: ""
  },
  {
    number: 25,
    year: 2004,
    tags: ["topology"],
    title: "T(alpha,beta)-spaces and the Wallman compactification",
    meta: "K. Belaid; Othman Echi; S. Lazaar. International Journal of Mathematics and Mathematical Sciences 2004, no. 68, 3717-3735.",
    link: "https://doi.org/10.1155/S0161171204404050"
  },
  {
    number: 26,
    year: 2005,
    tags: ["topology"],
    title: "Up-spectral spaces and A-spectral spaces",
    meta: "Othman Echi; M. Ito. Questions and Answers in General Topology 23, no. 1, 15-26.",
    link: ""
  },
  {
    number: 27,
    year: 2005,
    tags: ["topology"],
    title: "Two classes of locally compact sober spaces",
    meta: "K. Belaid; Othman Echi; R. Gargouri. International Journal of Mathematics and Mathematical Sciences 2005, no. 15, 2421-2427.",
    link: "https://doi.org/10.1155/IJMMS.2005.2421"
  },
  {
    number: 28,
    year: 2005,
    tags: ["topology"],
    title: "The envelope of a subcategory in topology and group theory",
    meta: "A. Ayache; Othman Echi. International Journal of Mathematics and Mathematical Sciences 2005, no. 21, 3387-3404.",
    link: "https://doi.org/10.1155/IJMMS.2005.3387"
  },
  {
    number: 30,
    year: 2006,
    tags: ["algebra"],
    title: "Valuation and pseudo-valuation subrings of an integral domain",
    meta: "A. Ayache; Othman Echi. Communications in Algebra 34, no. 7, 2467-2483.",
    link: "https://doi.org/10.1080/00927870600650515"
  },
  {
    number: 31,
    year: 2006,
    tags: ["algebra"],
    title: "Universal mapping properties of some pseudovaluation domains and related quasilocal domains",
    meta: "A. Ayache; D. E. Dobbs; Othman Echi. International Journal of Mathematics and Mathematical Sciences 2006, Art. ID 72589, 12 pp.",
    link: ""
  },
  {
    number: 32,
    year: 2006,
    tags: ["topology"],
    title: "On T_D-spaces",
    meta: "Othman Echi. Missouri Journal of Mathematical Sciences 18, no. 1, 54-60.",
    link: "https://doi.org/10.35834/2006/1801054"
  },
  {
    number: 34,
    year: 2007,
    tags: ["topology"],
    title: "Networks of morphisms",
    meta: "Othman Echi. Missouri Journal of Mathematical Sciences 19, no. 2, 93-105.",
    link: ""
  },
  {
    number: 37,
    year: 2007,
    tags: ["number"],
    title: "Williams numbers",
    meta: "Othman Echi. Mathematical Reports of the Academy of Sciences of the Royal Society of Canada 29, no. 2, 41-47.",
    link: ""
  },
  {
    number: 38,
    year: 2008,
    tags: ["topology"],
    title: "Sober spaces and sober sets",
    meta: "Othman Echi; S. Lazaar. Missouri Journal of Mathematical Sciences 20, no. 1, 60-72.",
    link: "https://doi.org/10.35834/mjms/1316032836"
  },
  {
    number: 39,
    year: 2008,
    tags: ["topology"],
    title: "On the Hochster dual of a topological space",
    meta: "Othman Echi; R. Gargouri; S. Lazaar. Topology Proceedings 32, 153-166.",
    link: ""
  },
  {
    number: 40,
    year: 2008,
    tags: ["topology"],
    title: "Submaximal spaces and spectral spaces",
    meta: "M. E. Adams; K. Belaid; L. Dridi; Othman Echi. Mathematical Proceedings of the Royal Irish Academy 108A, 137-147.",
    link: ""
  },
  {
    number: 41,
    year: 2008,
    tags: ["words"],
    title: "Primitive words and spectral spaces",
    meta: "Othman Echi; M. Naimi. New York Journal of Mathematics 14, 719-731.",
    link: ""
  },
  {
    number: 42,
    year: 2009,
    tags: ["topology"],
    title: "Universal spaces, Tychonoff and spectral spaces",
    meta: "Othman Echi; S. Lazaar. Mathematical Proceedings of the Royal Irish Academy 109A, no. 1, 35-48.",
    link: "https://doi.org/10.3318/PRIA.2008.109.1.35"
  },
  {
    number: 43,
    year: 2009,
    tags: ["topology"],
    title: "Reflective subcategories, Tychonoff spaces and spectral spaces",
    meta: "Othman Echi; S. Lazaar. Topology Proceedings 34, 307-319.",
    link: ""
  },
  {
    number: 45,
    year: 2009,
    tags: ["topology"],
    title: "Quasihomeomorphisms and lattice equivalent topological spaces",
    meta: "Othman Echi; S. Lazaar. Applied General Topology 10, no. 2, 227-237.",
    link: "https://doi.org/10.4995/agt.2009.1736"
  },
  {
    number: 47,
    year: 2011,
    tags: ["number"],
    title: "On Kronecker polynomials",
    meta: "A. Ayache; Othman Echi; M. Naimi. Rocky Mountain Journal of Mathematics 41, no. 3, 707-725.",
    link: "https://doi.org/10.1216/RMJ-2011-41-3-707"
  },
  {
    number: 48,
    year: 2011,
    tags: ["topology"],
    title: "On the spectralification of a hemispectral space",
    meta: "Othman Echi; M. Oueld Abdallahi. Journal of Algebra and its Applications 10, no. 4, 687-699.",
    link: "https://doi.org/10.1142/S0219498811004847"
  },
  {
    number: 50,
    year: 2012,
    tags: ["number"],
    title: "The Korselt set of pq",
    meta: "Othman Echi; N. Ghanmi. International Journal of Number Theory 8, no. 2, 299-309.",
    link: ""
  },
  {
    number: 51,
    year: 2012,
    tags: ["topology"],
    title: "The categories of flows of Set and Top",
    meta: "Othman Echi. Topology and its Applications 159, no. 9, 2357-2366.",
    link: "https://doi.org/10.1016/j.topol.2011.11.059"
  },
  {
    number: 53,
    year: 2013,
    tags: ["number"],
    title: "On the Korselt set of a squarefree composite number",
    meta: "I. Al-Rasasi; Othman Echi; N. Ghanmi. Mathematical Reports of the Academy of Sciences of the Royal Society of Canada 35, 1-15.",
    link: ""
  },
  {
    number: 54,
    year: 2014,
    tags: ["words"],
    title: "On minimal Hamming compatible distances",
    meta: "P. Bakhtary; Othman Echi. RAIRO - Theoretical Informatics and Applications 48, no. 5, 495-503.",
    link: "https://doi.org/10.1051/ita/2014022"
  },
  {
    number: 55,
    year: 2015,
    tags: ["topology"],
    title: "On some orthogonal factorization systems",
    meta: "Othman Echi; S. Lazaar; M. Oueld Abdallahi. Journal of Algebra and its Applications 14, no. 8, 1550120, 18 pp.",
    link: ""
  },
  {
    number: 56,
    year: 2017,
    tags: ["words"],
    title: "Non-primitive words of the form pq^m",
    meta: "Othman Echi. RAIRO - Theoretical Informatics and Applications 51, no. 3, 141-166.",
    link: "https://doi.org/10.1051/ita/2017012"
  },
  {
    number: 57,
    year: 2019,
    tags: ["algebra"],
    title: "On the prime spectrum of the ring of bounded nonstandard complex numbers",
    meta: "Othman Echi; A. Khalfallah. Proceedings of the American Mathematical Society 147, 687-699.",
    link: "https://doi.org/10.1090/proc/14204"
  },
  {
    number: 58,
    year: 2019,
    tags: ["algebra"],
    title: "Order theoretic and topological characterizations of the divided spectrum of a ring",
    meta: "Othman Echi; A. Khalfallah. Bulletin of the Belgian Mathematical Society - Simon Stevin 26, no. 3, 453-467.",
    link: ""
  },
  {
    number: 59,
    year: 2019,
    tags: ["topology"],
    title: "On spectral primal spaces",
    meta: "Othman Echi; T. Turki. Journal of Algebra and its Applications 18, no. 2, 1950030, 10 pp.",
    link: ""
  },
  {
    number: 60,
    year: 2021,
    tags: ["topology"],
    title: "Subrings of a power set and clopen topologies",
    meta: "A. Ayache; Othman Echi; A. Khalfallah. Journal of Algebra and its Applications 20, no. 12, Paper No. 2150224, 13 pp.",
    link: ""
  },
  {
    number: 61,
    year: 2022,
    tags: ["topology"],
    title: "On the product of primal spaces",
    meta: "Othman Echi. Quaestiones Mathematicae 45, no. 1, 1-10.",
    link: "https://doi.org/10.2989/16073606.2020.1836062"
  },
  {
    number: 62,
    year: 2022,
    tags: ["words"],
    title: "On primitive words with non-primitive product",
    meta: "Othman Echi; A. Khalfallah; D. Kroumi. RAIRO - Theoretical Informatics and Applications 56, Article 4, 11 pp.",
    link: "https://doi.org/10.1051/ita/2022004"
  },
  {
    number: 63,
    year: 2022,
    tags: ["topology"],
    title: "On a topology defined by primitive words",
    meta: "Othman Echi. Missouri Journal of Mathematical Sciences 34, no. 2, 221-229.",
    link: "https://doi.org/10.35834/2022/3402221"
  },
  {
    number: 64,
    year: 2023,
    tags: ["inequalities"],
    title: "Estimating the remainder of an alternating p-series using hypergeometric functions",
    meta: "Othman Echi; A. Khalfallah; D. Kroumi. Journal of Mathematical Inequalities 17, no. 2, 569-580.",
    link: "https://doi.org/10.7153/jmi-2023-17-36"
  },
  {
    number: 65,
    year: 2023,
    tags: ["inequalities"],
    title: "Sharp estimate of the remainder of some alternating series",
    meta: "Othman Echi; A. Khalfallah; D. Kroumi. Mathematical Inequalities & Applications 26, no. 1, 83-91.",
    link: ""
  },
  {
    number: 67,
    year: 2025,
    tags: ["topology", "words"],
    title: "Spheres of strings under the Levenshtein distance",
    meta: "S. Algarni; Othman Echi. Axioms 14, no. 8, Article 550.",
    link: "https://doi.org/10.3390/axioms14080550"
  },
  {
    number: 68,
    year: 2025,
    tags: ["words"],
    title: "The primitive deficiency of two primitive strings",
    meta: "Othman Echi. Acta Informatica 62, no. 3, Article 26, 19 pp.",
    link: "https://doi.org/10.1007/s00236-025-00494-y"
  },
  {
    number: 69,
    year: 2025,
    tags: ["topology"],
    title: "The group of autohomeomorphisms of some digital topologies on the integers",
    meta: "Othman Echi. Filomat 39, no. 9, 2985-3001.",
    link: "https://doi.org/10.2298/FIL2509985E"
  }
];

// Keep the homepage list aligned with the publication numbering in the CV.
publications.sort((a, b) => a.number - b.number);

const state = {
  filter: "all",
  query: ""
};

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

function renderPublications() {
  const list = qs("#publicationList");
  const status = qs("#publicationStatus");
  if (!list || !status) return;

  const query = state.query.trim().toLowerCase();

  const items = publications.filter((publication) => {
    const matchesFilter = state.filter === "all" || publication.tags.includes(state.filter);
    const haystack = `${publication.number} ${publication.year} ${publication.title} ${publication.meta} ${publication.tags.join(" ")}`.toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });

  status.textContent = `${items.length} publication${items.length === 1 ? "" : "s"} shown`;

  list.innerHTML = items.map((publication) => `
    <article class="publication">
      <time datetime="${publication.year}">${publication.year}</time>
      <div>
        <h3>${escapeHtml(publication.number + ". " + publication.title)}</h3>
        <p>${escapeHtml(publication.meta)}</p>
        ${publication.link ? `<a href="${publication.link}" rel="noopener">Open DOI</a>` : ""}
      </div>
    </article>
  `).join("");

  observeReveals();
}

function getHeaderHeight() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--header-height");
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 72;
}

function setHeaderState() {
  const header = qs("[data-header]");
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 24);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  const bar = qs("#scrollProgress");
  if (bar) bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function setActiveNav() {
  const sections = qsa("main section[id]");
  const navLinks = qsa(".site-nav a");
  const threshold = getHeaderHeight() + 70;

  const current = sections
    .filter((section) => section.getBoundingClientRect().top < threshold)
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
  if (!nav || !toggle) return;

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
  const search = qs("#publicationSearch");
  if (search) {
    search.addEventListener("input", (event) => {
      state.query = event.target.value;
      renderPublications();
    });
  }

  qsa(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      qsa(".filter").forEach((item) => item.classList.toggle("active", item === button));
      renderPublications();
    });
  });
}

function init() {
  qsa(".section:not(.intro):not(.publications), .research-item, .service-grid article, .timeline article, .contact-panel, .news-item")
    .forEach((item) => item.setAttribute("data-reveal", ""));

  const yearEl = qs("#currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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
