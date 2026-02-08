# Bad Apple JS Player

This project is a **JavaScript-based pixel video player** for “Bad Apple” frames stored as JSON bitmaps. Each frame is represented as a 2D array of 0s and 1s, and these are rendered dynamically in the browser using images for each pixel.

The player supports **dynamic tile swapping**, downscaling for smooth playback, and configurable visual scaling.

## How to Run

```bash
cd /path/to/project
python -m http.server 8000
```

Open your browser at:
http://localhost:8000/index.html

To make it less laggy with preload, open browser at:
http://localhost:8000/preload.html

---

## Configuration (`player.js`)

All settings are at the top of `player.js` under the `CONFIG` section:

Option | Description
-------|-------------
`FRAME_COUNT` | Total number of JSON frames in `bitmaps/`. Default `6572`.
`FPS` | Frames per second to play the video. Default is `120`.
`TILE_SIZE` | Size in pixels for each tile drawn on offscreen canvas. Use smaller sizes for faster rendering. Default `64`.
`SCALE` | Visual scale factor applied to the main canvas for display. Default `1`.
`DOWNSCALE_FACTOR` | Downscale factor for bitmap resolution. Reduces number of tiles drawn per frame. Default `0.1` (10% of original size).

---

## Tiles (`tiles/`)

- `0.png` → Image used for pixels with value `0`.
- `1.png` → Image used for pixels with value `1`.

---

## Customization

- **Change tile images**: Replace `tiles/0.png` and `tiles/1.png` with your own images.
- **Adjust FPS**: Modify `FPS` in `player.js`.
- **Reduce lag**: Decrease `TILE_SIZE` or `DOWNSCALE_FACTOR`.
- **Increase visual size**: Increase `SCALE`.

---