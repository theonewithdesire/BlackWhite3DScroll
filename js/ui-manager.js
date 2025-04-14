class UIManager {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupSoundToggle();
        this.setupParticleEffects();
        
        // Initial state setup
        this.updateSectionCounter(1);
        this.addScrollGuide();
        this.updateProgress();
    }

    initializeElements() {
        this.cursor = document.querySelector('.cursor');
        this.progressBar = document.querySelector('.progress-bar');
        this.sectionCounter = document.querySelector('.section-counter');
        this.sections = document.querySelectorAll('.section');
        this.soundToggle = document.querySelector('.sound-toggle');
        this.totalSections = this.sections.length;
        this.currentVisibleSectionIndex = 1; // Start from 1
        this.isMuted = false;

        // Add minimal padding to prevent scroll issues
        const content = document.querySelector('.content');
        if (content) {
            content.style.paddingBottom = '10vh';
        }

        // Make first section visible by default
        const firstSection = this.sections[0];
        if (firstSection) {
            firstSection.classList.add('visible');
        }
    }

    addScrollGuide() {
        const guide = document.createElement('div');
        guide.className = 'scroll-guide';
        guide.innerHTML = `
            <div class="scroll-text">Scroll to explore</div>
            <div class="scroll-arrow">↓</div>
        `;
        document.body.appendChild(guide);

        // Hide guide on first scroll interaction
        const hideGuide = () => {
            if (guide) {
                guide.style.opacity = '0';
                setTimeout(() => guide.remove(), 500);
            }
            window.removeEventListener('scroll', hideGuide, { once: true });
        };
        // Use { once: true } for cleaner removal
        window.addEventListener('scroll', hideGuide, { once: true });
    }

    setupEventListeners() {
        // Cursor movement
        document.addEventListener('mousemove', (e) => {
            if (this.cursor) {
                // Added requestAnimationFrame for performance
                window.requestAnimationFrame(() => {
                    this.cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                });
            }
        });

        document.addEventListener('mousedown', () => this.cursor?.classList.add('active'));
        document.addEventListener('mouseup', () => this.cursor?.classList.remove('active'));

        // Scroll listener ONLY for progress bar update
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
            scrollTimeout = window.requestAnimationFrame(() => {
                this.updateProgress();
            });
        }, { passive: true }); // Use passive listener for performance

        // Initial progress update on load
        window.addEventListener('load', () => this.updateProgress());

        // Interactive elements cursor effect
        const interactiveElements = document.querySelectorAll(
            'button, .section h1, .section p, .scroll-indicator, .section-counter, .sound-toggle'
        );
        interactiveElements.forEach(el => {
            el?.addEventListener('mouseenter', () => this.cursor?.classList.add('hover'));
            el?.addEventListener('mouseleave', () => this.cursor?.classList.remove('hover'));
        });

        // Section hover effects (optional, keep if needed)
        this.sections.forEach(section => {
            section.addEventListener('mousemove', (e) => {
                const rect = section.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                section.style.setProperty('--mouse-x', `${x}px`);
                section.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    showSectionContent(section) {
        // The .visible class added by the observer triggers CSS animations
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-20% 0px',
            threshold: [0.3, 0.7]
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const targetElement = entry.target;
                // Parse the data-index attribute and convert to number
                const targetIndex = parseInt(targetElement.getAttribute('data-index'));
                
                if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                    targetElement.classList.add('visible');
                    // Only update counter if we have a valid index
                    if (!isNaN(targetIndex)) {
                        this.updateSectionCounter(targetIndex);
                    }
                }
            });
        }, options);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateSectionCounter(index) {
        if (this.sectionCounter && index > 0 && index <= this.totalSections) {
            this.currentVisibleSectionIndex = index;
            const formattedIndex = String(index).padStart(2, '0');
            const formattedTotal = String(this.totalSections).padStart(2, '0');
            this.sectionCounter.textContent = `${formattedIndex}/${formattedTotal}`;
            
            // Trigger counter animation
            this.sectionCounter.classList.remove('update');
            void this.sectionCounter.offsetWidth; // Force reflow
            this.sectionCounter.classList.add('update');
        }
    }

    updateProgress() {
        if (!this.progressBar) return;
        
        const scrollY = window.scrollY;
        // Adjust scrollHeight calculation if needed, consider body or html
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
        
        // Use transform for potentially smoother animation
        this.progressBar.style.transform = `scaleX(${Math.max(0, Math.min(100, progress)) / 100})`;
        this.progressBar.style.transformOrigin = 'left'; // Ensure scaling starts from left
    }

    setupSoundToggle() {
        if (!this.soundToggle) return;

        this.isMuted = localStorage.getItem('isMuted') === 'true';
        this.updateSoundToggleState();

        this.soundToggle.addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            localStorage.setItem('isMuted', this.isMuted);
            this.updateSoundToggleState();
            document.dispatchEvent(new CustomEvent('soundToggle', { detail: { isMuted: this.isMuted } }));
        });
    }

    updateSoundToggleState() {
        const textSpan = this.soundToggle?.querySelector('span');
        if (this.isMuted) {
            this.soundToggle?.classList.add('muted');
            if(textSpan) textSpan.textContent = 'Muted';
        } else {
            this.soundToggle?.classList.remove('muted');
            if(textSpan) textSpan.textContent = 'Sound';
        }
    }

    setupParticleEffects() {
        // Implementation of setupParticleEffects method
    }
}

export default UIManager; 