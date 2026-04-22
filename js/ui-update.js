function clearInterface() {
    navLeftDiv.innerHTML = '';
    navRightDiv.innerHTML = '';
    centerDiv.innerHTML = '';
}

function updateUIByFrame(currentFrame) {
    clearInterface();
    console.log("updateUIByFrame, кадр:", currentFrame);

    if (yardMap.hasOwnProperty(currentFrame)) {
        currentState = "yard";
        selectedQueue = yardMap[currentFrame];
    } else {
        currentState = "genplan";
        selectedQueue = null;
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