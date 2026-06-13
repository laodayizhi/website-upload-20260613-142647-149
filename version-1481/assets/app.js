(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    });

    function normalize(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    document.querySelectorAll('[data-search-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-filter-input]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

        if (!input || !cards.length) {
            return;
        }

        input.addEventListener('input', function () {
            var term = normalize(input.value);
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                card.hidden = term.length > 0 && text.indexOf(term) === -1;
            });
        });
    });

    document.querySelectorAll('[data-filter-row]').forEach(function (row) {
        var scope = row.closest('main') || document;
        var chips = Array.prototype.slice.call(row.querySelectorAll('[data-filter-chip]'));
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var value = chip.getAttribute('data-filter-chip');
                chips.forEach(function (item) {
                    item.classList.toggle('active', item === chip);
                });
                cards.forEach(function (card) {
                    var text = card.getAttribute('data-search') || '';
                    card.hidden = value !== '全部' && text.indexOf(value) === -1;
                });
            });
        });
    });
}());
