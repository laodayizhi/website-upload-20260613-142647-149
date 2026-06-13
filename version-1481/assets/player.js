(function () {
    function attachPlayer(shell) {
        var video = shell.querySelector('video');
        var cover = shell.querySelector('.player-cover');
        var stream = video ? video.getAttribute('data-stream') : '';
        var loaded = false;
        var hls = null;

        if (!video || !stream) {
            return;
        }

        function start() {
            if (!loaded) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
                loaded = true;
            }
            video.controls = true;
            if (cover) {
                cover.classList.add('is-hidden');
            }
            var playTask = video.play();
            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', start);
        }

        video.addEventListener('click', function () {
            if (!loaded || video.paused) {
                start();
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    document.querySelectorAll('.stream-player').forEach(attachPlayer);
}());
