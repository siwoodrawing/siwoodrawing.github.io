const categoryMeta = {
  "concept-art": {
    label: "CONCEPT ART",
  },
  illustration: {
    label: "ILLUSTRATION",
  },
  "personal-work": {
    label: "PERSONAL WORK",
  },
};

const projects = [
  {
    id: "signal-bloom",
    title: "Signal Bloom",
    year: "2025",
    type: "Character concept",
    categories: ["concept-art", "personal-work"],
    image: "WORKS/siwoo-kim-artstation.jpg",
    layout: "layout-tall",
    alt: "Stylized sci-fi character standing against a teal-lit background.",
    description:
      "A sharp character-led concept focused on silhouette clarity, neon accents, and a slightly unsettling fashion-tech attitude.",
    notes: [
      "Built around a tall vertical presentation to emphasize presence and pose.",
      "The teal background and long cast shadow keep the figure dramatic without clutter.",
      "Styled as a polished key visual rather than a rough exploration sheet.",
    ],
  },
  {
    id: "underwater-silence",
    title: "Underwater Silence",
    year: "2018",
    type: "Narrative illustration",
    categories: ["illustration", "personal-work"],
    image: "WORKS/siwoo-kim-2018-mermaid.jpg",
    layout: "layout-feature",
    alt: "A mermaid rising through icy water while a figure leans in with a lantern.",
    description:
      "A quiet story moment where lighting carries the emotion: a single lantern, frozen water, and a restrained palette shape the tension.",
    notes: [
      "Framed wide so the negative space and the cracked ice hold as much weight as the characters.",
      "The green glow becomes the emotional center of the scene.",
      "Composed to feel cinematic and still, closer to a paused film frame than a poster.",
    ],
  },
  {
    id: "break-time",
    title: "Break Time",
    year: "2024",
    type: "Character study",
    categories: ["concept-art", "personal-work"],
    image: "WORKS/siwoo-kim-breaktime.jpg",
    layout: "layout-portrait",
    alt: "Two figures in muted green workwear, one standing and one seated with a visor.",
    description:
      "A paired character study balancing quiet attitude and implied backstory through costume repetition, body language, and restrained color.",
    notes: [
      "The matching uniforms create cohesion while the poses keep each character distinct.",
      "Smoke, visor glow, and asymmetrical posture add narrative tension.",
      "Designed to read cleanly both as a full image and as cropped details inside a portfolio grid.",
    ],
  },
  {
    id: "afterimage",
    title: "Afterimage",
    year: "2024",
    type: "Portrait key art",
    categories: ["concept-art", "illustration"],
    image: "WORKS/siwoo-kim-face-copy-web.jpg",
    layout: "layout-landscape",
    alt: "Close-up portrait with a moody teal color grade and futuristic shoulder piece.",
    description:
      "A close portrait piece where the expression and cool palette do most of the storytelling, pushing the image closer to a teaser frame.",
    notes: [
      "Wide crop keeps the gaze confrontational and immediate.",
      "Subtle particles and edge light help the scene feel suspended in air.",
      "Useful as both hero art and a supporting still inside the work archive.",
    ],
  },
  {
    id: "volley-bomb",
    title: "Volley Bomb",
    year: "2025",
    type: "Stylized illustration",
    categories: ["illustration", "personal-work"],
    image: "WORKS/siwoo-kim-volley-bomb-web.jpg",
    layout: "layout-square",
    alt: "Stylized athlete holding a ball-like device in a retro-futuristic uniform.",
    description:
      "A playful portrait built from sport-inspired color blocking, retro energy, and a deliberately graphic pose that reads instantly.",
    notes: [
      "Yellow, cyan, and red were kept intentionally bold to contrast the darker pieces.",
      "The simplified background makes the costume design do the heavy lifting.",
      "Placed in the grid as a tonal shift so the overall archive feels paced, not repetitive.",
    ],
  },
];

