import { FileImporter } from "./FileImporter.mjs";
import { Map } from "./Map.mjs";
/*

For this, run
cd /Users/90entergetial/Desktop/javascripts
python3 -m http.server 8081

then open

http://localhost:8081/.vscode/BonkMapEditor/BonkMapEditor.html

*/
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight - 50;
canvas.width = window.innerWidth - 50;

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight - 50;
    canvas.width = window.innerWidth - 50;
});

let map = Map.fromJSON(await fetch('mapExample.json').then(res => res.json()));
top.map = map; // For debugging in console
let isDragging = false;
let markerSpawns = [];
let selectedMarkerIndex = -1;
let isDraggingMarker = false;
top.markerSpawns = markerSpawns; // For debugging in console
let lastMouseX, lastMouseY;
let gridSize = map.physics.partsPerMeter; // default grid size (1 meter)
let ShowGrid = false; // default to NOT showing the grid
let measurementPoints = [];
let isMeasuring = false;
let measurementLabel = null;
top.measurementPoints = measurementPoints; // For debugging in console

function mapScale() {
    return canvas.height / 500;
}

function screenToMap(x, y) {
    const currentMapScale = mapScale();
    return {
        x: ((x - offsetX) / scale - canvas.width / 2) / currentMapScale,
        y: ((y - offsetY) / scale - canvas.height / 2) / currentMapScale
    };
}

function mapToScreen(position) {
    const currentMapScale = mapScale();
    return {
        x: offsetX + scale * (canvas.width / 2 + position.x * currentMapScale),
        y: offsetY + scale * (canvas.height / 2 + position.y * currentMapScale)
    };
}

function markerRadiusOnScreen() {
    return map.physics.partsPerMeter * mapScale() * scale;
}

function markerAtScreenPosition(x, y) {
    const radius = markerRadiusOnScreen();
    for (let i = markerSpawns.length - 1; i >= 0; i--) {
        const screenPosition = mapToScreen(markerSpawns[i]);
        if (Math.hypot(x - screenPosition.x, y - screenPosition.y) <= radius) {
            return i;
        }
    }
    return -1;
}

function renderMarkerSpawns() {
    const radius = map.physics.partsPerMeter;
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.translate(canvas.width / 2 +2, canvas.height / 2 +2);
    ctx.scale(mapScale(), mapScale());
    for (let i = 0; i < markerSpawns.length; i++) {
        const marker = markerSpawns[i];
        ctx.fillStyle = "#0000001a";
        ctx.beginPath();
        ctx.arc(marker.x, marker.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(mapScale(), mapScale());
    for (let i = 0; i < markerSpawns.length; i++) {
        const marker = markerSpawns[i];
        ctx.save();
        ctx.translate(marker.x, marker.y);
        ctx.fillStyle = i === selectedMarkerIndex ? '#EF5350' : '#D32F2F';
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(marker.x, marker.y);
        ctx.fillStyle = i === selectedMarkerIndex ? '#2fd9b7' : '#1abc9c';
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -8/7, Math.PI * -5/14);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(marker.x, marker.y);
        ctx.fillStyle = i === selectedMarkerIndex ? '#50acf7' : '#448aff';
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -1/7, Math.PI * 9/14);
        ctx.fill();
        ctx.restore();
    }
    ctx.restore();
}

function triggerMarkerRedraw() {
    offsetX += 0.000002;
    offsetX -= 0.000002;
}

function clearMeasurement() {
    measurementPoints.length = 0;
    isMeasuring = false;
    measurementLabel = null;
    triggerMarkerRedraw();
}

