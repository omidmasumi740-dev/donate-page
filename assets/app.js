/* =========================================================
   File Organizer — Donate page logic
   Theme switch, language switch, donation modal (QR + copy),
   docs modal, reveal animations, toast.
   ========================================================= */
(function () {
  "use strict";

  var LS_THEME = "fo-theme";
  var LS_LANG = "fo-lang";
  var root = document.documentElement;

  /* ---------- storage helpers ---------- */
  function get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function set(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  /* ---------- theme ---------- */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    set(LS_THEME, theme);
  }
  function initTheme() {
    var saved = get(LS_THEME);
    if (saved === "light" || saved === "dark") return applyTheme(saved);
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
  document.getElementById("themeBtn").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  /* ---------- language ---------- */
  function t(key, lang) {
    var pack = window.I18N[lang] || window.I18N.en;
    return pack[key] != null ? pack[key] : (window.I18N.en[key] || key);
  }
  function applyLang(lang) {
    var dir = lang === "fa" ? "rtl" : "ltr";
    root.setAttribute("lang", lang);
    root.setAttribute("dir", dir);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"), lang);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"), lang);
    });

    document.title = t("page.title", lang);

    var label = document.querySelector("[data-lang-label]");
    if (label) label.textContent = lang === "en" ? "فا" : "EN";

    set(LS_LANG, lang);
    root.setAttribute("data-lang", lang);
  }
  function currentLang() { return root.getAttribute("data-lang") || "en"; }
  document.getElementById("langBtn").addEventListener("click", function () {
    applyLang(currentLang() === "en" ? "fa" : "en");
  });

  /* ---------- toast ---------- */
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  function toast(msg, ok) {
    toastEl.textContent = msg;
    toastEl.classList.toggle("is-error", ok === false);
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2400);
  }

  /* ---------- QR ---------- */
  function makeQR(text) {
    if (typeof window.qrcode !== "function" || !text) return "";
    try {
      var qr = window.qrcode(0, "M");
      qr.addData(text);
      qr.make();
      return qr.createSvgTag(6, 2);
    } catch (e) { return ""; }
  }

  /* ---------- copy ---------- */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject();
      } catch (e) { reject(e); }
    });
  }

  /* ---------- modal helpers ---------- */
  var lastFocused = null;
  function openModal(el) {
    lastFocused = document.activeElement;
    el.hidden = false;
    requestAnimationFrame(function () { el.classList.add("is-open"); });
    document.body.classList.add("modal-open");
    var focusable = el.querySelector("button, a[href], [tabindex]");
    if (focusable) focusable.focus();
  }
  function closeModal(el) {
    el.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    setTimeout(function () { el.hidden = true; }, 180);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  function closeAll() {
    document.querySelectorAll(".modal.is-open").forEach(closeModal);
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });
  document.querySelectorAll(".modal").forEach(function (m) {
    m.querySelectorAll("[data-close]").forEach(function (c) {
      c.addEventListener("click", function () { closeModal(m); });
    });
  });

  /* ---------- donation modal ---------- */
  var donateModal = document.getElementById("donateModal");
  var dmIcon = document.getElementById("dm-icon");
  var dmTitle = document.getElementById("dm-title");
  var dmNetwork = document.getElementById("dm-network");
  var dmQR = document.getElementById("dm-qr");
  var dmAddr = document.getElementById("dm-addr");
  var dmCopy = document.getElementById("dm-copy");
  var dmLink = document.getElementById("dm-link");
  var dmNote = document.getElementById("dm-note");
  var copyValue = "";

  function openDonate(key) {
    var cfg = (window.DONATE_CONFIG || {})[key];
    if (!cfg) return;
    var lang = currentLang();

    dmIcon.textContent = cfg.icon || "•";
    dmIcon.style.setProperty("--coin", cfg.color || "var(--accent)");
    dmTitle.textContent = cfg.name;
    dmNetwork.textContent = cfg.network || "";

    var value = cfg.address || cfg.link || "";
    copyValue = value;

    if (value) {
      dmQR.innerHTML = makeQR(value);
      dmQR.hidden = false;
      dmAddr.textContent = value;
      dmAddr.parentElement.hidden = false;
      dmCopy.disabled = false;
      dmCopy.textContent = t("modal.copy", lang);
      dmNote.textContent = t("modal.scanHint", lang);
    } else {
      dmQR.innerHTML = "";
      dmQR.hidden = true;
      dmAddr.textContent = "";
      dmAddr.parentElement.hidden = true;
      dmCopy.disabled = true;
      dmCopy.textContent = t("modal.copy", lang);
      dmNote.textContent = t("modal.comingSoon", lang);
    }

    if (cfg.link) {
      dmLink.href = cfg.link;
      dmLink.hidden = false;
    } else {
      dmLink.hidden = true;
    }

    openModal(donateModal);
  }

  document.querySelectorAll("[data-method]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openDonate(btn.getAttribute("data-method"));
    });
  });

  dmCopy.addEventListener("click", function () {
    if (!copyValue) return;
    var lang = currentLang();
    copyText(copyValue).then(function () {
      dmCopy.textContent = t("modal.copied", lang);
      dmCopy.classList.add("is-done");
      toast(t("toast.copied", lang), true);
      setTimeout(function () {
        dmCopy.textContent = t("modal.copy", lang);
        dmCopy.classList.remove("is-done");
      }, 1600);
    }).catch(function () {
      toast(t("toast.copyFail", lang), false);
    });
  });

  /* ---------- docs modal ---------- */
  var docsModal = document.getElementById("docsModal");
  document.querySelectorAll("[data-docs]").forEach(function (el) {
    el.addEventListener("click", function () { openModal(docsModal); });
  });

  /* ---------- reveal animations ---------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-animate]");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (i * 70) + "ms";
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- boot ---------- */
  initTheme();
  applyLang(get(LS_LANG) === "fa" ? "fa" : "en");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal);
  } else {
    initReveal();
  }
})();