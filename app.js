/**
 * ARAD Portfolio Core Logic
 * Includes: Smooth Scroll (Lenis), Animations (GSAP)
 */




document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');
    const mobileBar1 = document.getElementById('mobile-bar-1');
    const mobileBar2 = document.getElementById('mobile-bar-2');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('hidden');
            navLinksContainer.classList.toggle('flex');

            // Hamburger animation
            if (navLinksContainer.classList.contains('flex')) {
                mobileBar1.style.transform = 'translateY(4px) rotate(45deg)';
                mobileBar2.style.transform = 'translateY(-4px) rotate(-45deg)';
            } else {
                mobileBar1.style.transform = 'none';
                mobileBar2.style.transform = 'none';
            }
        });

        // Close menu when a link is clicked (on mobile)
        const mobileLinks = navLinksContainer.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    navLinksContainer.classList.add('hidden');
                    navLinksContainer.classList.remove('flex');
                    mobileBar1.style.transform = 'none';
                    mobileBar2.style.transform = 'none';
                }
            });
        });
    }

    // 1. Initialize Lenis (Smooth Scroll)
    let lenis;
    if (typeof Lenis !== 'undefined') {
        try {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
            });

            function raf(time) {
                if (lenis) lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        } catch (e) {
            console.error('Lenis initialization failed:', e);
        }
    } else {
        console.warn('Lenis is not defined. Smooth scroll disabled.');
    }

    // Smooth Scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(target, {
                        offset: -100,
                        duration: 1.5,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    if (typeof gsap !== 'undefined') {
        try {
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }

            // 2. Hero Title Animation
            const title = document.getElementById('main-arad-title');
            if (title) {
                // Surgical extraction: get the logo and the text separately
                const logoSpan = title.querySelector('.logo-title-container');

                // Get only direct text content (like "RAD") ignoring any HTML/Alt
                const remainingText = Array.from(title.childNodes)
                    .filter(node => node.nodeType === 3) // Text node
                    .map(node => node.textContent)
                    .join('')
                    .trim();

                title.innerHTML = '';

                if (logoSpan) {
                    logoSpan.classList.add('char', 'inline-block', 'opacity-0', 'translate-y-12');
                    title.appendChild(logoSpan);
                }

                remainingText.split('').forEach(char => {
                    const span = document.createElement('span');
                    span.innerHTML = char === ' ' ? '&nbsp;' : char;
                    span.className = 'char inline-block opacity-0 translate-y-12';
                    title.appendChild(span);
                });

                if (typeof gsap !== 'undefined') {
                    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
                    tl.to('.char', { opacity: 1, y: 0, stagger: 0.04, duration: 0.6, delay: 0.1 })
                        .fromTo('.reveal-up', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 }, "-=0.4")
                        .fromTo('#main-arad-title', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.6, duration: 2, ease: "expo.out" }, "-=1");
                } else {
                    // Fallback if GSAP is missing
                    document.querySelectorAll('.char').forEach(c => {
                        c.style.opacity = '1';
                        c.style.transform = 'none';
                    });
                    document.querySelectorAll('.reveal-up').forEach(r => {
                        r.style.opacity = '1';
                        r.style.transform = 'none';
                    });
                }
            }

            // 3. Scroll-Based Theme Transitions
            ScrollTrigger.create({
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    const p = self.progress;
                    if (p < 0.5) {
                        document.body.classList.remove('cursor-is-moon');
                    } else {
                        document.body.classList.add('cursor-is-moon');
                    }
                }
            });

            // 5. Active Navbar Link Highlighting
            const sections = document.querySelectorAll('section[id], footer[id]');
            const navLinks = document.querySelectorAll('#nav-links a[href^="#"]');

            if (sections.length > 0 && navLinks.length > 0) {
                const observerOptions = {
                    root: null,
                    rootMargin: '-20% 0px -75% 0px', // Trigger slightly above middle for better feel
                    threshold: 0
                };

                const sectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const currentId = entry.target.getAttribute('id');
                            navLinks.forEach(link => {
                                link.classList.remove('active-nav-link');
                                if (link.getAttribute('href') === `#${currentId}`) {
                                    link.classList.add('active-nav-link');
                                }
                            });
                        }
                    });
                }, observerOptions);

                sections.forEach(sec => sectionObserver.observe(sec));
            }


            // 4. Custom Cursor
            const cursor = document.getElementById('custom-cursor');
            const cursorText = document.getElementById('cursor-text');
            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let cursorX = mouseX;
            let cursorY = mouseY;

            if (cursor && window.matchMedia("(min-width: 768px)").matches) {

                gsap.to(cursor, { opacity: 1, duration: 0.5 });
                window.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                });

                gsap.ticker.add(() => {
                    cursorX += (mouseX - cursorX) * 0.15;
                    cursorY += (mouseY - cursorY) * 0.15;
                    gsap.set(cursor, { x: cursorX, y: cursorY });
                });

                document.querySelectorAll('a, button, .magnetic, article').forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        const text = el.getAttribute('data-cursor-text') || (el.tagName === 'ARTICLE' ? 'VOIR' : '');
                        cursor.classList.add('cursor-hovering');
                        if (text) {
                            if (cursorText) {
                                cursorText.innerText = text;
                                cursorText.style.opacity = 1;
                            }
                        }
                    });
                    el.addEventListener('mouseleave', () => {
                        cursor.classList.remove('cursor-hovering');
                        if (cursorText) cursorText.style.opacity = 0;
                    });
                });
            }
        } catch (e) {
            console.error('GSAP/Animations initialization failed:', e);
        }
    }



    // 6. Magnetic Elements
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            if (typeof gsap === 'undefined') return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.5 });
        });
        el.addEventListener('mouseleave', () => {
            if (typeof gsap === 'undefined') return;
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out' });
        });
    });

    // 7. Team Card 3D Tilt - REMOVED

    // 8. Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const animateCounter = (counter) => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // milliseconds
            const startTime = performance.now();
            let hasPercent = counter.innerText.includes('%');
            let hasPlusH = counter.innerText.includes('+') && counter.innerText.includes('h');

            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                // easeOutQuad
                const easeProgress = progress * (2 - progress);

                const currentVal = Math.floor(easeProgress * target);

                if (hasPercent) {
                    counter.innerText = currentVal + '%';
                } else if (hasPlusH) {
                    counter.innerText = '+' + currentVal + 'h';
                } else {
                    counter.innerText = Math.floor(easeProgress * target);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (hasPercent) {
                        counter.innerText = target + '%';
                    } else if (hasPlusH) {
                        counter.innerText = '+' + target + 'h';
                    } else {
                        counter.innerText = target;
                    }
                }
            };

            requestAnimationFrame(updateCounter);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // 9. Pourquoi Carousel Scroll Indicator
    const pourquoiGrid = document.querySelector('#pourquoi .grid');
    const pourquoiProgress = document.getElementById('pourquoi-scroll-progress');
    
    if (pourquoiGrid && pourquoiProgress) {
        pourquoiGrid.addEventListener('scroll', () => {
            const scrollLeft = pourquoiGrid.scrollLeft;
            const scrollWidth = pourquoiGrid.scrollWidth - pourquoiGrid.clientWidth;
            const progress = (scrollLeft / scrollWidth) * 100;
            pourquoiProgress.style.width = `${Math.max(25, progress)}%`;
        });
    }

    // 10. Equipe Carousel Scroll Indicator
    const equipeGrid = document.querySelector('#histoire .grid');
    const equipeProgress = document.getElementById('equipe-scroll-progress');
    
    if (equipeGrid && equipeProgress) {
        equipeGrid.addEventListener('scroll', () => {
            const scrollLeft = equipeGrid.scrollLeft;
            const scrollWidth = equipeGrid.scrollWidth - equipeGrid.clientWidth;
            const progress = (scrollLeft / scrollWidth) * 100;
            equipeProgress.style.width = `${Math.max(25, progress)}%`;
        });
    }

});
