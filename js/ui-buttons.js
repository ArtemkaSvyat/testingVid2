// Отрисовка кнопок
function renderNavButtons(currentFrame) {
    const rule = navRules[currentFrame];
    if (rule) {
        if (rule.left) {
            const btn = document.createElement('button');
            btn.textContent = "← Влево";
            btn.onclick = () => { if (!isPlaying) playSegment(rule.left[0], rule.left[1]); };
            navLeftDiv.appendChild(btn);
        }
        if (rule.right) {
            const btn = document.createElement('button');
            btn.textContent = "Вправо →";
            btn.onclick = () => { if (!isPlaying) playSegment(rule.right[0], rule.right[1]); };
            navRightDiv.appendChild(btn);
        }
    }
}

function addHomeButton(currentFrame) {
    if (genplanQueueFrames.includes(currentFrame)) return;

    let segmentsToPlay = null;
    if (currentFrame === 344 || currentFrame === 1135) {
        segmentsToPlay = [{start: 1183, end: 1225}];
    } else if (currentFrame === 509 || currentFrame === 1035) {
        segmentsToPlay = [{start: 645, end: 690}, {start: 780, end: 820}];
    } else if (currentFrame === 690 || currentFrame === 935) {
        segmentsToPlay = [{start: 780, end: 820}];
    }

    const btn = document.createElement('button');
    btn.textContent = "Генплан";
    btn.className = "home-btn";
    if (segmentsToPlay) {
        btn.onclick = () => {
            if (!isPlaying) {
                playSegments(segmentsToPlay, () => {
                    video.currentTime = frameToTime(START_FRAME);
                    video.pause();
                    updateUIByFrame(START_FRAME);
                });
            }
        };
    } else {
        btn.onclick = () => {
            if (!isPlaying) {
                video.currentTime = frameToTime(START_FRAME);
                video.pause();
                updateUIByFrame(START_FRAME);
            }
        };
    }
    centerDiv.appendChild(btn);
}

function renderGenplanQueueButtons() {
    [1,2,3].forEach(id => {
        const btn = document.createElement('button');
        btn.textContent = `Очередь ${id}`;
        btn.onclick = () => {
            if (isPlaying) return;
            let start, end;
            if (id === 1) { start = 1370; end = 1405; }
            else if (id === 2) { start = 1684; end = 1718; }
            else { start = 1983; end = 2013; }
            playSegment(start, end, () => {
                selectedQueue = id;
                currentState = "yard";
            });
        };
        centerDiv.appendChild(btn);
    });
}

function renderYardButtons(currentQueue) {
    function makeQueueButton(target, position) {
        let start, end;
        if (currentQueue === 1 && target === 2) { start = 2330; end = 2360; }
        else if (currentQueue === 1 && target === 3) { start = 2784; end = 2820; }
        else if (currentQueue === 2 && target === 1) { start = 3018; end = 3060; }
        else if (currentQueue === 2 && target === 3) { start = 2452; end = 2484; }
        else if (currentQueue === 3 && target === 1) { start = 2637; end = 2676; }
        else if (currentQueue === 3 && target === 2) { start = 2900; end = 2942; }
        else return null;

        const btn = document.createElement('button');
        const arrow = (position === 'left') ? '← ' : '';
        const arrow2 = (position === 'left') ? '' : ' →';
        btn.textContent = `${arrow} Очередь ${target} ${arrow2}`;
        btn.onclick = () => {
            if (isPlaying) return;
            playSegment(start, end, () => { selectedQueue = target; });
        };
        return btn;
    }

    let leftTarget, rightTarget;
    if (currentQueue === 1) {
        leftTarget = 2;
        rightTarget = 3;
    } else if (currentQueue === 2) {
        leftTarget = 3;
        rightTarget = 1;
    } else {
        leftTarget = 1;
        rightTarget = 2;
    }

    const leftBtn = makeQueueButton(leftTarget, 'left');
    if (leftBtn) centerDiv.appendChild(leftBtn);

    const backBtn = document.createElement('button');
    backBtn.textContent = "Генплан";
    backBtn.style.background = "white";
    backBtn.style.color = "#1a2a4a";
    backBtn.style.border = "1px solid #c0c0c0";
    backBtn.onclick = () => {
        if (isPlaying) return;
        let start, end;
        if (selectedQueue === 1) { start = 1507; end = 1540; }
        else if (selectedQueue === 2) { start = 1845; end = 1875; }
        else { start = 2091; end = 2128; }
        playSegment(start, end, () => {
            currentState = "genplan";
            selectedQueue = null;
        });
    };
    centerDiv.appendChild(backBtn);

    const rightBtn = makeQueueButton(rightTarget, 'right');
    if (rightBtn) centerDiv.appendChild(rightBtn);
}

