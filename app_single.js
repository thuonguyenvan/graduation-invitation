/**
 * Application Logic for Single-Page Graduation Invitation
 * Nguyễn Văn Thương - graduation 29/08/2026
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const envelopeContainer = document.getElementById('envelope-container');
    const openEnvelopeBtn = document.getElementById('open-envelope-btn');
    const mainInvitation = document.getElementById('main-invitation');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const navItems = document.querySelectorAll('.nav-item');
    const cards = document.querySelectorAll('.info-card');

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

    // 1. ENVELOPE OPENING ACTION
    if (openEnvelopeBtn) {
        openEnvelopeBtn.addEventListener('click', () => {
            envelopeContainer.classList.add('opened');
            playMusic();
            
            setTimeout(() => {
                envelopeContainer.classList.add('fade-out');
                
                setTimeout(() => {
                    envelopeContainer.style.display = 'none';
                    mainInvitation.classList.remove('hidden');
                    musicToggle.classList.remove('hidden');
                    
                    // Trigger canvas resize
                    resizeCanvas();
                    
                    // Firework burst!
                    for(let i=0; i < 5; i++) {
                        setTimeout(() => {
                            createExplosion(
                                Math.random() * window.innerWidth,
                                Math.random() * (window.innerHeight * 0.5) + (window.innerHeight * 0.1)
                            );
                        }, i * 300);
                    }
                }, 800);
            }, 2700);
        });
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
    const targetDate = new Date('2026-08-29T10:00:00+07:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        const daysSpan = document.getElementById('days');
        const hoursSpan = document.getElementById('hours');
        const minutesSpan = document.getElementById('minutes');
        const secondsSpan = document.getElementById('seconds');

        if (difference < 0) {
            if (daysSpan) daysSpan.innerText = '00';
            if (hoursSpan) hoursSpan.innerText = '00';
            if (minutesSpan) minutesSpan.innerText = '00';
            if (secondsSpan) secondsSpan.innerText = '00';
            
            const countdownTitle = document.querySelector('.countdown-title');
            if (countdownTitle) countdownTitle.innerText = "LỄ TỐT NGHIỆP ĐANG DIỄN RA 🎉";
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
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 4. MOBILE NAVIGATION TAB SWITCHING
    navItems.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            navItems.forEach(item => item.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');

            // Slide cards: index comparison creates directional slide
            cards.forEach((card, cardIndex) => {
                card.classList.remove('active', 'prev');
                if (card.id === targetId) {
                    card.classList.add('active');
                } else if (cardIndex < index) {
                    card.classList.add('prev');
                }
            });

            // Trigger canvas sparks for feedback
            createExplosion(window.innerWidth / 2, window.innerHeight * 0.4);
        });
    });

    // 5. CANVAS FIREWORKS SYSTEM
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

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
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 1.5;
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity;
            this.radius = Math.random() * 2.2 + 1;
            this.alpha = 1;
            this.decay = Math.random() * 0.018 + 0.015;
            this.gravity = 0.06;
            this.friction = 0.98;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 4;
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
        const colors = ['#D4AF37', '#F3E5AB', '#4fc3f7', '#2196f3', '#ffffff', '#ffeb3b'];
        const count = Math.floor(Math.random() * 20) + 25;
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        
        for (let i = 0; i < count; i++) {
            const color = Math.random() > 0.45 ? baseColor : colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => {
            if (p.alpha <= 0) return false;
            p.update();
            p.draw();
            return true;
        });
    }
    animate();

    window.addEventListener('click', (e) => {
        if (mainInvitation.classList.contains('hidden')) return;
        if (e.target.closest('button') || e.target.closest('a')) return;
        createExplosion(e.clientX, e.clientY);
    });
});
