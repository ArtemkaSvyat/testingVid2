function waitForVideoReady() {
    return new Promise((resolve) => {
        if (video.readyState >= 3) {
            resolve();
            return;
        }
        const onCanPlayThrough = () => {
            video.removeEventListener('canplaythrough', onCanPlayThrough);
            resolve();
        };
        video.addEventListener('canplaythrough', onCanPlayThrough);
        setTimeout(() => {
            video.removeEventListener('canplaythrough', onCanPlayThrough);
            resolve();
        }, 5000);
    });
}

function startApp() {
    let lastPercent = 0;
    const interval = setInterval(() => {
        if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            const percent = Math.min(100, Math.round((bufferedEnd / video.duration) * 100));
            if (percent !== lastPercent) {
                lastPercent = percent;
                loadPercent.textContent = percent + '%';
            }
            if (percent >= 100) {
                clearInterval(interval);
                waitForVideoReady().then(() => {
                    preloader.style.display = 'none';
                    video.currentTime = frameToTime(START_FRAME);
                    video.pause();
                    setTimeout(() => {
                        updateUIByFrame(START_FRAME);
                    }, 50);
                });
            }
        } else {
            loadPercent.textContent = '0%';
        }
    }, 200);
    setTimeout(() => {
        if (preloader.style.display !== 'none') {
            preloader.style.display = 'none';
            video.currentTime = frameToTime(START_FRAME);
            video.pause();
            updateUIByFrame(START_FRAME);
        }
    }, 15000);
}