function updateMeasurementLabel() {
    if (measurementPoints.length !== 2) {
        measurementLabel = null;
        return;
    }

    const first = mapToScreen(measurementPoints[0]);
    const second = mapToScreen(measurementPoints[1]);
    const midpointX = (first.x + second.x) / 2;
    const midpointY = (first.y + second.y) / 2;
    const length = Math.hypot(second.x - first.x, second.y - first.y);
    const normalLength = Math.max(length, 1);
    measurementLabel = {
        x: midpointX - (second.y - first.y) / normalLength * 14,
        y: midpointY + (second.x - first.x) / normalLength * 14,
        text: `Distance: ${Math.hypot(
            measurementPoints[1].x - measurementPoints[0].x,
            measurementPoints[1].y - measurementPoints[0].y
        ).toFixed(6)}px (${
            (Math.hypot(
                measurementPoints[1].x - measurementPoints[0].x,
                measurementPoints[1].y - measurementPoints[0].y
            ) / map.physics.partsPerMeter / 2).toFixed(6)
        } players)`
    };
}

function renderMeasurement() {
    if (measurementPoints.length === 0) return;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(mapScale(), mapScale());
    ctx.strokeStyle = '#FFD54F';
    ctx.fillStyle = '#FFD54F';
    ctx.lineWidth = 2 / (mapScale() * scale);

    if (measurementPoints.length === 2) {
        ctx.beginPath();
        ctx.moveTo(measurementPoints[0].x, measurementPoints[0].y);
        ctx.lineTo(measurementPoints[1].x, measurementPoints[1].y);
        ctx.stroke();
    }

    for (const point of measurementPoints) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4 / (mapScale() * scale), 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    if (measurementPoints.length === 2) {
        ctx.save();
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#1E3246';
        ctx.fillStyle = '#FFD54F';
        ctx.strokeText(measurementLabel.text, measurementLabel.x, measurementLabel.y);
        ctx.fillText(measurementLabel.text, measurementLabel.x, measurementLabel.y);
        ctx.restore();
    }
}