const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const menuToggle = document.getElementById("menu-toggle");
const menuOverlay = document.getElementById("site-menu");
const menuScrollLinks = Array.from(document.querySelectorAll(".menu-link[data-nav-target]"));
const menuGalleryButtons = Array.from(document.querySelectorAll(".menu-link[data-gallery-category]"));
const menuCloseButtons = Array.from(document.querySelectorAll("[data-menu-close]"));
const topbarTabs = Array.from(document.querySelectorAll(".topbar-tab"));
const galleryDrawer = document.getElementById("gallery-drawer");
const galleryDrawerLabel = document.getElementById("gallery-drawer-label");
const projectSubmenuList = document.getElementById("project-submenu-list");
const galleryCloseButtons = Array.from(document.querySelectorAll("[data-gallery-close]"));
const scrollButtons = Array.from(document.querySelectorAll("[data-nav-target]"));
const workGrid = document.getElementById("work-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxMeta = document.getElementById("lightbox-meta");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDescription = document.getElementById("lightbox-description");
const lightboxNotes = document.getElementById("lightbox-notes");
const closeButtons = Array.from(document.querySelectorAll("[data-close]"));
const introOverlay = document.getElementById("intro-overlay");
const introProgressValue = document.getElementById("intro-progress-value");
const introProgressBar = document.getElementById("intro-progress-bar");
const introFlipName = document.getElementById("intro-flip-name");
const homeSection = document.getElementById("home");

let lightboxLastTrigger = null;
let activeHeroSlideIndex = 0;
let activeGalleryCategory = null;
let activeHeroId = null;
let heroQueue = [];
let heroScrollTicking = false;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const heroPool = Array.from(
  new Map(projects.map((project) => [project.image, project])).values(),
);
const INTRO_NAME_TEXT = "SIWOO KIM";
const INTRO_LOAD_DURATION_MS = prefersReducedMotion.matches ? 180 : 2100;
const INTRO_REVEAL_DELAY_MS = prefersReducedMotion.matches ? 260 : 1500;

function buildIntroFlipName() {
  if (!introFlipName || introFlipName.childElementCount) {
    return;
  }

  let flipIndex = 0;

  [...INTRO_NAME_TEXT].forEach((character) => {
    if (character === " ") {
      const gap = document.createElement("span");
      gap.className = "intro-flip-gap";
      introFlipName.append(gap);
      return;
    }

    const cell = document.createElement("span");
    cell.className = "intro-flip-cell";
    cell.style.setProperty("--flip-index", String(flipIndex));
    cell.innerHTML = `
      <span class="intro-flip-card" aria-hidden="true">
        <span class="intro-flip-char">${character}</span>
      </span>
    `;

    introFlipName.append(cell);
    flipIndex += 1;
  });
}

function hideIntroOverlay() {
  if (!introOverlay) {
    return;
  }

  document.body.classList.remove("intro-active");
  introOverlay.classList.add("is-hidden");

  introOverlay.addEventListener(
    "transitionend",
    () => {
      introOverlay.setAttribute("hidden", "");
    },
    { once: true },
  );
}

function initializeIntro() {
  if (!introOverlay) {
    return;
  }

  buildIntroFlipName();

  if (prefersReducedMotion.matches) {
    introOverlay.style.setProperty("--intro-progress", "1");

    if (introProgressValue) {
      introProgressValue.textContent = "100%";
    }

    if (introProgressBar) {
      introProgressBar.style.transform = "scaleX(1)";
    }

    introOverlay.classList.add("is-complete");
    window.setTimeout(hideIntroOverlay, INTRO_REVEAL_DELAY_MS);
    return;
  }

  let startTime = null;

  function step(timestamp) {
    if (startTime === null) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / INTRO_LOAD_DURATION_MS, 1);
    const progressValue = Math.min(100, Math.floor(progress * 100));

    introOverlay.style.setProperty("--intro-progress", progress.toFixed(4));

    if (introProgressValue) {
      introProgressValue.textContent = `${progressValue}%`;
    }

    if (progress < 1) {
      window.requestAnimationFrame(step);
      return;
    }

    if (introProgressValue) {
      introProgressValue.textContent = "100%";
    }

    if (introProgressBar) {
      introProgressBar.style.transform = "scaleX(1)";
    }

    introOverlay.classList.add("is-complete");
    window.setTimeout(hideIntroOverlay, INTRO_REVEAL_DELAY_MS);
  }

  window.requestAnimationFrame(step);
}

