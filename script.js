/* ============================================
   CONFIG — edit these as your business details change.
   Nothing else in this file needs to be touched.
   ============================================ */
const CONFIG = {
  EMAIL: "gasper.udovc@gmail.com",       // swap to your business email later
  LINKEDIN_URL: "https://linkedin.com/in/gu8138/", // double-check this is your exact profile URL
  FORM_ENDPOINT: "https://formspree.io/f/YOUR_FORM_ID", // replace after creating a free Formspree (or Web3Forms) form
};

/* ============================================
   LANGUAGE TOGGLE
   ============================================ */
const htmlRoot = document.getElementById("html-root");
const btnEN = document.getElementById("lang-en");
const btnSI = document.getElementById("lang-si");

function detectDefaultLang() {
  const saved = localStorage.getItem("lang");
  if (saved === "en" || saved === "si") return saved;
  const browserLang = (navigator.language || "en").toLowerCase();
  return browserLang.startsWith("sl") ? "si" : "en";
}

function applyLang(lang) {
  htmlRoot.setAttribute("lang-mode", lang);
  htmlRoot.setAttribute("lang", lang === "si" ? "sl" : "en");

  // swap text on elements that carry both data-en and data-si
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.innerHTML = text;
  });

  btnEN.setAttribute("aria-pressed", lang === "en");
  btnSI.setAttribute("aria-pressed", lang === "si");
  localStorage.setItem("lang", lang);
}

btnEN.addEventListener("click", () => applyLang("en"));
btnSI.addEventListener("click", () => applyLang("si"));

applyLang(detectDefaultLang());

/* ============================================
   MOBILE MENU
   ============================================ */
const menuBtn = document.getElementById("mobile-menu-btn");
const mobileNav = document.getElementById("mobile-nav");

menuBtn.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

/* ============================================
   EMAIL / LINKEDIN LINKS (driven by CONFIG)
   ============================================ */
document.getElementById("mailto-link").href = `mailto:${CONFIG.EMAIL}`;
document.getElementById("footer-mailto").href = `mailto:${CONFIG.EMAIL}`;
document.getElementById("footer-mailto").textContent = CONFIG.EMAIL;
document.getElementById("linkedin-link").href = CONFIG.LINKEDIN_URL;
document.getElementById("year").textContent = new Date().getFullYear();

/* ============================================
   CONTACT FORM SUBMISSION
   ============================================ */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  status.className = "form-status";

  if (CONFIG.FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
    // Fallback while no form backend is configured yet: open the user's email client instead.
    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;
    const subject = encodeURIComponent(`Website inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONFIG.EMAIL}?subject=${subject}&body=${body}`;
    return;
  }

  try {
    const response = await fetch(CONFIG.FORM_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      form.reset();
      status.textContent = "Thanks — I'll be in touch soon.";
      status.classList.add("success");
    } else {
      throw new Error("Form submission failed");
    }
  } catch (err) {
    status.textContent = "Something went wrong — please email me directly instead.";
    status.classList.add("error");
  }
});
