// Функции управления видео
function frameToTime(frame) {
    return frame / FPS;
}

function disableAllButtons(disabled) {
    document.querySelectorAll('.controls button').forEach(btn => btn.disabled = disabled);
}

async function playSegments(segmentsList, finalCallback) {
    removeInfoWidget(); // <-- добавить эту строку
    if (isPlaying) return;
    isPlaying = true;
    disableAllButtons(true);

    for (const seg of segmentsList) {
        await new Promise((resolve) => {
            const startTime = frameToTime(seg.start);
            const endTime = frameToTime(seg.end);
            video.currentTime = startTime;

            let finished = false;
            const onUpdate = () => {
                if (finished) return;
                if (video.currentTime >= endTime) {
                    finished = true;
                    video.removeEventListener('timeupdate', onUpdate);
                    video.pause();
                    video.currentTime = endTime;
                    resolve();
                }
            };
            video.addEventListener('timeupdate', onUpdate);
            const timeout = setTimeout(() => {
                if (!finished) {
                    finished = true;
                    video.removeEventListener('timeupdate', onUpdate);
                    video.pause();
                    video.currentTime = endTime;
                    resolve();
                }
            }, (seg.end - seg.start) / FPS * 1000 + 200);

            video.play().catch(err => {
                console.warn(err);
                clearTimeout(timeout);
                video.removeEventListener('timeupdate', onUpdate);
                finished = true;
                resolve();
            });
        });
    }
    isPlaying = false;
    disableAllButtons(false);
    const finalFrame = segmentsList[segmentsList.length-1].end;
    video.currentTime = frameToTime(finalFrame);
    video.pause();
    if (finalCallback) finalCallback(finalFrame);
    updateUIByFrame(finalFrame);
}

function playSegment(start, end, onComplete) {
    playSegments([{start, end}], onComplete);
}
