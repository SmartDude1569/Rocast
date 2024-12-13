// screen.js more like scream.js cause its gonna make your cpu
//  _____ _____ ______ _____  ___  ___  ___  _ 
// /  ___/  __ \| ___ \  ___|/ _ \ |  \/  | | | *
// \ `--.| /  \/| |_/ / |__ / /_\ \| .  . | | |
//  `--. \ |    |    /|  __||  _  || |\/| | | |
// /\__/ / \__/\| |\ \| |___| | | || |  | | |_|
// \____/ \____/\_| \_\____/\_| |_/\_|  |_/ (_)
//
// *: if your pc is like absolute dogshit made in the 1980s type shit

const { Monitor, Window } = await import("node-screenshots");

let target = Monitor.all()[0];
let width = 320;
let height = 180;

export const TargetType = {
    Window: 0,
    Monitor: 1
};

export function changeTarget(targetType, idx) {
    switch (targetType) {
        case TargetType.Window:
            target = Window.all()[idx];
            break;
        case TargetType.Monitor:
            target = Monitor.all()[idx];
            break;
        default:
            break;
    }
}

export function changeResolution(newWidth, newHeight) {
    width = newWidth;
    height = newHeight;
}

export function getWindows() {
    return Window.all();
}

function resizeImage(buffer, originalWidth, originalHeight, targetWidth, targetHeight, bytesPerPixel) {
    if (!Buffer.isBuffer(buffer)) {
        throw new Error("Input must be a buffer.");
    }
    if (originalWidth <= 0 || originalHeight <= 0 || targetWidth <= 0 || targetHeight <= 0 || bytesPerPixel < 3) {
        throw new Error("Invalid dimensions or bytes per pixel.");
    }
    const resizedBuffer = Buffer.alloc(targetWidth * targetHeight * 4);
    const xScale = originalWidth / targetWidth;
    const yScale = originalHeight / targetHeight;
    for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x++) {
            const originalX = Math.floor(x * xScale);
            const originalY = Math.floor(y * yScale);
            const srcOffset = (originalY * originalWidth + originalX) * bytesPerPixel;
            const destOffset = (y * targetWidth + x) * 4;
            resizedBuffer[destOffset] = buffer[srcOffset];
            resizedBuffer[destOffset + 1] = buffer[srcOffset + 1];
            resizedBuffer[destOffset + 2] = buffer[srcOffset + 2];
            resizedBuffer[destOffset + 3] = buffer[srcOffset + 3];
        }
    }
    return resizedBuffer;
}

export async function captureTarget() {
    const image = await target.captureImage();
    const raw = await image.toRaw();
    const resized = resizeImage(raw, image.width, image.height, width, height, 4);
    return resized;
}

export async function captureWindow(idx) {
    const image = await Window.all()[idx].captureImage();
    const raw = await image.toRaw();
    const resized = resizeImage(raw, image.width, image.height, width, height, 4);
    return resized;
}

export async function captureMonitor(idx) {
    const image = await Monitor.all()[idx].captureImage();
    const raw = await image.toRaw();
    const resized = resizeImage(raw, image.width, image.height, width, height, 4);
    return resized;
}