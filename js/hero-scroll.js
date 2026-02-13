/**
 * HeroScroll - Replicates Apple-style scroll-driven video animations
 * Maps the scroll progress of the hero section to the video's timeline.
 */
class HeroScroll {
    constructor() {
        this.video = document.querySelector('.hero-logo-large video');
        this.heroSection = document.querySelector('.hero-section') || document.querySelector('.homepage-hero');

        if (!this.video || !this.heroSection) return;

        this.scrollProgress = 0;
        this.targetTime = 0;
        this.isLoaded = false;

        this.init();
    }

    init() {
        // Ensure the video is loaded so we have the duration
        if (this.video.readyState >= 1) {
            this.onMetadataLoaded();
        } else {
            this.video.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
        }

        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.animate();
    }

    onMetadataLoaded() {
        this.isLoaded = true;
        this.video.pause(); // We control the playback manually
    }

    handleScroll() {
        if (!this.isLoaded) return;

        const rect = this.heroSection.getBoundingClientRect();
        const height = window.innerHeight;

        // Calculate how much of the hero is scrolled past
        // progress goes from 0 to 1 as hero scrolls up
        let progress = -rect.top / (rect.height - height * 0.5);
        progress = Math.min(Math.max(progress, 0), 0.99); // Stay within bounds

        this.targetTime = progress * this.video.duration;
    }

    animate() {
        if (this.isLoaded) {
            // Smoothly interpolate towards target time for that "fluid" feel
            const diff = this.targetTime - this.video.currentTime;
            this.video.currentTime += diff * 0.15; // Adjustment factor for smoothness
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when ready
document.addEventListener('DOMContentLoaded', () => {
    new HeroScroll();
});
