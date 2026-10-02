// ACADEMIA FÁBRICA — interações e navegação
const numeroWhatsApp = "5551989580651";
const instagramAcademia = "https://www.instagram.com/academiafabrica1/";

function abrirWhatsApp(mensagem) {
    const texto = encodeURIComponent(mensagem);
    const link = `https://wa.me/${numeroWhatsApp}?text=${texto}`;
    window.open(link, "_blank", "noopener,noreferrer");
}

function comprarProduto(produto) {
    abrirWhatsApp(`Olá! Vim pelo site da Academia Fábrica e gostaria de saber mais sobre o produto: ${produto}.`);
}

function comprarPlano(plano) {
    abrirWhatsApp(`Olá! Vim pelo site da Academia Fábrica e gostaria de saber mais sobre o ${plano}.`);
}

function falarWhatsApp() {
    abrirWhatsApp("Olá! Vim pelo site da Academia Fábrica e gostaria de conhecer melhor a academia.");
}

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    if (!header) return;

    // Indicador discreto de progresso da página
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    const updateScrollUI = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    updateScrollUI();
    window.addEventListener("scroll", updateScrollUI, { passive: true });
    window.addEventListener("resize", updateScrollUI);

    // Menu mobile acessível, usando os mesmos links da navegação desktop
    const nav = header.querySelector(".nav");
    if (nav) {
        const toggle = document.createElement("button");
        toggle.className = "mobile-menu-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-label", "Abrir menu");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", "mobile-nav-panel");
        toggle.innerHTML = "<span></span><span></span>";

        const panel = document.createElement("div");
        panel.className = "mobile-nav-panel";
        panel.id = "mobile-nav-panel";
        [...nav.querySelectorAll("a")].forEach((link) => {
            const clone = link.cloneNode(true);
            clone.addEventListener("click", () => closeMenu());
            panel.appendChild(clone);
        });

        function closeMenu() {
            panel.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Abrir menu");
        }
        toggle.addEventListener("click", () => {
            const isOpen = toggle.getAttribute("aria-expanded") !== "true";
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
            panel.classList.toggle("is-open", isOpen);
        });
        header.appendChild(toggle);
        header.appendChild(panel);
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });
        document.addEventListener("click", (event) => {
            if (!header.contains(event.target)) closeMenu();
        });
    }

    // Entradas suaves por seção, sem esconder conteúdo se não houver suporte
    const revealTargets = document.querySelectorAll(
        ".hero-content, .hero-image, .section-heading, .about-card, .plan-card, " +
        ".product-card, .benefit, .benefits-content, .cta > div, .cta > button, " +
        ".localizacao-titulo, .localizacao-conteudo, .footer-top"
    );
    revealTargets.forEach((element, index) => {
        element.classList.add("js-reveal");
        const siblingIndex = element.parentElement
            ? [...element.parentElement.children].indexOf(element)
            : index;
        if (siblingIndex >= 1 && siblingIndex <= 4) {
            element.dataset.revealDelay = String(siblingIndex);
        }
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("IntersectionObserver" in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
        revealTargets.forEach((element) => observer.observe(element));
    } else {
        revealTargets.forEach((element) => element.classList.add("is-visible"));
    }

    // Parallax mínimo no destaque principal: só em dispositivos com mouse
    const heroImage = document.querySelector(".hero-image");
    if (heroImage) {
        const orbit = document.createElement("div");
        orbit.className = "hero-orbit";
        orbit.setAttribute("aria-hidden", "true");
        heroImage.appendChild(orbit);
    }
    if (heroImage && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
        heroImage.addEventListener("pointermove", (event) => {
            const rect = heroImage.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            heroImage.style.setProperty("--hero-x", `${x * -12}px`);
            heroImage.style.setProperty("--hero-y", `${y * -12}px`);
        });
        heroImage.addEventListener("pointerleave", () => {
            heroImage.style.setProperty("--hero-x", "0px");
            heroImage.style.setProperty("--hero-y", "0px");
        });
    }

    // Tilt 3D sutil nos cards, sem interferir no toque ou no celular
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
        document.querySelectorAll(".product-card, .plan-card").forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                card.style.setProperty("--rx", `${y * -3}deg`);
                card.style.setProperty("--ry", `${x * 3}deg`);
            });
            card.addEventListener("pointerleave", () => {
                card.style.setProperty("--rx", "0deg");
                card.style.setProperty("--ry", "0deg");
            });
        });
    }
});
