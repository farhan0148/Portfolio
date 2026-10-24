// Initialize Lucide Icons
lucide.createIcons();

// Read the project journey chronologically, from the earliest milestone onward.
(function orderProjectTimeline() {
    const track = document.querySelector('.timeline-journey-track');
    if (!track) return;

    const nodes = Array.from(track.querySelectorAll('.timeline-journey-node'));
    nodes.sort((first, second) => first.dataset.date.localeCompare(second.dataset.date));

    nodes.forEach((node, index) => {
        node.classList.toggle('left-step', index % 2 === 0);
        node.classList.toggle('right-step', index % 2 !== 0);
        track.appendChild(node);
    });
})();

// Navbar transitions on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const scrollCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Once it's revealed, we don't need to observe it anymore
            observer.unobserve(entry.target);
        }
    });
};

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver(scrollCallback, observerOptions);

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Legacy generic scroll carousel if present on case study sub-pages
function scrollCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    const scrollAmount = 424;
    track.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// ==========================================
// Daring Interactive Projects Carousel Controller
// ==========================================
(function initProjectsCarousel() {
    const track = document.getElementById('projectsTrack');
    if (!track) return;

    const prevBtn = document.getElementById('projectPrevBtn');
    const nextBtn = document.getElementById('projectNextBtn');
    const counterCurrent = document.getElementById('carouselCurrent');
    const counterTotal = document.getElementById('carouselTotal');
    const progressFill = document.getElementById('carouselProgress');
    const pillButtons = document.querySelectorAll('#projectPills .pill-btn');
    const cards = track.querySelectorAll('.fun-card');

    if (!cards.length) return;

    const totalCount = cards.length;
    if (counterTotal) {
        counterTotal.textContent = String(totalCount).padStart(2, '0');
    }

    // Scroll by card offset
    function scrollToCardIndex(index) {
        const clampedIndex = Math.max(0, Math.min(index, totalCount - 1));
        const targetCard = cards[clampedIndex];
        if (targetCard) {
            const cardOffset = targetCard.offsetLeft - track.offsetLeft;
            track.scrollTo({
                left: cardOffset,
                behavior: 'smooth'
            });
        }
    }

    // Determine current index based on track scrollLeft
    function getActiveCardIndex() {
        let activeIdx = 0;
        let minDiff = Infinity;
        const currentScroll = track.scrollLeft;

        cards.forEach((card, idx) => {
            const cardOffset = card.offsetLeft - track.offsetLeft;
            const diff = Math.abs(currentScroll - cardOffset);
            if (diff < minDiff) {
                minDiff = diff;
                activeIdx = idx;
            }
        });
        return activeIdx;
    }

    // Update active UI
    function updateCarouselState() {
        const activeIdx = getActiveCardIndex();

        // Update counter if present
        if (counterCurrent) {
            counterCurrent.textContent = String(activeIdx + 1).padStart(2, '0');
        }
    }

    // Arrow navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const curr = getActiveCardIndex();
            scrollToCardIndex(curr - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const curr = getActiveCardIndex();
            scrollToCardIndex(curr + 1);
        });
    }

    // Scroll listener with debounce/rAF
    let scrollTimer = null;
    track.addEventListener('scroll', () => {
        if (scrollTimer) cancelAnimationFrame(scrollTimer);
        scrollTimer = requestAnimationFrame(updateCarouselState);
    });

    // Keyboard navigation when hovering/focused on track
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            const curr = getActiveCardIndex();
            scrollToCardIndex(curr + 1);
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            const curr = getActiveCardIndex();
            scrollToCardIndex(curr - 1);
            e.preventDefault();
        }
    });

    // Drag-to-scroll interaction for daring UX feel
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeftStart = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        // Snap nicely to nearest card after releasing drag
        setTimeout(() => {
            const nearest = getActiveCardIndex();
            scrollToCardIndex(nearest);
        }, 50);
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5; // multiplier
        track.scrollLeft = scrollLeftStart - walk;
    });

    // Initial state
    updateCarouselState();
})();

// ==========================================
// Interactive Skills Filter Controller
// ==========================================
(function initSkillsFilter() {
    const tabButtons = document.querySelectorAll('#skillsFilterNav .skill-tab-btn');
    const cards = document.querySelectorAll('#skillsGrid .skill-group-card');

    if (!tabButtons.length || !cards.length) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Toggle active tab button
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards with smooth opacity transition
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(12px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
})();

// Re-initialize icons if using Lucide
if (window.lucide) {
    lucide.createIcons();
}