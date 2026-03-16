document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic (Refined & Smoothed)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;

    // Smooth movement factors (0-1: higher is faster/more reactive)
    const dotSmoothing = 0.35; 
    const outlineSmoothing = 0.12;

    // Particle Trail System
    let particleCount = 0;
    const maxParticles = 50;

    function createParticle(x, y) {
        if (particleCount >= maxParticles) return;

        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        document.body.appendChild(particle);
        particleCount++;

        setTimeout(() => {
            particle.remove();
            particleCount--;
        }, 800);
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Create particle trail immediately on mouse move
        createParticle(mouseX, mouseY);
    });

    // Unified Smooth Animation Loop
    function animateCursors() {
        // Linear Interpolation (LERP) for both dot and circle
        if (cursorDot) {
            dotX += (mouseX - dotX) * dotSmoothing;
            dotY += (mouseY - dotY) * dotSmoothing;
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
        }

        if (cursorOutline) {
            outlineX += (mouseX - outlineX) * outlineSmoothing;
            outlineY += (mouseY - outlineY) * outlineSmoothing;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }

        requestAnimationFrame(animateCursors);
    }

    // Initialize animation loop
    animateCursors();

    // 2. Staggered Animation for Tiles
    const tiles = document.querySelectorAll('.bento-tile');
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.style.opacity = '1';
            tile.style.transform = 'translateY(0)';
        }, index * 150);
    });

    // 3. Project Card Click Handlers
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if user clicked on a link directly
            if (e.target.tagName === 'A') return;

            const liveLink = card.querySelector('a[href*="http"]:not([href*="github"])');
            const githubLink = card.querySelector('a[href*="github"]');

            // Prefer Live link, fallback to GitHub
            const targetLink = liveLink || githubLink;

            if (targetLink) {
                window.open(targetLink.href, '_blank');
            }
        });
    });

    // 4. Interactive Fluid Gradient Animation (Original section 3, now 4)
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Orb {
            constructor(color) {
                this.radius = (Math.random() * 150) + 200; // Extra large for liquid feel
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Base velocity
                this.dx = (Math.random() - 0.5) * 1.5;
                this.dy = (Math.random() - 0.5) * 1.5;
                this.color = color;

                // For organic pulse
                this.baseRadius = this.radius;
                this.angle = Math.random() * Math.PI * 2;
                this.pulseSpeed = 0.02;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }

            update() {
                // Organic movement (pulse size)
                this.angle += this.pulseSpeed;
                this.radius = this.baseRadius + Math.sin(this.angle) * 20;

                // Mouse Interaction (Liquid Repulsion)
                // Calculate distance to mouse
                const dxMouse = mouseX - this.x;
                const dyMouse = mouseY - this.y;
                const distance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                const interactionRadius = 400;

                if (distance < interactionRadius) {
                    // Move away from mouse
                    const forceDirectionX = dxMouse / distance;
                    const forceDirectionY = dyMouse / distance;
                    const force = (interactionRadius - distance) / interactionRadius;
                    const directionX = forceDirectionX * force * 3; // Push strength
                    const directionY = forceDirectionY * force * 3;

                    this.x -= directionX;
                    this.y -= directionY;
                }

                // Bounce off walls
                if (this.x + this.radius > canvas.width) this.dx = -Math.abs(this.dx);
                if (this.x - this.radius < 0) this.dx = Math.abs(this.dx);
                if (this.y + this.radius > canvas.height) this.dy = -Math.abs(this.dy);
                if (this.y - this.radius < 0) this.dy = Math.abs(this.dy);

                // Constant ambient movement
                this.x += this.dx;
                this.y += this.dy;

                this.draw();
            }
        }

        let orbs = [];
        function init() {
            orbs = [];
            // Create theme-colored liquid blobs
            orbs.push(new Orb('#FF2E63')); // Pink
            orbs.push(new Orb('#FF9F1C')); // Orange
            orbs.push(new Orb('#FF2E63')); // Pink
            orbs.push(new Orb('#FF9F1C')); // Orange
            orbs.push(new Orb('#6C1BF9')); // Deep Purple accent for depth
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Screen blend mode for glowing look
            ctx.globalCompositeOperation = 'screen';

            for (let i = 0; i < orbs.length; i++) {
                orbs[i].update();
            }

            ctx.globalCompositeOperation = 'source-over';
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        init();
        animate();
    }

    // 5. Name Scramble/Glitch Effect (Hrituraj Roy)
    const firstName = document.getElementById('name-text');
    const surname = document.getElementById('surname-text');
    const headerName = document.getElementById('header-name');

    if (firstName && surname) {
        // Aesthetic tech characters (Katakana + Glyphs)
        const randomChars = "XYZ0123456789/<>[]{}—=+*^?#________";

        const scrambleElement = (element, originalText) => {
            let iterations = 0;

            const interval = setInterval(() => {
                element.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        // If we've passed this index, show the real letter
                        if (index < iterations) {
                            return originalText[index];
                        }
                        // Otherwise show a random cool character
                        return randomChars[Math.floor(Math.random() * randomChars.length)];
                    })
                    .join("");

                // Stop when done
                if (iterations >= originalText.length) {
                    clearInterval(interval);
                    element.innerText = originalText;
                }

                // Tuned speed: slow start, then accelerates
                iterations += 1 / 3;
            }, 30); // Faster update rate (30ms) for smoother scramble
        }

        const triggerScramble = () => {
            // Reveal text container
            firstName.style.opacity = '1';
            surname.style.opacity = '1';

            // Stagger animations slightly for 'flowing' feel
            scrambleElement(firstName, "Hrituraj");
            setTimeout(() => {
                scrambleElement(surname, "Roy");
            }, 100);
        };

        // Run on load with start delay
        setTimeout(triggerScramble, 800);
    }

    // 6. Global View Counter (All Users + Every Reload)
    const viewCountElement = document.getElementById('view-count');
    if (viewCountElement) {
        viewCountElement.innerText = "---"; 

        const namespace = 'hrituraj-final-global';
        const key = 'visit-count';

        // Increment globally on every reload
        fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                const globalCount = data.count || 0;
                
                // Odometer Animation
                const duration = 2000;
                let startTimestamp = null;

                const animate = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(eased * globalCount);
                    viewCountElement.innerText = current.toLocaleString();
                    
                    if (progress < 1) requestAnimationFrame(animate);
                    else viewCountElement.innerText = globalCount.toLocaleString();
                };
                setTimeout(() => requestAnimationFrame(animate), 300);
            })
            .catch(err => {
                console.error('Global Counter Error:', err);
                // Fallback to local if API is blocked by user's network
                let fallback = parseInt(localStorage.getItem('pfolio_v3_fallback') || "0") + 1;
                localStorage.setItem('pfolio_v3_fallback', fallback);
                viewCountElement.innerText = fallback.toLocaleString();
                viewCountElement.style.opacity = "0.7"; 
            });
    }
});
