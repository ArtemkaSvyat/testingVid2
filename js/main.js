// Получение DOM-элементов
var video = document.getElementById('mainVideo');
var navLeftDiv = document.getElementById('navLeft');
var navRightDiv = document.getElementById('navRight');
var centerDiv = document.getElementById('centerButtons');
var preloader = document.getElementById('preloader');
var loadPercent = document.getElementById('load-percent');

// Блокировка зума
document.addEventListener('gesturestart', function(e) { e.preventDefault(); });
var lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    var now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
window.addEventListener('wheel', function(e) {
    if (e.ctrlKey) e.preventDefault();
}, { passive: false });
document.addEventListener('dblclick', function(e) { e.preventDefault(); });

// Запуск видео
video.src = videoPath;
video.load();
video.addEventListener('loadeddata', startApp);
video.addEventListener('error', function() {
    preloader.style.display = 'none';
    alert('Ошибка загрузки видео. Проверьте путь: ' + videoPath);
});
window.addEventListener('wheel', function(e) { e.preventDefault(); }, { passive: false });