function assignHeroSlide(slide, project) {
  slide.dataset.projectId = project.id;
  slide.querySelector(".hero-slide-image").style.backgroundImage = `url("${project.image}")`;
}

function shuffleItems(items) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[randomIndex]] = [nextItems[randomIndex], nextItems[index]];
  }

  return nextItems;
}

function buildHeroQueue(previousHeroId) {
  const nextQueue = shuffleItems(heroPool);

  if (nextQueue.length > 1 && previousHeroId && nextQueue[0].id === previousHeroId) {
    nextQueue.push(nextQueue.shift());
  }

  return nextQueue;
}

function getNextHeroProject() {
  if (!heroQueue.length) {
    heroQueue = buildHeroQueue(activeHeroId);
  }

  return heroQueue.shift();
}

function resetHeroImageAnimation(slide) {
  const heroImage = slide.querySelector(".hero-slide-image");
  heroImage.style.animation = "none";
  void heroImage.offsetWidth;
  heroImage.style.animation = "";
}

function showNextHeroSlide() {
  if (prefersReducedMotion.matches || heroSlides.length < 2 || heroPool.length < 2) {
    return;
  }

  const nextProject = getNextHeroProject();
  if (!nextProject) {
    return;
  }

  const nextSlideIndex = activeHeroSlideIndex === 0 ? 1 : 0;
  const activeSlide = heroSlides[activeHeroSlideIndex];
  const nextSlide = heroSlides[nextSlideIndex];

  nextSlide.classList.remove("is-active");
  assignHeroSlide(nextSlide, nextProject);
  resetHeroImageAnimation(nextSlide);
  void nextSlide.offsetWidth;

  window.requestAnimationFrame(() => {
    nextSlide.classList.add("is-active");
    activeSlide.classList.remove("is-active");
  });

  activeHeroId = nextProject.id;
  activeHeroSlideIndex = nextSlideIndex;
}

function initializeHeroSlideshow() {
  if (!heroSlides.length) {
    return;
  }

  const initialProject = getNextHeroProject();
  if (!initialProject) {
    return;
  }

  activeHeroSlideIndex = 0;
  heroSlides.forEach((slide) => slide.classList.remove("is-active"));
  assignHeroSlide(heroSlides[0], initialProject);
  activeHeroId = initialProject.id;

  window.requestAnimationFrame(() => {
    heroSlides[0].classList.add("is-active");
  });
}

function getProjectsByCategory(category) {
  return projects.filter((project) => project.categories.includes(category));
}

function renderGallery(category) {
  const filteredProjects = getProjectsByCategory(category);
  const categoryLabel = categoryMeta[category]?.label || "";

  galleryDrawerLabel.textContent = categoryLabel;
  projectSubmenuList.innerHTML = filteredProjects
    .map(
      (project) => `
        <button class="project-submenu-item" type="button" data-project-id="${project.id}">
          ${project.title}
        </button>
      `,
    )
    .join("");

  workGrid.innerHTML = filteredProjects
    .map(
      (project) => `
        <button class="work-card ${project.layout}" type="button" data-project-id="${project.id}">
          <img src="${project.image}" alt="${project.alt}" loading="lazy" />
          <span class="work-card-copy">
            <p>${project.type} / ${project.year}</p>
            <h3>${project.title}</h3>
          </span>
        </button>
      `,
    )
    .join("");
}

function openGallery(category) {
  if (!categoryMeta[category]) {
    return;
  }

  activeGalleryCategory = category;
  renderGallery(category);
  galleryDrawer.classList.add("is-open");
  galleryDrawer.setAttribute("aria-hidden", "false");

  topbarTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.galleryCategory === category);
  });
}

function closeGallery() {
  activeGalleryCategory = null;
  galleryDrawer.classList.remove("is-open");
  galleryDrawer.setAttribute("aria-hidden", "true");
  topbarTabs.forEach((tab) => tab.classList.remove("is-active"));
}

function toggleGallery(category) {
  if (galleryDrawer.classList.contains("is-open") && activeGalleryCategory === category) {
    closeGallery();
    return;
  }

  openGallery(category);
}

