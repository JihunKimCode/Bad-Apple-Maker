// ================= CONFIG =================
const FRAME_COUNT = 6572;
const FPS = 120;                            // Frames per second
const TILE_SIZE = 64;                       // size of each tile
const SCALE = 1;                            // visual upscale
const DOWNSCALE_FACTOR = 0.1;               // reduce bitmap resolution
// ==========================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Loading bar elements
const loadingBar = document.getElementById("loading-bar");
const loadingText = document.getElementById("loading-text");
const loadingContainer = document.getElementById("loading-container");

// Load tile images
let tile0 = new Image();
let tile1 = new Image();
tile0.src = "tiles/0.png";
tile1.src = "tiles/1.png";

// Offscreen canvas
const offscreen = document.createElement("canvas");
const offCtx = offscreen.getContext("2d");

// Downscale bitmap
function downscaleBitmap(bitmap, factor) {
    const h = bitmap.length;
    const w = bitmap[0].length;
    const newH = Math.max(1, Math.floor(h * factor));
    const newW = Math.max(1, Math.floor(w * factor));

    const result = [];
    for (let y = 0; y < newH; y++) {
        const row = [];
        for (let x = 0; x < newW; x++) {
            row.push(bitmap[Math.floor(y / factor)][Math.floor(x / factor)]);
        }
        result.push(row);
    }
    return result;
}

// Draw frame
function drawFrame(bitmap) {
    const h = bitmap.length;
    const w = bitmap[0].length;

    offscreen.width = w * TILE_SIZE;
    offscreen.height = h * TILE_SIZE;

    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const tile = bitmap[y][x] ? tile1 : tile0;
            offCtx.drawImage(tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    canvas.width = offscreen.width * SCALE;
    canvas.height = offscreen.height * SCALE;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
}

// Load a single frame
async function loadFrame(index) {
    const num = String(index).padStart(4, "0");
    const res = await fetch(`bitmaps/${num}.json`);
    const bitmap = await res.json();
    return downscaleBitmap(bitmap, DOWNSCALE_FACTOR);
}

// Preload all frames with loading bar
async function preloadAllFrames() {
    const frames = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
        frames.push(await loadFrame(i));

        // Update loading bar
        const percent = (i / FRAME_COUNT) * 100;
        loadingBar.style.width = percent + "%";
        loadingText.textContent = `${i} / ${FRAME_COUNT}`;
    }
    return frames;
}

// Playback loop
function startPlayback(frames) {
    canvas.style.display = "block";             // show canvas
    loadingContainer.style.display = "none";    // hide loading UI

    let frameIndex = 0;
    const interval = 1000 / FPS;

    const loop = () => {
        drawFrame(frames[frameIndex]);
        frameIndex = (frameIndex + 1) % FRAME_COUNT;
        setTimeout(loop, interval);
    };

    loop();
}

// Initialize
Promise.all([
    new Promise(r => tile0.onload = r),
    new Promise(r => tile1.onload = r)
]).then(async () => {
    console.log("Tiles loaded. Preloading all frames...");
    const frames = await preloadAllFrames();
    console.log("All frames preloaded!");
    startPlayback(frames);
});