// ========== УПРАВЛЕНИЕ ВИДЖЕТОМ С АНИМАЦИЕЙ ==========
var isAnimating = false;

function collapseWidget() {
    if (isAnimating) return;
    const widget = document.getElementById('infoWidget');
    const collapsedBtn = document.getElementById('infoCollapsedBtn');
    if (!widget || widget.style.display !== 'block') return;
    
    isAnimating = true;
    // Этап 1: исчезает содержимое
    widget.classList.add('collapsing');
    setTimeout(() => {
        // Этап 2: сворачиваем виджет до размера кнопки
        widget.classList.add('collapsed');
        widget.style.width = '50px';
        widget.style.height = '50px';
        widget.style.padding = '0';
        // Убираем класс collapsing
        widget.classList.remove('collapsing');
        // Показываем свернутую кнопку, скрываем виджет
        widget.style.display = 'none';
        collapsedBtn.style.display = 'flex';
        isAnimating = false;
        isWidgetCollapsed = true;
    }, 200);
}

function expandWidget() {
    if (isAnimating) return;
    const widget = document.getElementById('infoWidget');
    const collapsedBtn = document.getElementById('infoCollapsedBtn');
    if (!widget) return;
    
    isAnimating = true;
    // Скрываем свернутую кнопку
    collapsedBtn.style.display = 'none';
    // Показываем виджет, но с прозрачным содержимым
    widget.style.display = 'block';
    widget.classList.add('expanding');
    // Убираем класс collapsed, чтобы вернуть нормальные размеры
    widget.classList.remove('collapsed');
    widget.style.width = '';
    widget.style.height = '';
    widget.style.padding = '';
    setTimeout(() => {
        // Появляется содержимое
        widget.classList.remove('expanding');
        isAnimating = false;
        isWidgetCollapsed = false;
    }, 200);
}

function updateInfoWidget(queueId) {
    const widget = document.getElementById('infoWidget');
    const collapsedBtn = document.getElementById('infoCollapsedBtn');
    if (!widget) return;
    
    const info = queueInfo[queueId];
    if (info) {
        document.getElementById('infoTitle').textContent = `Очередь ${queueId}`;
        const flatsElem = document.getElementById('infoFlats');
        // Очищаем перед вставкой
        flatsElem.innerHTML = '';
        if (info.type === 'count') {
            flatsElem.innerHTML = `🏢 Квартир: ${info.flats}`;
        } else {
            flatsElem.innerHTML = `🏢 ${info.flats}`;
        }
        // Скрываем дату
        const deadlineElem = document.getElementById('infoDeadline');
        if (deadlineElem) deadlineElem.style.display = 'none';
        
        // Восстанавливаем состояние
        if (isWidgetCollapsed) {
            widget.style.display = 'none';
            collapsedBtn.style.display = 'flex';
        } else {
            widget.style.display = 'block';
            collapsedBtn.style.display = 'none';
            widget.classList.remove('collapsed', 'collapsing', 'expanding');
            widget.style.width = '';
            widget.style.height = '';
            widget.style.padding = '';
        }
    } else {
        widget.style.display = 'none';
        collapsedBtn.style.display = 'none';
    }
}

function removeInfoWidget() {
    const widget = document.getElementById('infoWidget');
    const collapsedBtn = document.getElementById('infoCollapsedBtn');
    if (widget) widget.style.display = 'none';
    if (collapsedBtn) collapsedBtn.style.display = 'none';
}

function restoreInfoWidget() {
    // Вызывается после перелета, когда нужно восстановить виджет, если мы в режиме двора
    // Эта функция вызывается из updateUIByFrame, которая сама решает, показывать виджет или нет.
    // Здесь ничего дополнительного не нужно.
}

// Обработчик закрытия (крестик)
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('closeInfoBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            collapseWidget();
        });
    }
    const expandBtn = document.getElementById('infoCollapsedBtn');
    if (expandBtn) {
        expandBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            expandWidget();
        });
    }
});
