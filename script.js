
/* =========================================
   GATHER — EVENT DISCOVERY
   Corrected JavaScript for your HTML/CSS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    // 1. PAGE LOADER
    const pageLoader = $("#pageLoader");

    function hidePageLoader() {
        if (!pageLoader) return;
        pageLoader.classList.add("done");
        setTimeout(() => pageLoader.remove(), 650);
    }

    hidePageLoader();
    window.addEventListener("load", hidePageLoader, { once: true });
    setTimeout(hidePageLoader, 1800);

    // 2. SAMPLE EVENT DATA
    const events = [
        {
            id: "creative-minds",
            title: "Creative Minds",
            category: "Arts",
            date: "NOVEMBER 18, 2026",
            location: "The Gallery Hall",
            description: "A gathering for makers, designers, and curious creative minds.",
            image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85"
        },
        {
            id: "sound-and-soul",
            title: "Sound & Soul",
            category: "Music",
            date: "NOVEMBER 22, 2026",
            location: "Riverside Open Grounds",
            description: "An evening of live music, good energy, and new connections.",
            image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85"
        },
        {
            id: "future-forward",
            title: "Future Forward",
            category: "Learning",
            date: "NOVEMBER 26, 2026",
            location: "Innovation Center",
            description: "Talks and conversations about ideas shaping tomorrow.",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=85"
        },
        {
            id: "community-table",
            title: "The Community Table",
            category: "Community",
            date: "DECEMBER 02, 2026",
            location: "The Common Room",
            description: "Meet your neighbors and share stories over a relaxed gathering.",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85"
        },
        {
            id: "art-after-hours",
            title: "Art After Hours",
            category: "Arts",
            date: "DECEMBER 06, 2026",
            location: "Modern Art Space",
            description: "Explore exhibitions, music, and unexpected creative moments.",
            image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85"
        },
        {
            id: "acoustic-garden",
            title: "Acoustic Garden",
            category: "Music",
            date: "DECEMBER 12, 2026",
            location: "Garden Pavilion",
            description: "An intimate outdoor music experience under the evening sky.",
            image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=85"
        }
    ];

    const eventsGrid = $("#eventsGrid");
    const eventSelect = $("#eventSelect");
    const emptyState = $("#emptyState");
    const searchInput = $("#eventSearch");
    const filterButtons = $$(".filter-chip");

    let activeCategory = "All";
    let searchTerm = "";

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function getFavorites() {
        try {
            return JSON.parse(
                localStorage.getItem("gather-favorites") || "[]"
            );
        } catch {
            return [];
        }
    }

    function renderEvents() {
        if (!eventsGrid) return;

        const favorites = getFavorites();

        const filtered = events.filter(event => {
            const matchesCategory =
                activeCategory === "All" ||
                event.category === activeCategory;

            const haystack =
                `${event.title} ${event.category} ${event.location} ${event.description}`.toLowerCase();

            return matchesCategory && haystack.includes(searchTerm);
        });

        eventsGrid.innerHTML = filtered.map((event, index) => `
      <article class="event-card"
        data-event-id="${escapeHTML(event.id)}"
        data-category="${escapeHTML(event.category)}"
        style="animation-delay:${index * 80}ms">

        <div class="card-image-wrap">
          <img
            class="card-image"
            src="${escapeHTML(event.image)}"
            alt="${escapeHTML(event.title)}"
            loading="lazy"
          >

          <span class="card-category">
            ${escapeHTML(event.category)}
          </span>

          <button
            class="favorite-button ${favorites.includes(event.id) ? "saved" : ""}"
            type="button"
            data-favorite="${escapeHTML(event.id)}"
            aria-label="Save ${escapeHTML(event.title)}"
            aria-pressed="${favorites.includes(event.id)}"
          >
            ${favorites.includes(event.id) ? "♥" : "♡"}
          </button>
        </div>

        <div class="card-info">
          <span class="card-date">
            ${escapeHTML(event.date)}
          </span>

          <div class="card-title-row">
            <h3 class="card-title">
              ${escapeHTML(event.title)}
            </h3>
            <span class="card-arrow">↗</span>
          </div>

          <p class="card-location">
            ⌖ ${escapeHTML(event.location)}
          </p>

          <button
            class="card-register"
            type="button"
            data-open-register
            data-event="${escapeHTML(event.title)}"
          >
            Register for this event ↗
          </button>
        </div>
      </article>
    `).join("");

        if (emptyState) {
            emptyState.hidden = filtered.length !== 0;
        }

        if (eventSelect) {
            const currentValue = eventSelect.value;

            eventSelect.innerHTML =
                '<option value="">Select an event</option>' +
                events.map(event => `
          <option value="${escapeHTML(event.title)}">
            ${escapeHTML(event.title)}
          </option>
        `).join("");

            if ([...eventSelect.options].some(
                option => option.value === currentValue
            )) {
                eventSelect.value = currentValue;
            }
        }
    }

    renderEvents();

    // 3. SEARCH
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            searchTerm = searchInput.value.trim().toLowerCase();
            renderEvents();
        });
    }

    // 4. CATEGORY FILTERS
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(item =>
                item.classList.remove("active")
            );

            button.classList.add("active");

            activeCategory = button.dataset.category || "All";

            renderEvents();
        });
    });

    $("#clearFilters")?.addEventListener("click", () => {
        activeCategory = "All";
        searchTerm = "";

        if (searchInput) searchInput.value = "";

        filterButtons.forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.category === "All"
            );
        });

        renderEvents();
    });

    // Press "/" to focus search.
    document.addEventListener("keydown", event => {
        const tag = document.activeElement?.tagName;

        if (
            event.key === "/" &&
            !["INPUT", "TEXTAREA", "SELECT"].includes(tag)
        ) {
            event.preventDefault();
            searchInput?.focus();
        }
    });

    // 5. FULL-SCREEN NAVIGATION MENU
    const menuToggle = $("#menuToggle");
    const menuOverlay = $("#menuOverlay");

    function setMenu(open) {
        if (!menuToggle || !menuOverlay) return;

        menuToggle.classList.toggle("active", open);
        menuOverlay.classList.toggle("open", open);

        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute(
            "aria-label",
            open ? "Close menu" : "Open menu"
        );

        menuOverlay.setAttribute("aria-hidden", String(!open));
        document.body.classList.toggle("menu-open", open);
    }

    menuToggle?.addEventListener("click", () => {
        setMenu(!menuOverlay.classList.contains("open"));
    });

    $$(".menu-overlay a").forEach(link => {
        link.addEventListener("click", () => setMenu(false));
    });

    // 6. STICKY HEADER
    const header = $(".site-header");
    const navLinks = $$(".nav-link");

    function updateHeaderOnScroll() {
        header?.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );
    }

    updateHeaderOnScroll();

    window.addEventListener(
        "scroll",
        updateHeaderOnScroll,
        { passive: true }
    );

    // 7. ACTIVE NAVIGATION INDICATOR
    const sections = ["home", "events", "about", "footer"]
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                navLinks.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            });
        }, {
            rootMargin: "-30% 0px -60% 0px"
        });

        sections.forEach(section =>
            sectionObserver.observe(section)
        );
    }

    // 8. DARK / LIGHT THEME
    const themeToggle = $("#themeToggle");
    const storedTheme = localStorage.getItem("gather-theme");

    if (storedTheme === "dark" || storedTheme === "light") {
        document.documentElement.setAttribute(
            "data-theme",
            storedTheme
        );
    }

    function updateThemeIcon() {
        if (!themeToggle) return;

        const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";

        themeToggle.innerHTML = isDark
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
            : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/></svg>';
    }

    updateThemeIcon();

    themeToggle?.addEventListener("click", () => {
        const nextTheme =
            document.documentElement.getAttribute("data-theme") === "dark"
                ? "light"
                : "dark";

        document.documentElement.setAttribute(
            "data-theme",
            nextTheme
        );

        localStorage.setItem("gather-theme", nextTheme);
        updateThemeIcon();
    });

    // 9. SCROLL REVEAL ANIMATIONS
    const revealElements = $$(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealElements.forEach(element =>
            revealObserver.observe(element)
        );
    } else {
        revealElements.forEach(element =>
            element.classList.add("in-view")
        );
    }

    // 10. FAVORITES
    eventsGrid?.addEventListener("click", event => {
        const button = event.target.closest("[data-favorite]");
        if (!button) return;

        const id = button.dataset.favorite;
        let favorites = getFavorites();

        if (favorites.includes(id)) {
            favorites = favorites.filter(item => item !== id);
            showToast("Removed from saved events");
        } else {
            favorites.push(id);
            showToast("Event saved to favorites");
        }

        localStorage.setItem(
            "gather-favorites",
            JSON.stringify(favorites)
        );

        renderEvents();
    });

    // 11. REGISTRATION DIALOG
    const registerDialog = $("#registerDialog");
    const dialogClose = $("#dialogClose");
    const registrationForm = $("#registrationForm");
    const formMessage = $("#formMessage");

    function openRegistration(eventName = "") {
        if (!registerDialog) return;

        if (eventSelect && eventName) {
            const matchingOption = [...eventSelect.options].find(
                option => option.value === eventName
            );

            if (matchingOption) {
                eventSelect.value = eventName;
            }
        }

        if (typeof registerDialog.showModal === "function") {
            if (!registerDialog.open) {
                registerDialog.showModal();
            }
        } else {
            registerDialog.setAttribute("open", "");
        }
    }

    function closeRegistration() {
        if (!registerDialog) return;

        if (
            typeof registerDialog.close === "function" &&
            registerDialog.open
        ) {
            registerDialog.close();
        } else {
            registerDialog.removeAttribute("open");
        }
    }

    document.addEventListener("click", event => {
        const trigger = event.target.closest("[data-open-register]");

        if (!trigger) return;

        event.preventDefault();

        openRegistration(trigger.dataset.event || "");
    });

    dialogClose?.addEventListener(
        "click",
        closeRegistration
    );

    registerDialog?.addEventListener("click", event => {
        if (event.target === registerDialog) {
            closeRegistration();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            setMenu(false);
        }
    });

    // 12. TOAST NOTIFICATIONS
    const toast = $("#toast");
    let toastTimer;

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    // 13. REGISTRATION FORM VALIDATION
    registrationForm?.addEventListener("submit", event => {
        event.preventDefault();

        const nameInput =
            registrationForm.elements.namedItem("name");

        const emailInput =
            registrationForm.elements.namedItem("email");

        const selectedEvent =
            registrationForm.elements.namedItem("event");

        [nameInput, emailInput, selectedEvent].forEach(input => {
            input?.classList.remove("invalid");
        });

        let message = "";

        if (
            !nameInput.value.trim() ||
            nameInput.value.trim().length < 2
        ) {
            nameInput.classList.add("invalid");
            message = "Please enter your full name (at least 2 characters).";
        } else if (!emailInput.checkValidity()) {
            emailInput.classList.add("invalid");
            message = "Please enter a valid email address.";
        } else if (!selectedEvent.value) {
            selectedEvent.classList.add("invalid");
            message = "Please choose an event.";
        }

        if (message) {
            if (formMessage) {
                formMessage.textContent = message;
            }
            return;
        }

        const registration = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            event: selectedEvent.value,
            attendees:
            registrationForm.elements.namedItem("attendees").value,
            registeredAt: new Date().toISOString()
        };

        let registrations = [];

        try {
            registrations = JSON.parse(
                localStorage.getItem("gather-registrations") || "[]"
            );
        } catch {
            registrations = [];
        }

        registrations.push(registration);

        localStorage.setItem(
            "gather-registrations",
            JSON.stringify(registrations)
        );

        registrationForm.reset();

        if (formMessage) {
            formMessage.textContent = "";
        }

        closeRegistration();

        showToast("You're registered! Your place is saved.");
    });

    registrationForm?.querySelectorAll(
        "input, select"
    ).forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("invalid");

            if (formMessage) {
                formMessage.textContent = "";
            }
        });

        input.addEventListener("change", () => {
            input.classList.remove("invalid");

            if (formMessage) {
                formMessage.textContent = "";
            }
        });
    });

    // 14. BACK TO TOP
    const backToTop = $("#backToTop");

    window.addEventListener("scroll", () => {
        backToTop?.classList.toggle(
            "visible",
            window.scrollY > 500
        );
    }, { passive: true });

    backToTop?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 15. SMOOTH ANCHOR LINKS
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const target = $(link.getAttribute("href"));

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            if (menuOverlay?.classList.contains("open")) {
                setMenu(false);
            }
        });
    });

    console.log("Gather initialized successfully.");
});
