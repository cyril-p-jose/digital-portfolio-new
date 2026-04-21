/* =====================================================
   ASHIK MADHU — PORTFOLIO | script.js
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initVantaBackground();
    initCustomCursor();
    initScrollProgress();
    initNavbarScroll();
    initMobileMenu();
    initTypingEffect();
    initSectionReveal();
    initContactForm();
});

/* ---------- 1. VANTA 3D BACKGROUND ---------- */
function initVantaBackground() {
    if (window.VANTA && window.VANTA.NET) {
        VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xff8c00, // Accent Orange
            backgroundColor: 0x050505, // Dark Bg
            points: 12.00,
            maxDistance: 22.00,
            spacing: 16.00
        });
    }
}

/* ---------- 2. CUSTOM CURSOR ---------- */
function initCustomCursor() {
    const dot = document.querySelector(".cursor-dot");
    const inner = document.querySelector(".cursor-inner");

    if (!dot || !inner) return;

    window.addEventListener("mousemove", (e) => {
        dot.style.top = `${e.clientY}px`;
        dot.style.left = `${e.clientX}px`;
        
        // slight delay for inner to follow
        setTimeout(() => {
            inner.style.top = `${e.clientY}px`;
            inner.style.left = `${e.clientX}px`;
        }, 50);
    });

    // Hover effect on interactable elements
    const hoverables = document.querySelectorAll("a, button, .project-card, .skill-item-icon");
    hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            dot.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
            dot.classList.remove("cursor-hover");
        });
    });
}

/* ---------- 3. SCROLL PROGRESS ---------- */
function initScrollProgress() {
    const progressBar = document.querySelector(".scroll-progress");
    if (!progressBar) return;

    window.addEventListener("scroll", () => {
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollAmount = window.scrollY;
        const progress = (scrollAmount / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

/* ---------- 4. NAVBAR SCROLL EFFECT ---------- */
function initNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}

/* ---------- 5. MOBILE MENU ---------- */
function initMobileMenu() {
    const toggleBtn = document.querySelector(".mobile-toggle");
    const menu = document.querySelector(".mobile-menu");
    const links = document.querySelectorAll(".mobile-menu a");

    if (!toggleBtn || !menu) return;

    toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("active");
        menu.classList.toggle("active");
    });

    links.forEach(link => {
        link.addEventListener("click", () => {
            toggleBtn.classList.remove("active");
            menu.classList.remove("active");
        });
    });
}

/* ---------- 6. TYPING EFFECT ---------- */
function initTypingEffect() {
    const typingEl = document.getElementById("typing-text");
    if (!typingEl) return;

    const rawText = typingEl.getAttribute("data-default") || "Developer | Problem Solver | Learner";
    const roles = rawText.split("|").map(s => s.trim());
    
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingTimer;

    function type() {
        const currentRole = roles[currentRoleIndex];
        
        if (isDeleting) {
            currentCharIndex--;
            typingEl.textContent = currentRole.substring(0, currentCharIndex);
        } else {
            currentCharIndex++;
            typingEl.textContent = currentRole.substring(0, currentCharIndex);
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && currentCharIndex === currentRole.length) {
            typeSpeed = 2000; // pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typeSpeed = 500; // pause before next word
        }

        typingTimer = setTimeout(type, typeSpeed);
    }

    typingTimer = setTimeout(type, 1000);
}

/* ---------- 7. SECTION REVEAL ---------- */
function initSectionReveal() {
    const reveals = document.querySelectorAll(".section-reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

/* ---------- 8. CONTACT FORM & TOASTS ---------- */
function initContactForm() {
    const form = document.getElementById("portfolio-contact");
    const container = document.getElementById("toast-container");

    if (!form || !container) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = document.getElementById("contact-submit");
        const btnText = document.getElementById("contact-btn-text");

        // Get values
        const name = document.getElementById("user_name").value.trim();
        const email = document.getElementById("user_email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Basic validation
        if (!name || !email || !message) {
            showToast("Please fill in all required fields.", "error");
            return;
        }

        // Disable button while sending
        const originalText = btnText.innerHTML;
        btnText.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            const response = await fetch("https://formsubmit.co/ajax/cyrilpjose2025@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            });

            if (response.ok) {
                showToast(`Thank you, ${name}! Your message has been sent.`, "success");
                form.reset();
            } else {
                throw new Error("Network response was not ok.");
            }
        } catch (error) {
            showToast("Sorry! There was an issue sending your message.", "error");
        } finally {
            // Re-enable button
            btnText.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        const icon = type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle";
        const color = type === "success" ? "var(--accent-green)" : "var(--accent-orange)";

        toast.innerHTML = `
            <i class="${icon}" style="color: ${color}; font-size: 20px;"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.classList.add("fade-out");
            toast.addEventListener("transitionend", () => toast.remove());
        }, 4000);
    }
}

/* ---------- 9. ADMIN ROUTING (Optional) ---------- */
window.handleAdminRouting = function() {
    // Basic redirect to an admin dashboard placeholder if needed
    // window.location.href = "admin.html";
    alert("Admin access feature is ready to be connected to a backend dashboard.");
};
