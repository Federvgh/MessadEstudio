/**
 * ANIMATED COUNTER
 * Counts up numbers when they come into viewport
 */

(function() {
    'use strict';

    // Counter animation function
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }

    // Format number with + if needed
    function formatNumber(num) {
        const element = document.querySelector('.stats-bar h3');
        if (!element) return num;

        const originalText = element.textContent;
        const hasPlus = originalText.includes('+');
        const hasPercent = originalText.includes('%');

        if (hasPlus) {
            return num + '+';
        } else if (hasPercent) {
            return num + '%';
        }
        return num;
    }

    // Intersection Observer to trigger animation when in view
    function initCounters() {
        const counters = document.querySelectorAll('.stats-bar h3');

        if (counters.length === 0) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';

                    // Get the target number from the text content
                    const text = entry.target.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));

                    if (!isNaN(number)) {
                        // Store original content
                        const hasPlus = text.includes('+');
                        const hasPercent = text.includes('%');

                        // Create a span for the counting number
                        const span = document.createElement('span');
                        span.className = 'counting';
                        entry.target.textContent = '';
                        entry.target.appendChild(span);

                        // Animate the counter
                        let current = 0;
                        const duration = 2000;
                        const increment = number / (duration / 16);

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= number) {
                                let finalText = Math.round(number).toString();
                                if (hasPlus) finalText += '+';
                                if (hasPercent) finalText += '%';
                                span.textContent = finalText;
                                clearInterval(timer);
                            } else {
                                span.textContent = Math.floor(current);
                            }
                        }, 16);
                    }
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounters);
    } else {
        initCounters();
    }

    // Lazy load images
    function initLazyLoad() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading
            lazyImages.forEach(img => {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            });
        } else {
            // Fallback for older browsers
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Initialize lazy loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLazyLoad);
    } else {
        initLazyLoad();
    }

})();
