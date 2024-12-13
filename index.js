const fs = await import("fs");
const express = await import("express");
const compression = await import("compression");
const ip = await import("ip");
const readline = await import("readline");
const zlib = await import("zlib");

const Traversal = await import("./traversal.js");
const Screencast = await import("./screen.js");

console.log("Punching a hole through your router... If this takes longer than 30 seconds, your router may not support UPnP. Learn more at https://smartdude.dev/rocast");

const LOCALHOST = false;

function waitForKey() {
    console.log("Press any key to continue...");
    return new Promise((resolve) => {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        const onKeyPress = () => {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdin.off("keypress", onKeyPress);
            resolve();
        };
        process.stdin.on("keypress", onKeyPress);
        process.stdin.resume();
    });
}

let port = 0;

while (port == 0) {
    try {
        port = 7500 + await Traversal.getAvailablePort();
    } catch (err) {
        if (err.toString() == "Service not found") {
            console.log("Your router may not support UPnP, or it may be experiencing a temporary error. Please wait at least 3 minutes and try opening Rocast again.");
        } else if (err.toString().includes("Device not found")) {
            console.log("Your router does not support UPnP, or it is not enabled. UPnP is await importd by Rocast. Please enable UPnP (if applicable) and try again.");
        } else {
            console.log(`Rocast encountered an unknown error: ${err.toString()}`);
        }
        waitForKey();
        process.exit(1);
    }
}

const app = express.default();

let ready = true;
let lastFrame = null;
let throttleCount = 0;
let compressionEnabled = false;

setInterval(async () => {
    if (!ready) {
        throttleCount++;
        if (throttleCount > 10) {
            throttleCount = 0;
            console.log("Screen capturing seems to be throttling often. It is not recommended to run this host software on underpowered hardware.");
        }
        return;
    }
    ready = false;
    lastFrame = await Screencast.captureMonitor(0);
    if (compressionEnabled) lastFrame = zlib.deflateRawSync(lastFrame, { level: 4 });
    ready = true;
}, 1000 / 10);

app.get("/frame", (req, res) => {
    res.send(lastFrame);
});

app.listen(port, async () => {
    console.log(`Rocast is ready to stream, enter this code into the experience:\n${Traversal.getFriendlyName(/*LOCALHOST ? "127.0.0.1" : */await Traversal.getPublicIp(), port - 7500)}\n`);
});