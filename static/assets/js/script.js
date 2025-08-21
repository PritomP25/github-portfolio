/* ===== Utilities ===== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ===== Mobile nav toggle ===== */
const navToggle = $(".nav-toggle");
const nav = $("#nav");
if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        const expanded = nav.getAttribute("aria-expanded") === "true";
        nav.setAttribute("aria-expanded", String(!expanded));
        navToggle.setAttribute("aria-expanded", String(!expanded));
    });

    // Close on link click (mobile)
    $$("#nav a").forEach((a) =>
        a.addEventListener("click", () => {
            nav.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-expanded", "false");
        })
    );
}

/* ===== Smooth scroll ===== */
$$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", id);
    });
});

/* ===== Carousels (Experience & Projects) ===== */
function setupCarousel(el) {
    const track = $(".carousel-track", el);
    const prev = $(".carousel-nav.prev", el);
    const next = $(".carousel-nav.next", el);

    // Keyboard scroll
    track.setAttribute("tabindex", "0");

    const itemWidth = () =>
        track.firstElementChild?.getBoundingClientRect().width || 300;
    const gap = parseFloat(getComputedStyle(track).gap || "0");

    const snapNext = () =>
        track.scrollBy({ left: itemWidth() + gap, behavior: "smooth" });
    const snapPrev = () =>
        track.scrollBy({ left: -(itemWidth() + gap), behavior: "smooth" });

    prev.addEventListener("click", snapPrev);
    next.addEventListener("click", snapNext);

    // Hide buttons if not scrollable
    const updateNav = () => {
        const maxScrollLeft = track.scrollWidth - track.clientWidth - 1;
        prev.style.visibility = track.scrollLeft <= 0 ? "hidden" : "visible";
        next.style.visibility =
            track.scrollLeft >= maxScrollLeft ? "hidden" : "visible";
    };
    track.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    updateNav();
}

$$(".carousel").forEach(setupCarousel);

/* ===== Theme toggle (light/dark) ===== */
const themeBtn = $("#themeBtn");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
const getTheme = () =>
    localStorage.getItem("theme") || (prefersLight.matches ? "light" : "dark");
const applyTheme = (t) =>
    document.documentElement.setAttribute(
        "data-theme",
        t === "light" ? "light" : "dark"
    );
applyTheme(getTheme());

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const current = getTheme();
        const next = current === "light" ? "dark" : "light";
        localStorage.setItem("theme", next);
        applyTheme(next);
    });
}

/* ===== Footer year & "useless" button ===== */
$("#year").textContent = new Date().getFullYear();

const uselessBtn = $(".useless-btn");
if (uselessBtn) {
    uselessBtn.addEventListener("click", () => {
        const msgs = [
            "You found the useless button!",
            "Achievement unlocked.",
            "Absolutely nothing happened.",
            "Still useless. Proud of it.",
            "Beep boop.",
        ];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        uselessBtn.textContent = msg;
        setTimeout(() => (uselessBtn.textContent = "Useless Button"), 1800);
    });
}

/* ===== Accessibility niceties ===== */
document.addEventListener("keydown", (e) => {
    // Left/Right to control last focused carousel
    const activeCarousel = document.activeElement?.closest(".carousel") || null;
    if (!activeCarousel) return;
    const key = e.key.toLowerCase();
    if (key === "arrowright") {
        $(".carousel-nav.next", activeCarousel)?.click();
    }
    if (key === "arrowleft") {
        $(".carousel-nav.prev", activeCarousel)?.click();
    }
});
