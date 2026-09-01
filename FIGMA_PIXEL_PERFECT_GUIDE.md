# Figma-to-Web 100% Accuracy: Learnings, Root Causes & Solutions

This document records the exact issues encountered, root causes identified, and mathematical/architectural solutions applied while creating the 100% pixel-perfect static mirror of the **Sidi Bou Said** design (`1027:62`) from Figma.

---

## Table of Contents
1. [Typography & Text Transformations (`textCase`)](#1-typography--text-transformations-textcase)
2. [Font Rendering & Stem Weight Differences](#2-font-rendering--stem-weight-differences)
3. [Rotated Elements Geometry (AABB vs. Unrotated Box)](#3-rotated-elements-geometry-aabb-vs-unrotated-box)
4. [Raster Asset Export: SVG Wrappers vs. High-Res PNGs](#4-raster-asset-export-svg-wrappers-vs-high-res-pngs)
5. [Image Dimensions: `absoluteBoundingBox` vs. `absoluteRenderBounds`](#5-image-dimensions-absoluteboundingbox-vs-absoluterenderbounds)
6. [Component Stacking & Layer Hierarchy (`z-index`)](#6-component-stacking--layer-hierarchy-z-index)
7. [Flexbox Approximations vs. Direct Figma Coordinate Mapping](#7-flexbox-approximations-vs-direct-figma-coordinate-mapping)
8. [Automated AST Extraction Checklist](#8-automated-ast-extraction-checklist)

---

## 1. Typography & Text Transformations (`textCase`)

### The Problem
Some text elements in the web build had lowercase letters or didn't match the casing of the Figma canvas (e.g., `"Haifa Palace Mornag"` appearing in mixed case instead of all-caps `HAIFA PALACE MORNAG`, or `"our happy ever after..."` missing title-case capitalization).

### Why It Happens
In the Figma API, a text node has two separate pieces of data:
1. `node.characters`: The raw string typed by the designer (often typed in lowercase or mixed case, e.g., `"Haifa Palace Mornag"`).
2. `node.style.textCase`: A styling property set in Figma's typography panel.

If you only read `node.characters` without inspecting `node.style.textCase`, the rendered text will lack the designer's casing rules.

### How We Solved It
We mapped Figma's `textCase` to CSS `text-transform`:
- `textCase === "UPPER"` -> `textTransform: "uppercase"`
- `textCase === "TITLE"` -> `textTransform: "capitalize"` (or manual capitalization per line)
- `textCase === "LOWER"` -> `textTransform: "lowercase"`

```javascript
let textTransform = undefined;
if (s.textCase === 'UPPER') textTransform = 'uppercase';
else if (s.textCase === 'TITLE') textTransform = 'capitalize';
else if (s.textCase === 'LOWER') textTransform = 'lowercase';
```

---

## 2. Font Rendering & Stem Weight Differences

### The Problem
Delicate serif fonts (like `Antic Didone` and `Cormorant`) appeared noticeably thinner and fainter in the browser on dark backgrounds compared to Figma.

### Why It Happens
1. **CSS Font Smoothing**: Global CSS often includes `-webkit-font-smoothing: antialiased;` and `-moz-osx-font-smoothing: grayscale;`. On white text over colored/dark backgrounds, subpixel antialiasing is stripped, causing browser text stems to appear thinner than Figma's canvas renderer (Skia/WebGL).
2. **Missing Font Styles / PostScript Variants**: Figma text nodes specify `fontPostScriptName` (e.g., `CormorantInfant-Italic`, `Cormorant-Bold`). If `fontStyle: "italic"` or `fontWeight` is omitted in CSS, the browser defaults to normal upright regular font.

### How We Solved It
1. Explicitly mapped `fontStyle: "italic"` whenever `fontPostScriptName.includes('Italic')` or `style.italic === true`.
2. Applied exact Google Font weights (`fontWeight: 400`, `500`, `600`, `700`) as specified in `style.fontWeight`.

---

## 3. Rotated Elements Geometry (AABB vs. Unrotated Box)

### The Problem
Rotated elements (such as the quote `"Our Happy Ever After Starts Now"` rotated at `-10deg`) were rendered at the wrong position, scaled incorrectly, and shifted away from the torn paper background.

### Why It Happens
In the Figma API, when an element is rotated by an angle theta:
- `absoluteBoundingBox` is the **Axis-Aligned Bounding Box (AABB)** that encloses the rotated shape (`W_AABB = 247.54px`, `H_AABB = 99.68px`).
- In CSS, `transform: rotate(-10deg)` with `transform-origin: center center` expects an **unrotated container** (W, H) that it will rotate around its center.
- Setting the CSS container's width/height to the AABB values distorts the box and shifts the center of rotation.

### How We Solved It (Linear Algebra)
The relationship between an unrotated box (W, H) and its AABB at angle theta is:
$$\begin{cases} W \cos(\theta) + H \sin(\theta) = W_{\text{AABB}} \\ W \sin(\theta) + H \cos(\theta) = H_{\text{AABB}} \end{cases}$$

For theta = 10deg (\cos(10deg) = 0.9848, \sin(10deg) = 0.1736):
$$\begin{cases} 0.9848 W + 0.1736 H = 247.54 \\ 0.1736 W + 0.9848 H = 99.68 \end{cases}$$

Solving this system yields:
- **Unrotated Width (W)**: `241.00px`
- **Unrotated Height (H)**: `58.72px`
- **Center of Rotation**: `(X_c, Y_c) = (128.77px, 207.84px)`
- **CSS Left**: `X_c - W/2 = 128.77 - 120.50 = 8.27px`
- **CSS Top**: `Y_c - H/2 = 207.84 - 29.36 = 178.48px`

```jsx
<div
  style={{
    position: "absolute",
    left: "8.27px",
    top: "178.48px",
    width: "241px",
    height: "59px",
    transform: "rotate(-10deg)",
    transformOrigin: "center center",
    fontFamily: "'Cormorant', serif",
    fontSize: "12px",
    lineHeight: "18px",
    letterSpacing: "1.2px",
    textAlign: "center",
    color: "rgba(73, 96, 107, 1)",
    zIndex: 4
  }}
>
  Our Happy Ever After<br />Starts<br />Now
</div>
```

---

## 4. Raster Asset Export: SVG Wrappers vs. High-Res PNGs

### The Problem
Collage assets (torn paper, decorative tape, stamps, couple sketch) looked blurry, clipped at the edges, or had strange aspect ratio distortion.

### Why It Happens
In Figma, these collage elements are rectangles with **bitmap image fills** (`scaleMode: "FILL"`). When exported using `format=svg`, Figma embeds a low-resolution base64 raster inside an SVG `<image>` tag with rigid viewBox clipping.

### How We Solved It
We exported all raster collage elements as **lossless 3x PNGs** via the Figma API:
```bash
GET /v1/images/:file_key?ids=1401:115,1401:113,1405:120,1405:121,1401:111&scale=3&format=png
```
This preserves full edge transparency, paper grain texture, and unclipped shadows.

---

## 5. Image Dimensions: `absoluteBoundingBox` vs. `absoluteRenderBounds`

### The Problem
Exported PNG assets looked visibly smaller and squished compared to the Figma layout overlay.

### Why It Happens
- `absoluteBoundingBox`: The inner geometric rectangle of the Figma node.
- `absoluteRenderBounds`: The actual pixel bounding box exported by Figma (including drop shadows, paper edges, and blur margins).
- When Figma exports a node to PNG, the image dimensions correspond to **`absoluteRenderBounds`**.
- If CSS forces `width` and `height` to the smaller `absoluteBoundingBox`, the browser squishes and scales down the image.

### Comparison Table:
| Asset | Exported Native Dimensions (1x) | `absoluteBoundingBox` (Squished) | `absoluteRenderBounds` (Exact) |
| :--- | :--- | :--- | :--- |
| **Torn Paper** | 222.6px x 164.5px | 214.6px x 156.5px | **X: 15.5px, Y: 121.5px, W: 222.6px, H: 164.5px** |
| **Back Stamp** | 67.5px x 101.4px | 59.5px x 93.4px | **X: 309.0px, Y: 213.0px, W: 67.5px, H: 101.4px** |
| **Front Stamp** | 57.1px x 86.0px | 57.1px x 86.0px | **X: 314.2px, Y: 219.7px, W: 57.1px, H: 86.0px** |
| **Couple Sketch** | 233.6px x 179.3px | 226.9px x 176.0px | **X: 184.5px, Y: 79.3px, W: 233.6px, H: 179.3px** |
| **Tape** | 114.0px x 52.0px | 113.9px x 51.7px | **X: 260.0px, Y: 69.0px, W: 114.0px, H: 52.0px** |

### How We Solved It
Always set the CSS `width`, `height`, `left`, and `top` to match the **`absoluteRenderBounds`** of the exported node.

---

## 6. Component Stacking & Layer Hierarchy (`z-index`)

### The Problem
Stamps or tape were rendering underneath illustrations instead of overlapping them naturally.

### Why It Happens
In Figma, layer order is determined by the child array index (items later in the array render on top of earlier items). In CSS, if all elements are `position: absolute` with default `z-index`, DOM order determines stacking, but mixed wrappers can break this.

### How We Solved It
We extracted the exact index in parent for all collage layers and assigned explicit `z-index` values:
1. `Watercolor Bougainvillea` (index 1) -> `z-index: 2`
2. `Couple Sketch` (index 85) -> `z-index: 3`
3. `Torn Paper` (index 87) -> `z-index: 3`
4. `Tape` (index 86) -> `z-index: 4`
5. `Quote Text` (index 88) -> `z-index: 4`
6. `Back Stamp` (`1405:120`, index 89) -> `z-index: 5`
7. `Front Stamp` (`1405:121`, index 90) -> `z-index: 6`

---

## 7. Flexbox Approximations vs. Direct Figma Coordinate Mapping

### The Problem
Using standard flex containers (e.g. `display: flex; gap: 10px; justify-content: center`) for complex date grids (like the Celebrations date and divider lines) caused alignment drift against the Figma overlay.

### Why It Happens
In Figma, graphic designers place date numbers (`20`), weekdays (`Monday`), months (`July`), years (`2026`), and decorative divider lines at specific optical coordinates rather than equal-spaced flex columns.

### How We Solved It
We mapped every date number, weekday, and all 4 horizontal divider lines (`Line 2`, `Line 3`, `Line 4`, `Line 5`) to their exact Figma (X, Y, W, H) bounding boxes within isolated **U-Blocks**:
- Monday: (X: 90px, Y: 1848px)
- Number 20: (X: 181px, Y: 1838px)
- July: (X: 232px, Y: 1847px)
- 2026: (X: 176px, Y: 1863px)
- Top Lines: Y: 1840px, Width: 67px
- Bottom Lines: Y: 1876px, Width: 67px

---

## 8. Automated AST Extraction Checklist

When building 100% pixel-perfect Figma mirrors in the future, follow this checklist:

1. **Query Full AST**: Fetch the root node JSON via `get_figma_data` or the Figma REST API.
2. **Export Reference Overlay**: Download a 2x PNG snapshot of the entire frame for live visual diff testing.
3. **Asset Classification**:
   - Pure vector shapes -> Export as lossless SVG.
   - Image fills, paper textures, stamps, photos -> Export as 3x PNG.
4. **Use absoluteRenderBounds**: Set CSS dimensions to match `absoluteRenderBounds` rather than `absoluteBoundingBox` to prevent squishing.
5. **Solve Rotations**: For any node with `rotation !== 0`, solve the AABB linear system for unrotated (W, H) and place at `(X_c - W/2, Y_c - H/2)` with `transform-origin: center center`.
6. **Inspect Typography Style**:
   - Apply `style.textCase` (`UPPER` -> `uppercase`, `TITLE` -> `capitalize`).
   - Check `style.fontPostScriptName` for italic variants.
   - Apply exact `letterSpacing` (in px) and `lineHeightPx`.
7. **Verify via Diff Mode**: Toggle the built-in QA Diff Mode toolbar to confirm 0px visual drift across all sections.
