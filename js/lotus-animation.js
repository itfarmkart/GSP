class LotusAnimation {
    constructor() {
        this.canvas = document.getElementById('lotus-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 150; // Fewer particles for a cleaner look
        this.loaded = false;
        this.startTime = null;
        this.animationActive = true;

        this.image = new Image();
        this.image.src = 'assets/images/lotus_petal.png'; // Use the petal image
        this.image.onload = () => {
            this.loaded = true;
            this.init();
        };

        // Resize handler
        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.cx = this.canvas.width / 2;
        this.cy = this.canvas.height / 2;
    }

    init() {
        this.startTime = Date.now();
        // Initial spawn - fewer but widespread to fill the screen
        for (let i = 0; i < 50; i++) {
            this.spawnParticle(true);
        }
        this.animate();
    }

    spawnParticle(initial = false) {
        if (!this.animationActive) return;

        // Spawn randomly in X/Y 
        const angle = Math.random() * Math.PI * 2;
        // Random radius from center, spread wide
        const radius = Math.random() * (window.innerWidth * 1.5);

        const x = Math.cos(angle) * (radius * 1.5);
        const y = Math.sin(angle) * (radius * 1.5);

        // Z depth: 
        // Initial: spread out from close to far
        // New spawns: start far back
        const z = initial ? 100 + Math.random() * 3000 : 3000 + Math.random() * 2000;

        // Velocity - Reduced speed as requested
        // Move towards viewer (decreasing Z)
        const vz = -(5 + Math.random() * 8); // Slower speed (was 15-40)

        const rotationSpeed = (Math.random() - 0.5) * 0.02; // Slower rotation

        this.particles.push({
            x: x,
            y: y,
            z: z,
            vz: vz,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: rotationSpeed,
            opacity: 0,
            scaleMult: 0.5 + Math.random() * 1.0 // Variation in size
        });
    }

    animate() {
        // Check duration constraint
        if (Date.now() - this.startTime > 2000) {
            this.animationActive = false;
            // Clear canvas and stop loop after fading out
            // "whole animation should not last more than 2 seconds" -> hard stop
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = 'source-over';

        // Sort particles by Z 
        this.particles.sort((a, b) => b.z - a.z);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update position
            p.z += p.vz;
            p.rotation += p.rotationSpeed;

            // Fade in quickly
            if (p.opacity < 1) p.opacity += 0.05;

            // Perspective projection
            const fov = 600;
            let scale = fov / (fov + p.z);

            // If behind camera or too close/big, remove
            if (p.z < -100 || scale > 10) {
                this.particles.splice(i, 1);

                if (this.animationActive && this.particles.length < this.maxParticles) {
                    this.spawnParticle();
                }
                continue;
            }

            // Project 3D -> 2D
            const screenX = this.cx + p.x * scale;
            const screenY = this.cy + p.y * scale;

            // Size
            const size = 150 * scale * p.scaleMult; // Base size for petal

            // Render
            if (size > 0) {
                this.ctx.save();
                this.ctx.translate(screenX, screenY);
                this.ctx.rotate(p.rotation);
                this.ctx.globalAlpha = p.opacity;

                // Draw image centered
                this.ctx.drawImage(this.image, -size / 2, -size / 2, size, size);

                this.ctx.restore();
            }
        }

        if (this.animationActive) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('lotus-canvas')) {
        const lotusAnim = new LotusAnimation();
        // Expose for testing
        window.lotusAnim = lotusAnim;
    }
});
