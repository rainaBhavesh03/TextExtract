let screenshotURL = null;
let selectedArea = { x: 0, y: 0, width: 0, height: 0 };

let isSelecting = false;
let isAreaSelected = false;
let startX, startY, endX, endY;
let clickCount = 0;

const captureButton = document.getElementById('capture-button');
const screenshotContainer = document.getElementById('screenshotContainer');
const screenshotImage = document.getElementById('screenshot-image');
const xCoordinateInput = document.getElementById('x-coordinate');
const yCoordinateInput = document.getElementById('y-coordinate');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const ocrButton = document.getElementById('ocr-button');
const extractedText = document.getElementById('extracted-text');
const area = document.getElementById('selected-area');


let screenshotWidth = 0;
let screenshotHeight = 0;

function displayScreenshot(screenshotURL) {
    screenshotImage.src = screenshotURL;

    screenshotImage.onload = function () {
        screenshotWidth = screenshotImage.naturalWidth;
        screenshotHeight = screenshotImage.naturalHeight;
        clearSelection();
        isAreaSelected = false;
    };
}

function clearSelection() {
    selectedArea = { x: 0, y: 0, width: 0, height: 0 };
    updateInputFields();
    area.style.display = 'none';
}

function updateInputFields() {
    xCoordinateInput.value = selectedArea.x;
    yCoordinateInput.value = selectedArea.y;
    widthInput.value = selectedArea.width;
    heightInput.value = selectedArea.height;
}

function updateSelectedArea() {
    if (isSelecting) {
        const width = endX - startX;
        const height = endY - startY;
        selectedArea = { x: startX, y: startY, width, height };
        drawSelectionOverlay(selectedArea);
        updateInputFields();
    }
}

captureButton.addEventListener('click', () => {
    // Check if the extension is running in Chrome or Firefox
    if (typeof chrome !== "undefined" && typeof chrome.tabs !== "undefined") {
        // Running in Chrome
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, function(dataURL) {
            if (chrome.runtime.lastError) {
                // Handle any errors that occurred during the capture
                console.error(chrome.runtime.lastError);
            } else {
                screenshotURL = dataURL;
                displayScreenshot(screenshotURL);
            }
        });
    } else if (typeof browser !== "undefined" && typeof browser.tabs !== "undefined") {
        // Running in Firefox
        browser.tabs.captureVisibleTab()
            .then(dataURL => {
                screenshotURL = dataURL;
                displayScreenshot(screenshotURL);
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        // Handle unsupported browsers or other environments
        console.error("Unsupported browser");
    }
});

screenshotImage.addEventListener('click', (e) => {
    if (clickCount === 0) {
        clearSelection();
        isSelecting = true;
        isAreaSelected = false;
        startX = e.clientX - screenshotImage.getBoundingClientRect().left;
        startY = e.clientY - screenshotImage.getBoundingClientRect().top;
        endX = startX;
        endY = startY;
        screenshotImage.style.cursor = 'crosshair';
        updateSelectedArea();
        clickCount++;
    }
    else if (clickCount === 1) {
        endX = e.clientX - screenshotImage.getBoundingClientRect().left;
        endY = e.clientY - screenshotImage.getBoundingClientRect().top;
        screenshotImage.style.cursor = 'default';
        clickCount--;
        updateSelectedArea();
        isSelecting = false;
        isAreaSelected = true;
    }
});

screenshotContainer.addEventListener('mousemove', (e) => {
    if(isSelecting){
        endX = e.clientX - screenshotImage.getBoundingClientRect().left;
        endY = e.clientY - screenshotImage.getBoundingClientRect().top;
        updateSelectedArea();
    }
})

function drawSelectionOverlay(selectedArea) {
    area.style.left = screenshotImage.offsetLeft + selectedArea.x+ 'px';
    area.style.top = selectedArea.y + 'px';
    area.style.width = selectedArea.width + 'px';
    area.style.height = selectedArea.height + 'px';
    area.style.display = 'block';
}

function updateScreenshot(selectedAreaData) {
    const screenshotCanvas = document.createElement('canvas');
    const ctx = screenshotCanvas.getContext('2d');
    
    screenshotCanvas.width = selectedAreaData.width;
    screenshotCanvas.height = selectedAreaData.height;

    ctx.drawImage(screenshotImage, selectedAreaData.x, selectedAreaData.y, selectedAreaData.width, selectedAreaData.height, 0, 0, selectedAreaData.width, selectedAreaData.height);

    screenshotURL = screenshotCanvas.toDataURL();
    displayScreenshot(screenshotURL);
    clearSelection();
}

ocrButton.addEventListener('click', () => {
    if (isAreaSelected) {
        sendImageToServer(screenshotURL);
    }
});

async function sendImageToServer(imageDataURL) {
    if (!imageDataURL) {
        console.error('No image data to send to the server.');
        return;
    }
    
    const ratioY = screenshotHeight / screenshotImage.offsetHeight;
    const ratioX = screenshotWidth / screenshotImage.offsetWidth;
    const serverURL = 'http://localhost:8080/upload';
    const selectedAreaData = {
        x: selectedArea.x * ratioX,
        y: selectedArea.y * ratioY,
        width: selectedArea.width * ratioX,
        height: selectedArea.height * ratioY
    };
    
    updateScreenshot(selectedAreaData);
    try {
        const response = await fetch(serverURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageDataURL, area: selectedAreaData }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.text) {
                extractedText.innerText = data.text.replace(/<br\s+data-manual="true"\s*[/]?>/gi, '\n');
            } else {
                console.error('No text extracted from the server response.');
            }
        } else {
            console.error('Server responded with an error:', response.status);
        }
    } catch (error) {
        console.error('Error while sending data to the server:', error);
    }
}
