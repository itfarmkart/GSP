// Timeline Animation Logic
document.addEventListener('DOMContentLoaded', () => {
    initTimeline();
});

function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineLine = document.querySelector('.timeline-line-progress');

    if (timelineItems.length === 0) return;

    // Animate items on scroll
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2
    });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Animate center line on scroll
    window.addEventListener('scroll', () => {
        const timelineSection = document.querySelector('.timeline-section');
        if (!timelineSection) return;

        const rect = timelineSection.getBoundingClientRect();
        const height = timelineSection.offsetHeight;
        const top = rect.top;
        const windowHeight = window.innerHeight;

        // Calculate progress based on scroll position relative to timeline section
        let progress = 0;

        if (top < windowHeight / 2) {
            const scrolled = (windowHeight / 2) - top;
            progress = (scrolled / height) * 100;
        }

        progress = Math.min(Math.max(progress, 0), 100);

        if (timelineLine) {
            timelineLine.style.height = `${progress}%`;
        }
    });
}
