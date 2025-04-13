// Audio files
const AUDIO_FILES = {
    hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571.wav', // Digital click
    scroll: 'https://assets.mixkit.co/active_storage/sfx/2564/2564.wav', // Sci-fi whoosh
    ambient: 'https://assets.mixkit.co/active_storage/sfx/2434/2434.wav', // Cyberpunk atmosphere
    activate: 'https://assets.mixkit.co/active_storage/sfx/2568/2568.wav' // UI activation
};

class AudioManager {
    constructor() {
        this.isMuted = localStorage.getItem('isMuted') === 'true';
        this.sounds = {};
        this.lastScrollTime = 0;
        this.scrollCooldown = 400; // ms between scroll sounds
        this.initialized = false;
        
        // Initialize audio system
        this.initializeAudio();
        this.setupEventListeners();
    }

    async initializeAudio() {
        try {
            // Define audio files
            const audioFiles = {
                hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571.wav',
                scroll: 'https://assets.mixkit.co/active_storage/sfx/2564/2564.wav',
                ambient: 'https://assets.mixkit.co/active_storage/sfx/2434/2434.wav',
                activate: 'https://assets.mixkit.co/active_storage/sfx/2568/2568.wav'
            };

            // Load all audio files
            for (const [key, url] of Object.entries(audioFiles)) {
                const audio = new Audio();
                audio.preload = 'auto';
                audio.src = url;
                
                // Set volumes
                if (key === 'ambient') {
                    audio.loop = true;
                    audio.volume = 0.1;
                } else if (key === 'hover') {
                    audio.volume = 0.15;
                } else if (key === 'scroll') {
                    audio.volume = 0.2;
                } else {
                    audio.volume = 0.25;
                }
                
                this.sounds[key] = audio;
            }

            this.initialized = true;
            console.log('Audio system initialized');

            // Set initial state
            if (this.isMuted) {
                this.muteAll();
            } else {
                this.unmuteAll();
            }

        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }

    setupEventListeners() {
        // Listen for sound toggle events
        document.addEventListener('soundToggle', (event) => {
            console.log('Sound toggle event received:', event.detail);
            this.isMuted = event.detail.isMuted;
            if (this.isMuted) {
                this.muteAll();
            } else {
                this.unmuteAll();
            }
        });

        // Add hover sound to interactive elements
        const interactiveElements = document.querySelectorAll(
            'button, .section h1, .section p, .scroll-indicator, .section-counter, .sound-toggle'
        );
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.playSound('hover'));
        });

        // Add scroll sound
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - this.lastScrollTime > this.scrollCooldown) {
                this.playSound('scroll');
                this.lastScrollTime = now;
            }
        });
    }

    muteAll() {
        console.log('Muting all sounds');
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    unmuteAll() {
        console.log('Unmuting all sounds');
        if (this.sounds.ambient) {
            this.sounds.ambient.play().catch(err => console.log('Could not play ambient sound:', err));
        }
    }

    playSound(soundName) {
        if (this.isMuted || !this.initialized || !this.sounds[soundName]) return;
        
        const sound = this.sounds[soundName];
        if (soundName !== 'ambient') {
            sound.currentTime = 0;
        }
        sound.play().catch(err => console.log(`Could not play ${soundName} sound:`, err));
    }
}

// Create a single instance of the audio manager
window.audioManager = new AudioManager(); 