# Antigravity AI Coding Rules

## Execution Constraints
- NEVER execute git commit commands (`git commit`).
- NEVER execute git push commands (`git push`).
- NEVER execute firebase deployment commands (`firebase deploy`).
- If a commit, push, or deployment is needed to complete a task, list the exact commands and instruct the user to run them manually in their terminal.

## Protected Files (DO NOT MODIFY)
- NEVER modify or touch `src/pages/SidiBouSaidFigmaMirror.jsx`. It must remain permanently frozen as the 1:1 Figma AST benchmark.
- NEVER modify or touch `src/pages/BridgertonFigmaMirror.jsx`. It must remain permanently frozen as the 1:1 Figma AST benchmark.
- NEVER modify or touch `src/pages/MajesticWhiteFigmaMirror.jsx`. It must remain permanently frozen as the 1:1 Figma AST benchmark.
- NEVER modify or touch `src/pages/ClubCapriFigmaMirror.jsx`. It must remain permanently frozen as the 1:1 Figma AST benchmark.

## Design & UI Constraints
- **Club Capri Template Constraints**:
  - Canvas dimensions: 430px × 3454px.
  - Global background: `#FFFBF0` cream rectangle from `y: 508` to `3454`.
  - Hero sea background photo at `(x: 0, y: 0, w: 432, h: 601)` with gradient fade to cream at `y: 517`.
  - Cassette tape player at `(x: 108, y: 227, w: 211, h: 133)` with 11 volume ticks spanning `x: 183` to `283`.
  - Postcards: Wedding card at `y: 1324` and Henna card at `y: 1656`, both with stamps, postmark rings, photos, and handwritten cursive address fields.
  - RSVP stamp frame at `(x: 18, y: 2636, w: 394, h: 569)` overlaid on beach boat background `rsvp-bg.png` (`y: 2623` to `3224`), sealed with masking tape at `(x: 119, y: 2627, w: 191, h: 32)`.
  - Footer lifebuoy at `(x: 172, y: 3277, w: 86, h: 86)` centered over striped bands and "club Capri" signature.
- **Brezza Marina Section Titles**: DO NOT overwrite the specific `y` coordinates or typography rules for the English and Arabic section titles (Countdown, Location, Our Story, Timeline, Dress Code) in `BrezzaMarinaFigmaMirror.jsx` and `BrezzaMarinaInvitePage.jsx`. They have been manually nudged (shifted down by 5px with optimized spacing) and explicitly given `lineHeight: 1` to fix optical browser rendering issues. Do not revert them to raw Figma API bounding boxes.
- **Bridgerton Template Constraints**:
  - `maxWidth: "none"` must always be maintained on the torn paper SVG elements in `BridgertonFigmaMirror.jsx` and `BridgertonInvitePage.jsx` to avoid Tailwind's preflight shrinking them down to 430px.
  - The Date (`23\n11\n26`) and RSVP title/deadline must remain at `zIndex: 6` so they sit visibly over the overlapping torn paper edges.
  - "Leave a message" background banner image must keep `backgroundSize: "100% 100%"` (no-repeat) to preserve Figma's exact framing without zoom-cropping the couple.
- **Majestic White Template Constraints**:
  - `y: 415px` for Hero Date optical match.
  - Form field labels in RSVP must maintain optical `y` offsets (`top: -6px`, `top: 68px`, `top: 142px`, `top: 217px`) for exact 8px gap above inputs.
  - Separate pearl assets `pearl-right.png` (159x285) and `pearl-left.png` (227.35x316.44) with exact coordinates must be preserved.
  - Flower wax seal at `(x: 296, y: 1918, w: 100, h: 108)` uses tightly cropped `wax-seal.png` with `objectFit: "cover"`.
  - Global background uses exact gradient render `bg-gradient.png` at `(x: 0, y: 652, w: 430, h: 3534)`.
- **Dolce Vita Template Constraints**:
  - Canvas dimensions: 430px × 3050px.
  - Global background: Pure `#FFFFFF` across the entire canvas (no cream/beige outer card margins).
  - Typography: `Taprom` for script headers (Hero title, Countdown, Location, Timeline, Menu courses, Footer names), `Crimson Text` for serif text and labels, `Homemade Apple` for timeline handwriting.
  - Menu section: Mixed case (not all-caps) for menu dish descriptions to avoid horizontal overflow into plate graphics.
  - RSVP Form: 1px solid gold borders (`#E8CC33`), `borderRadius: 5px`, `height: 47px`, transparent inputs, and custom 14px radio buttons with gold borders and navy `#130554` active state.

## Template Isolation Constraints
- **Strict Template Scope**: NEVER edit or touch files, components, styles, assets, or template data belonging to another template while working on a specific template. Stay strictly and exclusively within the boundaries of the target template requested by the user.

## Mirror QA Overlay Standard (MANDATORY)
- **Standard Figma Overlay QA Menu**: NEVER create custom overlay menus, range inputs/sliders, or alternative floating bars for Figma mirror benchmarks.
- ALWAYS use the exact existing standard floating toolbar structure across all `*FigmaMirror.jsx` pages:
  - Container: Fixed at bottom 20px, centered (`left: 50%`, `transform: translateX(-50%)`), dark blur pill background (`rgba(15, 23, 42, 0.92)`, `backdropFilter: blur(12px)`), `border: 1px solid #334155`, `borderRadius: 30px`, `zIndex: 100000`.
  - Header label: `<span style={{ fontWeight: 600, color: "#38BDF8" }}>Figma Overlay QA:</span>`.
  - Opacity buttons: `[0, 0.25, 0.5, 0.75, 1]` with labels `"Off"` and `${op * 100}%`, active background `#38BDF8` with text `#0F172A`, inactive background `#334155` with text `#FFFFFF`.
  - Diff mode toggle: Checkbox labeled `Diff Mode` with border separator `borderLeft: 1px solid #475569`.
  - Reference image overlay: Absolute at `top: 0`, `left: 0`, `width: CANVAS_WIDTH`, `height: CANVAS_HEIGHT`, `pointerEvents: "none"`, `zIndex: 99999`, and `mixBlendMode: isDiffMode ? "difference" : "normal"`.



