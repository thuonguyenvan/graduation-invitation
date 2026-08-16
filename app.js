/**
 * Application Logic for Graduation Invitation
 * Nguyễn Văn Thương - graduation 29/08/2026
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const envelopeContainer = document.getElementById('envelope-container');
    const openEnvelopeBtn = document.getElementById('open-envelope-btn');
    const mainInvitation = document.getElementById('main-invitation');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isFirstPlay = true;

    // Parse guest name from URL (e.g. ?to=Anh+Tuan or ?guest=Anh+Tuan)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to') || urlParams.get('guest');
    if (guestName) {
        const cleanName = guestName.trim();
        if (cleanName) {
            document.querySelectorAll('.guest-name').forEach(el => {
                el.textContent = cleanName;
            });
        }
    }

    const isAutoScroll = urlParams.get('autoscroll') === 'true';

    // 1. ENVELOPE OPENING ACTION
    if (openEnvelopeBtn) {
        openEnvelopeBtn.addEventListener('click', () => {
            // Add 'opened' state to trigger flap/paper CSS transition
            envelopeContainer.classList.add('opened');
            
            // Try to play music automatically (user interaction allows audio play)
            playMusic();
            
            // Wait for envelope animation to finish (approx 1.5s)
            setTimeout(() => {
                envelopeContainer.classList.add('fade-out');
                
                // Show invitation main block and show music toggle button
                setTimeout(() => {
                    envelopeContainer.style.display = 'none';
                    mainInvitation.classList.remove('hidden');
                    musicToggle.classList.remove('hidden');
                    
                    // Trigger scroll check for header
                    triggerScrollReveal();
                    
                    // Celebratory firework burst!
                    for(let i=0; i < 5; i++) {
                        setTimeout(() => {
                            createExplosion(
                                Math.random() * window.innerWidth,
                                Math.random() * (window.innerHeight * 0.6) + (window.innerHeight * 0.1)
                            );
                        }, i * 300);
                    }

                    // Trigger smooth auto-slide for recording
                    if (isAutoScroll) {
                        setTimeout(startAutoSlide, 2000);
                    }
                }, 800); // fadeOut transition duration
            }, 1600);
        });
    }

    function startAutoSlide() {
        const slides = [
            document.querySelector('.hero-section'),
            document.querySelector('.invitation-msg'),
            document.querySelector('.time-section'),
            document.querySelector('.map-section')
        ];
        
        mainInvitation.classList.add('slide-mode');
        
        let currentSlideIndex = 0;
        const timings = [1000, 6000, 2000, 2000]; // 1s, 6s, 2s, 2s
        
        function showSlide(index) {
            slides.forEach(slide => {
                if (slide) slide.classList.remove('slide-active');
            });
            
            if (slides[index]) {
                slides[index].classList.add('slide-active');
            }
        }
        
        function nextSlide() {
            showSlide(currentSlideIndex);
            
            const delay = timings[currentSlideIndex];
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            
            setTimeout(nextSlide, delay);
        }
        
        nextSlide();
    }

    // Auto-open envelope on load if autoscroll is enabled
    if (isAutoScroll && openEnvelopeBtn) {
        setTimeout(() => {
            openEnvelopeBtn.click();
        }, 1500);
    }

    // 2. BACKGROUND MUSIC CONTROLS
    function playMusic() {
        if (isFirstPlay) {
            bgMusic.currentTime = 134; // Start at 2:14
            isFirstPlay = false;
        }
        bgMusic.play().then(() => {
            musicToggle.querySelector('.music-icon.playing').classList.remove('hidden');
            musicToggle.querySelector('.music-icon.paused').classList.add('hidden');
        }).catch(err => {
            console.log("Auto-play blocked by browser. Audio will play when user toggles.", err);
        });
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                playMusic();
            } else {
                bgMusic.pause();
                musicToggle.querySelector('.music-icon.playing').classList.add('hidden');
                musicToggle.querySelector('.music-icon.paused').classList.remove('hidden');
            }
        });
    }

    // 3. COUNTDOWN TIMER
    // Target date: Saturday, August 29, 2026 at 10:00:00 AM (Vietnam timezone GMT+7)
    const targetDate = new Date('2026-08-29T10:00:00+07:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        const daysSpan = document.getElementById('days');
        const hoursSpan = document.getElementById('hours');
        const minutesSpan = document.getElementById('minutes');
        const secondsSpan = document.getElementById('seconds');

        if (difference < 0) {
            // Target date passed
            if (daysSpan) daysSpan.innerText = '00';
            if (hoursSpan) hoursSpan.innerText = '00';
            if (minutesSpan) minutesSpan.innerText = '00';
            if (secondsSpan) secondsSpan.innerText = '00';
            
            const countdownTitle = document.querySelector('.countdown-title');
            if (countdownTitle) {
                countdownTitle.innerText = "LỄ TỐT NGHIỆP ĐANG DIỄN RA / ĐÃ DIỄN RA 🎉";
            }
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysSpan) daysSpan.innerText = String(days).padStart(2, '0');
        if (hoursSpan) hoursSpan.innerText = String(hours).padStart(2, '0');
        if (minutesSpan) minutesSpan.innerText = String(minutes).padStart(2, '0');
        if (secondsSpan) secondsSpan.innerText = String(seconds).padStart(2, '0');
    }

    // Update once immediately, then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 4. SCROLL REVEAL EFFECT
    function triggerScrollReveal() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('appear');
                        // Optional: unobserve after showing
                        // observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            });

            animatedElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers
            function checkScroll() {
                animatedElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const viewHeight = window.innerHeight;
                    if (rect.top <= viewHeight * 0.85 && rect.bottom >= 0) {
                        el.classList.add('appear');
                    }
                });
            }
            window.addEventListener('scroll', checkScroll);
            checkScroll(); // run once initial
        }
    }

    // 5. CANVAS FIREWORKS SYSTEM
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    
    // Set Canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            
            // Random direction, speed
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 6 + 2;
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity;
            
            this.radius = Math.random() * 2.5 + 1.2;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.012;
            this.gravity = 0.08;
            this.friction = 0.98;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            
            this.x += this.vx;
            this.y += this.vy;
            
            this.alpha -= this.decay;
        }
    }

    function createExplosion(x, y) {
        const colors = [
            '#D4AF37', // Gold
            '#F3E5AB', // Gold light
            '#4fc3f7', // DUT Blue light
            '#2196f3', // Blue
            '#ffffff', // White
            '#ffeb3b', // Yellow
            '#e91e63'  // Celebration Pink
        ];
        
        // Spawn 40-60 particles per explosion
        const count = Math.floor(Math.random() * 25) + 35;
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        
        for (let i = 0; i < count; i++) {
            // Mix of random colors and theme-based
            const color = Math.random() > 0.45 ? baseColor : colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, color));
        }
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Use semi-transparent background to create trail effect
        ctx.fillStyle = 'rgba(10, 25, 47, 0.2)';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles = particles.filter(p => {
            if (p.alpha <= 0) return false;
            p.update();
            p.draw();
            return true;
        });
    }
    animate();

    // Trigger explosion on canvas click for fun
    window.addEventListener('click', (e) => {
        // Only trigger if envelope is gone
        if (mainInvitation.classList.contains('hidden')) return;
        
        // Do not trigger if clicking buttons or forms
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('a') || e.target.closest('.gallery-item')) return;
        
        createExplosion(e.clientX, e.clientY);
    });

    // 6. (RSVP & Photo Modal logic removed)
});
