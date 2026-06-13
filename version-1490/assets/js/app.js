(function() {
    var mobileToggle = document.querySelector('.mobile-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener('click', function() {
            var isOpen = mobilePanel.classList.toggle('is-open');
            mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var currentSlide = 0;
    var heroTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function(slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === currentSlide);
        });
        dots.forEach(function(dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === currentSlide);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        window.clearInterval(heroTimer);
        heroTimer = window.setInterval(function() {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            startHero();
        });
    });

    startHero();

    var filterInput = document.querySelector('[data-card-filter]');
    var filterGrid = document.querySelector('[data-filter-grid]');

    if (filterInput && filterGrid) {
        var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card'));
        filterInput.addEventListener('input', function() {
            var query = filterInput.value.trim().toLowerCase();
            cards.forEach(function(card) {
                var haystack = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-keywords') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                card.style.display = !query || haystack.indexOf(query) !== -1 ? '' : 'none';
            });
        });
    }

    function getQueryValue(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name) || '';
    }

    function renderSearch() {
        var container = document.getElementById('search-results');
        var heading = document.querySelector('[data-search-heading]');
        var input = document.querySelector('[data-search-input]');

        if (!container || !window.MovieIndex) {
            return;
        }

        var query = getQueryValue('q').trim();
        if (input) {
            input.value = query;
        }

        if (!query) {
            return;
        }

        var normalized = query.toLowerCase();
        var results = window.MovieIndex.filter(function(movie) {
            return [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.oneLine]
                .join(' ')
                .toLowerCase()
                .indexOf(normalized) !== -1;
        }).slice(0, 120);

        if (heading) {
            heading.textContent = '“' + query + '”相关影片';
        }

        if (!results.length) {
            container.innerHTML = '<div class="no-results">没有找到匹配影片，可以尝试更换关键词或浏览分类。</div>';
            return;
        }

        container.innerHTML = results.map(function(movie, index) {
            var tagList = movie.genre.split(/[，,、\/\s]+/).filter(Boolean).slice(0, 2).map(function(tag) {
                return '<span>' + escapeHtml(tag) + '</span>';
            }).join('');
            return '<article class="movie-card" data-title="' + escapeHtml(movie.title) + '" data-keywords="' + escapeHtml([movie.genre, movie.tags, movie.region, movie.year].join(' ')) + '">' +
                '<a class="poster-wrap" href="' + movie.url + '" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
                    '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
                    '<span class="rank-badge">' + (index + 1) + '</span>' +
                    '<span class="play-chip">播放</span>' +
                '</a>' +
                '<div class="movie-card-body">' +
                    '<div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
                    '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>' +
                    '<p>' + escapeHtml(movie.oneLine) + '</p>' +
                    '<div class="tag-row">' + tagList + '</div>' +
                '</div>' +
            '</article>';
        }).join('');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    renderSearch();

    function initPlayer() {
        var video = document.querySelector('.movie-video');
        var overlay = document.querySelector('.player-overlay');

        if (!video) {
            return;
        }

        var source = video.getAttribute('data-m3u8');
        var attached = false;

        function attachStream() {
            if (!source || attached) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                attached = true;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                video._hls = hls;
                attached = true;
                return;
            }
            video.src = source;
            attached = true;
        }

        function playVideo() {
            attachStream();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function() {});
            }
        }

        if (overlay) {
            overlay.addEventListener('click', playVideo);
        }

        video.addEventListener('click', function() {
            if (video.paused) {
                playVideo();
            }
        });

        video.addEventListener('play', function() {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });
    }

    initPlayer();
})();
