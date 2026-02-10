// ================= CONFIG =================
const FRAME_COUNT = 6572;
const SCALE = 1;                            // visual upscale on screen

const FPS = 120;                            // Frames per second to play the video
const TILE_SIZE = 64;                       // size of each tile
const DOWNSCALE_FACTOR = 0.1;               // reduce bitmap resolution
// ==========================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Load tile images
let tile0 = new Image();
let tile1 = new Image();
tile0.src = "tiles/0.png";   // image for white
tile1.src = "tiles/1.png";   // image for black

Promise.all([
    new Promise(r => tile0.onload = r),
    new Promise(r => tile1.onload = r)
]).then(() => {
    startPlayback();
});

// Offscreen canvas for fast drawing
const offscreen = document.createElement("canvas");
const offCtx = offscreen.getContext("2d");

// Function to downscale bitmap dynamically
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

// Load a single JSON frame
async function loadFrame(index) {
    const num = String(index).padStart(4, "0");
    const file = `bitmaps/${num}.json`;
    const res = await fetch(file);
    const bitmap = await res.json();
    return downscaleBitmap(bitmap, DOWNSCALE_FACTOR);
}

// Draw frame using offscreen canvas
async function drawFrame(bitmap) {
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

// Playback loop
async function startPlayback() {
    let frame = 1;
    const interval = 1000 / FPS;

    const loop = async () => {
        const bitmap = await loadFrame(frame);
        drawFrame(bitmap);

        frame++;
        if (frame > FRAME_COUNT) frame = 1;
        setTimeout(loop, interval);
    };

    loop();
}
