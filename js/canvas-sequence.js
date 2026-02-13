/**
 * CanvasSequence - Apple-style high-performance scroll animation
 * Renders individual frames to a canvas for zero-latency seeking.
 */
class CanvasSequence {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.heroSection = document.querySelector('.hero-section') || document.querySelector('.homepage-hero');

        // Configuration
        this.frameCount = 80; // Adjusted based on standard sequence length
        this.basePath = 'assets/images/hero Section animation/sequence/frame_'; // Path to frames
        this.images = [];
        this.loadedCount = 0;

        this.currentFrame = 0;
        this.targetFrame = 0;

        this.init();
    }

    async init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Preload images
        await this.preloadImages();

        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.animate();
    }

    resize() {
        // High-DPI support
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.offsetWidth * dpr;
        this.canvas.height = this.canvas.offsetHeight * dpr;
        this.ctx.scale(dpr, dpr);
    }

    preloadImages() {
        const promises = [];
        for (let i = 1; i <= this.frameCount; i++) {
            const img = new Image();
            img.src = `${this.basePath}${String(i).padStart(3, '0')}.webp`; // Expecting WebP for better compression

            const promise = new Promise((resolve) => {
                img.onload = () => {
                    this.loadedCount++;
                    resolve();
                };
                img.onerror = resolve; // Continue even if one fails
            });

            this.images.push(img);
            promises.push(promise);
        }
        return Promise.all(promises);
    }

    handleScroll() {
        const rect = this.heroSection.getBoundingClientRect();
        const height = window.innerHeight;

        // Calculate progress (0 to 1)
        let progress = -rect.top / (rect.height - height * 0.5);
        progress = Math.min(Math.max(progress, 0), 0.99);

        this.targetFrame = Math.floor(progress * (this.frameCount - 1));
    }

    animate() {
        // Smooth interpolation for the frames (Apple-style fluidity)
        const diff = this.targetFrame - this.currentFrame;
        this.currentFrame += diff * 0.2; // Smoothness factor

        const frameIndex = Math.round(this.currentFrame);
        this.drawFrame(frameIndex);

        requestAnimationFrame(() => this.animate());
    }

    drawFrame(index) {
        if (!this.images[index] || !this.images[index].complete) return;

        const img = this.images[index];
        this.ctx.clearRect(0, 0, this.canvas.width / (window.devicePixelRatio || 1), this.canvas.height / (window.devicePixelRatio || 1));

        // Draw centered and contained
        const canvasW = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasH = this.canvas.height / (window.devicePixelRatio || 1);

        const imgRatio = img.width / img.height;
        const canvasRatio = canvasW / canvasH;

        let drawW, drawH;
        if (imgRatio > canvasRatio) {
            drawW = canvasW;
            drawH = canvasW / imgRatio;
        } else {
            drawH = canvasH;
            drawW = canvasH * imgRatio;
        }

        const x = (canvasW - drawW) / 2;
        const y = (canvasH - drawH) / 2;

        this.ctx.drawImage(img, x, y, drawW, drawH);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new CanvasSequence();
});