function renderGrid() {
    const currentMapScale = mapScale();
    const gridSpacing = gridSize * currentMapScale * scale;
    const originX = offsetX + scale * canvas.width / 2;
    const originY = offsetY + scale * canvas.height / 2;
    const startX = ((originX % gridSpacing) + gridSpacing) % gridSpacing;
    const startY = ((originY % gridSpacing) + gridSpacing) % gridSpacing;
    ctx.strokeStyle = '#ffffff33';
    ctx.lineWidth = 1;

    for (let x = startX; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = startY; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isMeasuring) {
        if (e.button === 2) {
            e.preventDefault();
            clearMeasurement();
            addNotification('Distance measurement cancelled', 2000, 'yellow');
        }
        else if (e.button === 0) {
            measurementPoints.push(screenToMap(mouseX, mouseY));
            if (measurementPoints.length === 2) {
                isMeasuring = false;
                addNotification('Distance measurement placed', 2000, 'lightgreen');
            }
            triggerMarkerRedraw();
        }
        return;
    }

    const markerIndex = markerAtScreenPosition(mouseX, mouseY);

    if (e.shiftKey && markerIndex !== -1) {
        selectedMarkerIndex = markerIndex;
        isDraggingMarker = true;
        isDragging = false;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        triggerMarkerRedraw();
        return;
    }

    if (markerIndex === selectedMarkerIndex && markerIndex !== -1) {
        isDraggingMarker = true;
        isDragging = false;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        return;
    }

    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

canvas.addEventListener('contextmenu', (e) => {
    if (isMeasuring) {
        e.preventDefault();
        clearMeasurement();
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDraggingMarker && selectedMarkerIndex !== -1) {
        const marker = markerSpawns[selectedMarkerIndex];
        const currentMapScale = mapScale() * scale;
        marker.x += (mouseX - lastMouseX) / currentMapScale;
        marker.y += (mouseY - lastMouseY) / currentMapScale;
        if (e.shiftKey) {
            marker.x = Math.round(marker.x);
            marker.y = Math.round(marker.y);
        }
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        triggerMarkerRedraw();
        return;
    }

    if (isDragging) {
        offsetX += e.clientX - lastMouseX;
        offsetY += e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    isDraggingMarker = false;
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const zoomFactor = Math.exp(0.003 * e.deltaY);
    const oldScale = scale;
    scale *= zoomFactor;
    scale = Math.min(Math.max(scale, 0.1), 100000);
    const worldX = (mouseX - offsetX) / oldScale;
    const worldY = (mouseY - offsetY) / oldScale;
    offsetX = mouseX - worldX * scale;
    offsetY = mouseY - worldY * scale;
});

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let old = {
    scale: scale,
    offsetX: offsetX,
    offsetY: offsetY,
    mapJSON: JSON.stringify(map.toJSON()),
    screenWidth: canvas.width,
    screenHeight: canvas.height,
    markerSpawns: JSON.stringify(markerSpawns),
    selectedMarkerIndex,
    measurementPoints: JSON.stringify(measurementPoints),
    isMeasuring,
    firstTime: true
}
let ShowUI = true;

function hasChanged() {
    return old.scale !== scale ||
        old.offsetX !== offsetX ||
        old.offsetY !== offsetY ||
        old.mapJSON !== JSON.stringify(map.toJSON()) ||
        old.screenWidth !== canvas.width ||
        old.screenHeight !== canvas.height ||
        old.markerSpawns !== JSON.stringify(markerSpawns) ||
        old.selectedMarkerIndex !== selectedMarkerIndex ||
        old.measurementPoints !== JSON.stringify(measurementPoints) ||
        old.isMeasuring !== isMeasuring ||
        (notifications.length > 0) ||
        old.firstTime;
}

function updateOld() {
    old.scale = scale;
    old.offsetX = offsetX;
    old.offsetY = offsetY;
    old.mapJSON = JSON.stringify(map.toJSON());
    old.screenWidth = canvas.width;
    old.screenHeight = canvas.height;
    old.markerSpawns = JSON.stringify(markerSpawns);
    old.selectedMarkerIndex = selectedMarkerIndex;
    old.measurementPoints = JSON.stringify(measurementPoints);
    old.isMeasuring = isMeasuring;
    old.firstTime = false;
}

let notifications = [];

function addNotification(message, duration = 2000, color) {
    const notification = { message, time: Date.now(), duration, color };
    notifications.push(notification);
    setTimeout(() => {
        notifications = notifications.filter(n => n !== notification);
    }, duration);
}
// ctx.canvas.width = window.innerWidth;
// ctx.canvas.height = window.innerHeight;

async function animate() {
    updateMeasurementLabel();

    if (hasChanged()) {
        ctx.fillStyle = '#1E3246';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await map.draw(ctx, canvas.height, offsetX, offsetY, scale, true);
        await map.draw(ctx, canvas.height, offsetX, offsetY, scale);
        renderMarkerSpawns();
        if (ShowGrid) renderGrid();
        renderMeasurement();

        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        if (ShowUI) {
        ctx.fillText(`Drag to move, Scroll to zoom, Press Shift+D to download the map as a .png, Press Shift+S to download the map as a .svg, Press Shift+I to import text file`, 10, 20);
        ctx.fillText(`Press Shift+T to enter JSON text, Shift+J to copy JSON, Shift+M to enter map string, Shift+C to copy map string`, 10, 40);
        ctx.fillText(`Press Shift+G to toggle UI, Press Shift+F to reset camera`, 10, 60);
        ctx.fillText(`Press Shift+N to toggle grid, Shift+V: Grid size -1, Shift+B: Grid size +1, Shift+Ctrl: +-0.01, Shift+Ctrl+N: Reset grid size`, 10, 80);
        ctx.fillStyle = 'yellow';
        ctx.font = '16px Arial';
        ShowGrid ? ctx.fillText(`Scale: ${scale.toFixed(5)}, Xpos: ${((((canvas.width / 2) - offsetX) / scale - canvas.width / 2) / mapScale()).toFixed(6)}, Ypos: ${((((canvas.height / 2) - offsetY) / scale - canvas.height / 2) / mapScale()).toFixed(6)}, Grid size: ${gridSize.toFixed(2)}`, 10, 100) : ctx.fillText(`Scale: ${scale.toFixed(5)}, Xpos: ${((((canvas.width / 2) - offsetX) / scale - canvas.width / 2) / mapScale()).toFixed(6)}, Ypos: ${((((canvas.height / 2) - offsetY) / scale - canvas.height / 2) / mapScale()).toFixed(6)}`, 10, 100);
        ctx.fillText(`Map Name: ${map.mapInfo.name}, Map Author: ${map.mapInfo.author}, Map PPM: ${map.physics.partsPerMeter}`, 10, 120);
        ctx.fillText(`Amount of capzones: ${map.capZones.length}`, 10, 140);
        ctx.fillText(`Amount of spawns: ${map.spawns.length}`, 10, 160);
        ctx.fillText(`Amount of shapes: ${map.physics.shapes.length}`, 10, 180);
        ctx.fillStyle = 'orange';
        ctx.font = '16px Arial';
        ctx.fillText(`Q: measure distance, click two points, right-click to cancel`, 10, 200);
        ctx.fillText(`Shift+P: marker at camera, Shift-click: select, Drag: move, Shift+drag: snap`, 10, 220);
        ctx.fillText(`Arrows: nudge, +Shift: 0.1, +Alt: 0.01, +Alt+Shift: 0.001, Shift+D: duplicate, Delete/Enter: remove, Escape: deselect`, 10, 240);
        if(selectedMarkerIndex !== -1) {
            ctx.fillStyle = 'green';
            ctx.font = '16px Arial';
            ctx.fillText(`Selected marker: ${selectedMarkerIndex}, Position: (${markerSpawns[selectedMarkerIndex].x.toFixed(6)}, ${markerSpawns[selectedMarkerIndex].y.toFixed(6)})`, 10, 260);
        }
    }
        let notifY = canvas.height - 20*notifications.length;
        for (const notif of notifications) {
            const elapsed = Date.now() - notif.time;
            if (elapsed < notif.duration) {
                ctx.globalAlpha = Math.pow(1 - (elapsed / notif.duration), 0.33);
                ctx.fillStyle = notif.color || 'yellow';
                ctx.fillText(notif.message, 10, notifY);
                ctx.globalAlpha = 1.0;
                notifY += 20;
            }
        }
    }
    updateOld();
    requestAnimationFrame(animate);
}

animate();

function loadMapFromTxt(txt) {
    try {
        const json = JSON.parse(txt);
        try {
            map = Map.fromJSON(json);
        }
        catch (err) {
            addNotification(err.message, 3000, "red");
            return;
        }
        addNotification("Map imported successfully", 3000, "lightgreen");
    }
    catch (err) {
        addNotification("Invalid JSON: " + err.message, 3000, "red");
    }
}

document.addEventListener('keydown', async (e) => {
    if (!e.shiftKey && selectedMarkerIndex === -1 && e.code !== 'KeyQ') {
        return;
    }
    let txt;
    switch (e.code) {
        case 'KeyQ':
            clearMeasurement();
            isMeasuring = true;
            addNotification('Click two points to measure distance. Right-click to cancel.', 3000, 'yellow');
            triggerMarkerRedraw();
            break;
        case 'KeyG':
            ShowUI = !ShowUI;
            if (!ShowUI) addNotification("Hid UI", 3000, "lightgreen");
            else addNotification("Unhid UI", 3000, "lightgreen");
            offsetX += 0.000002; // Trigger redraw
            break;
        case 'KeyF':
            offsetX = 0;
            offsetY = 0;
            scale = 1;
            break;
        case 'KeyD':
            if (selectedMarkerIndex !== -1) {
                markerSpawns.push({ ...markerSpawns[selectedMarkerIndex] });
                triggerMarkerRedraw();
            }
            else {
                map.download(4096, `${map.mapInfo.name}.png`);
            }
            break;
        case 'KeyS':
            map.download(4096, `${map.mapInfo.name}.svg`);
            break;
        case "KeyI":
            txt = await FileImporter.text();
            loadMapFromTxt(txt);
            break;
        case "KeyJ":
            const jsonString = JSON.stringify(map.toJSON());
            navigator.clipboard.writeText(jsonString);
            addNotification("Map JSON copied to clipboard", 3000, "lightgreen");
            addNotification(jsonString, 3000);
            break;
        case "KeyT":
            txt = prompt("Enter map JSON:");
            loadMapFromTxt(txt);
            break;
        case "KeyM":
            txt = prompt("Enter map string:");
            try {
                map = Map.fromString(txt);
                addNotification("Map imported successfully", 3000, "lightgreen");
            }
            catch (err) {
                addNotification("Error importing map: " + err.message, 3000, "red");
            }
            break;
        case "KeyC":
            const mapString = map.toString();
            navigator.clipboard.writeText(mapString);
            addNotification("Map string copied to clipboard", 3000, "lightgreen");
            addNotification(mapString, 3000);
            break;
        case "KeyP":
            markerSpawns.push(screenToMap(canvas.width / 2, canvas.height / 2));
            selectedMarkerIndex = markerSpawns.length - 1;
            triggerMarkerRedraw();
            break;
        case "KeyN":
            if (e.ctrlKey) {
                gridSize = map.physics.partsPerMeter;
                addNotification(`Grid size reset to ${gridSize}`, 3000, "lightgreen");
            }
            else {
                ShowGrid = !ShowGrid;
                addNotification(`Grid ${ShowGrid ? "shown" : "hidden"}`, 3000, "lightgreen");
            }
            break;
        case "KeyV":
            if (ShowGrid) {
                if (e.ctrlKey) {
                    gridSize -= 0.01;
                } else {
                    gridSize -= 1;
                }
                if (gridSize > 1){
                addNotification(`Grid size decreased to ${gridSize}`, 3000, "lightgreen");
                } else {
                    addNotification(`Grid size cannot be less than 1`, 3000, "red");
                    gridSize = 1; // Reset to minimum value
                }
            }
            break;
        case "KeyB":
            if (ShowGrid) {
                if (e.ctrlKey) {
                    gridSize += 0.01;
                } else {
                    gridSize += 1;
                }
                if(gridSize < 100){
                    addNotification(`Grid size increased to ${gridSize}`, 3000, "lightgreen");
                } else {
                    addNotification(`Grid size cannot be more than 100`, 3000, "red");
                    gridSize = 100; // Reset to maximum value
                }
            }
            break;
    }

    if (selectedMarkerIndex !== -1) {
        const marker = markerSpawns[selectedMarkerIndex];
        let step = e.shiftKey ? 0.1 : 1;
        if(e.altKey) step = 0.01;
        if(e.altKey && e.shiftKey) step = 0.001;
        let markerChanged = false;

        switch (e.code) {
            case 'ArrowUp':
                marker.y -= step;
                markerChanged = true;
                break;
            case 'ArrowDown':
                marker.y += step;
                markerChanged = true;
                break;
            case 'ArrowLeft':
                marker.x -= step;
                markerChanged = true;
                break;
            case 'ArrowRight':
                marker.x += step;
                markerChanged = true;
                break;
            case 'Delete':
            case 'Backspace':
            case 'Enter':
                markerSpawns.splice(selectedMarkerIndex, 1);
                selectedMarkerIndex = -1;
                markerChanged = true;
                break;
            case 'Escape':
                selectedMarkerIndex = -1;
                markerChanged = true;
                break;
        }

        if (markerChanged) {
            e.preventDefault();
            triggerMarkerRedraw();
        }
    }
});