function openLightbox(projectId, trigger) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) {
    return;
  }

  lightboxLastTrigger = trigger;
  lightboxImage.src = project.image;
  lightboxImage.alt = project.alt;
  lightboxMeta.textContent = `${project.type} / ${project.year}`;
  lightboxTitle.textContent = project.title;
  lightboxDescription.textContent = project.description;
  lightboxNotes.innerHTML = project.notes.map((note) => `<li>${note}</li>`).join("");

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (lightboxLastTrigger) {
    lightboxLastTrigger.focus();
  }
}

function openMenu() {
  closeGallery();
  menuOverlay.classList.add("is-open");
  menuOverlay.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  menuOverlay.classList.remove("is-open");
  menuOverlay.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (menuOverlay.classList.contains("is-open")) {
    closeMenu();
    return;
  }

  openMenu();
}

function wireInteractions() {
  menuToggle.addEventListener("click", toggleMenu);

  menuCloseButtons.forEach((button) => {
    button.addEventListener("click", closeMenu);
  });

  topbarTabs.forEach((button) => {
    button.addEventListener("click", () => {
      closeMenu();
      toggleGallery(button.dataset.galleryCategory);
    });
  });

  menuGalleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openGallery(button.dataset.galleryCategory);
      closeMenu();
    });
  });

  galleryCloseButtons.forEach((button) => {
    button.addEventListener("click", closeGallery);
  });

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeGallery();

      const target = document.getElementById(button.dataset.navTarget);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (button.classList.contains("menu-link")) {
        closeMenu();
      }
    });
  });

  workGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project-id]");
    if (!trigger) {
      return;
    }

    openLightbox(trigger.dataset.projectId, trigger);
  });

  projectSubmenuList.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project-id]");
    if (!trigger) {
      return;
    }

    openLightbox(trigger.dataset.projectId, trigger);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
      return;
    }

    if (event.key === "Escape" && menuOverlay.classList.contains("is-open")) {
      closeMenu();
      return;
    }

    if (event.key === "Escape" && galleryDrawer.classList.contains("is-open")) {
      closeGallery();
    }
  });
}

function observeSections() {
  const buttonsByTarget = new Map(
    menuScrollLinks.map((button) => [button.dataset.navTarget, button]),
  );
  const sections = Array.from(document.querySelectorAll("[data-section]"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const button = buttonsByTarget.get(entry.target.id);
        if (!button) {
          return;
        }

        if (entry.isIntersecting) {
          menuScrollLinks.forEach((menuLink) => menuLink.classList.remove("is-active"));
          button.classList.add("is-active");
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-20% 0px -30% 0px",
    },
  );

  sections.forEach((section) => observer.observe(section));
}

function updateHeroScrollState() {
  if (!homeSection) {
    return;
  }

  const rect = homeSection.getBoundingClientRect();
  const revealDistance = Math.max(window.innerHeight * 0.95, 1);
  const progress = Math.min(Math.max((-rect.top) / revealDistance, 0), 1);

  homeSection.style.setProperty("--hero-progress", progress.toFixed(4));
}

function queueHeroScrollState() {
  if (heroScrollTicking) {
    return;
  }

  heroScrollTicking = true;
  window.requestAnimationFrame(() => {
    heroScrollTicking = false;
    updateHeroScrollState();
  });
}

function wireHeroScrollState() {
  if (!homeSection) {
    return;
  }

  updateHeroScrollState();
  window.addEventListener("scroll", queueHeroScrollState, { passive: true });
  window.addEventListener("resize", queueHeroScrollState);
}

function wireHeroSlideshow() {
  heroSlides.forEach((slide) => {
    const heroImage = slide.querySelector(".hero-slide-image");
    if (!heroImage) {
      return;
    }

    heroImage.addEventListener("animationend", () => {
      if (!slide.classList.contains("is-active")) {
        return;
      }

      showNextHeroSlide();
    });
  });
}

wireInteractions();
observeSections();
wireHeroScrollState();
wireHeroSlideshow();
initializeHeroSlideshow();
initializeIntro();
