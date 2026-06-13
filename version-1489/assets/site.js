(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var heroIndex = 0;
    var timer = null;

    function setHero(index) {
        if (!slides.length) {
            return;
        }

        heroIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === heroIndex);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === heroIndex);
        });
    }

    function startHero() {
        if (timer) {
            window.clearInterval(timer);
        }

        if (slides.length > 1) {
            timer = window.setInterval(function () {
                setHero(heroIndex + 1);
            }, 5600);
        }
    }

    if (slides.length) {
        setHero(0);
        startHero();

        if (prev) {
            prev.addEventListener('click', function () {
                setHero(heroIndex - 1);
                startHero();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                setHero(heroIndex + 1);
                startHero();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                setHero(dotIndex);
                startHero();
            });
        });
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var filterItems = Array.prototype.slice.call(document.querySelectorAll('[data-search-text]'));

    function applyFilter(value) {
        var keyword = String(value || '').trim().toLowerCase();

        filterItems.forEach(function (item) {
            var text = item.getAttribute('data-search-text') || '';
            item.classList.toggle('hidden-by-filter', keyword && text.toLowerCase().indexOf(keyword) === -1);
        });
    }

    if (filterInput && filterItems.length) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';

        if (q) {
            filterInput.value = q;
        }

        applyFilter(filterInput.value);

        filterInput.addEventListener('input', function () {
            applyFilter(filterInput.value);
        });
    }
})();
