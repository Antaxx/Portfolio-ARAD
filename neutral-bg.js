/**
 * Neural/Constellation Background Effect
 * A subtle, performant particle system that adapts to day/night themes.
 */

class NeuralBackground {
    constructor() {
        this.canvas = document.getElementById('neural-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;
        this.mouse = { x: null, y: null, radius: 100 };

        this.colors = {
            day: {
                particle: 'rgba(255, 255, 255, 0.4)',
                line: 'rgba(255, 255, 255, 0.15)'
            },
            night: {
                particle: 'rgba(192, 192, 192, 0.4)',
                line: 'rgba(192, 192, 192, 0.15)'
            },
            arad: {
                particle: 'rgba(255, 255, 255, 0.6)',
                line: 'rgba(255, 255, 255, 0.2)'
            }
        };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.init());

        // Connect to mouse for subtle interaction if wanted
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    getThemeColors() {
        const isArad = document.body.classList.contains('is-arad-mode');
        if (isArad) return this.colors.arad;

        const isMoon = document.body.classList.contains('cursor-is-moon');
        return isMoon ? this.colors.night : this.colors.day;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const currentColors = this.getThemeColors();

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.canvas.width, this.canvas.height);
            this.particles[i].draw(this.ctx, currentColors.particle);

            // Look for neighbors
            for (let j = i; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = currentColors.line.replace('0.15', (0.15 * opacity).toFixed(2));
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(maxWidth, maxHeight) {
        this.x = Math.random() * maxWidth;
        this.y = Math.random() * maxHeight;
        this.vx = (Math.random() - 0.5) * 0.3; // Very slow speed
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
    }

    update(maxWidth, maxHeight) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > maxWidth) this.vx *= -1;
        if (this.y < 0 || this.y > maxHeight) this.vy *= -1;
    }

    draw(ctx, color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

// Initialize once ready
document.addEventListener('DOMContentLoaded', () => {
    new NeuralBackground();
});