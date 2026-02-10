/* ================= CONFIG ================= */
const FRAME_COUNT = 6572;
const FPS = 30; // Frames per second to play the video
/* ========================================== */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let imageData;
let width, height;

/* Load one frame (2D array) */
async function loadFrame(index) {
    const num = String(index).padStart(4, "0");
    const file = `bitmaps/${num}.json`;
    const res = await fetch(file);
    return res.json();
}

/* Draw 2D bitmap to canvas */
function draw(bitmap) {
    if (!imageData) {
        height = bitmap.length;
        width = bitmap[0].length;
        canvas.width = width;
        canvas.height = height;
        imageData = ctx.createImageData(width, height);
    }

    let p = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const v = bitmap[y][x] ? 0 : 255; // 1=black, 0=white
            imageData.data[p++] = v;
            imageData.data[p++] = v;
            imageData.data[p++] = v;
            imageData.data[p++] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

/* Play frames as video */
async function play() {
    let frame = 1;
    setInterval(async () => {
        const bitmap = await loadFrame(frame);
        draw(bitmap);
        frame++;
        if (frame > FRAME_COUNT) frame = 1;
    }, 1000 / FPS);
}

play();
