class UIManager {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.updateSectionVisibility();
        this.setupSoundToggle();
        this.totalSections = document.querySelectorAll('.section').length;
    }

    initializeElements() {
        this.cursor = document.querySelector('.cursor');
        this.progressBar = document.querySelector('.progress');
        this.sectionCounter = document.querySelector('.section-counter');
        this.sections = document.querySelectorAll('.section');
        this.soundToggle = document.querySelector('.sound-toggle');
        this.currentSection = 0;
        this.isMuted = false;

        // Set initial counter
        this.sectionCounter.textContent = `1/${this.sections.length}`;

        // Add padding to the content to prevent overflow
        const content = document.querySelector('.content');
        if (content) {
            content.style.paddingBottom = '100vh';
        }
    }

    setupEventListeners() {
        // Cursor movement
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', () => this.cursor.classList.add('active'));
        document.addEventListener('mouseup', () => this.cursor.classList.remove('active'));

        // Interactive elements cursor effect
        const interactiveElements = document.querySelectorAll(
            'button, .section h1, .section p, .scroll-indicator, .section-counter'
        );
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('active'));
        });

        // Scroll handling with debounce
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateSectionVisibility();
                this.updateProgress();
            }, 10);
        });

        // Section hover effects
        this.sections.forEach(section => {
            section.addEventListener('mousemove', (e) => {
                if (!section.classList.contains('visible')) return;
                
                const rect = section.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                section.style.setProperty('--mouse-x', `${x}px`);
                section.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    setupSoundToggle() {
        if (!this.soundToggle) return;

        // Set initial state
        this.isMuted = localStorage.getItem('isMuted') === 'true';
        this.updateSoundToggleState();

        // Add click handler
        this.soundToggle.addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            localStorage.setItem('isMuted', this.isMuted);
            this.updateSoundToggleState();

            // Dispatch custom event for audio manager
            const event = new CustomEvent('soundToggle', { detail: { isMuted: this.isMuted } });
            document.dispatchEvent(event);
        });

        // Add to interactive elements
        this.soundToggle.addEventListener('mouseenter', () => this.cursor.classList.add('active'));
        this.soundToggle.addEventListener('mouseleave', () => this.cursor.classList.remove('active'));
    }

    updateSoundToggleState() {
        if (this.isMuted) {
            this.soundToggle.classList.add('muted');
            this.soundToggle.querySelector('span').textContent = 'Muted';
        } else {
            this.soundToggle.classList.remove('muted');
            this.soundToggle.querySelector('span').textContent = 'Sound';
        }
    }

    updateSectionVisibility() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        // Calculate which section should be visible
        let newSection = Math.min(
            Math.floor((scrollY + windowHeight * 0.5) / windowHeight),
            this.sections.length - 1
        );
        
        // Clamp the section number between 0 and total sections - 1
        newSection = Math.max(0, Math.min(newSection, this.sections.length - 1));
        
        if (newSection !== this.currentSection) {
            this.currentSection = newSection;
            this.sections.forEach((section, index) => {
                if (index === this.currentSection) {
                    section.classList.add('visible');
                } else {
                    section.classList.remove('visible');
                }
            });
        }

        // Update counter (1-based for display)
        this.sectionCounter.textContent = `${this.currentSection + 1}/${this.sections.length}`;
    }

    updateProgress() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((scrollY / maxScroll) * 100, 100);
        this.progressBar.style.width = `${progress}%`;
    }
}

export default UIManager; 