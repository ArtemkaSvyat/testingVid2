function clearInterface() {
    navLeftDiv.innerHTML = '';
    navRightDiv.innerHTML = '';
    centerDiv.innerHTML = '';
    // Виджет не удаляем здесь, чтобы он не мигал при обновлении интерфейса
}

function updateUIByFrame(currentFrame) {
    clearInterface();
    console.log("updateUIByFrame, кадр:", currentFrame);

    if (yardMap.hasOwnProperty(currentFrame)) {
        currentState = "yard";
        selectedQueue = yardMap[currentFrame];
        updateInfoWidget(selectedQueue);   // показываем виджет
    } else {
        currentState = "genplan";
        selectedQueue = null;
        removeInfoWidget();               // скрываем виджет
    }

    renderNavButtons(currentFrame);

    if (currentState === "genplan") {
        if (genplanQueueFrames.includes(currentFrame)) {
            renderGenplanQueueButtons();
        }
        if (!genplanQueueFrames.includes(currentFrame) && currentFrame !== START_FRAME) {
            addHomeButton(currentFrame);
        }
    } else if (currentState === "yard") {
        renderYardButtons(selectedQueue);
    }
}
