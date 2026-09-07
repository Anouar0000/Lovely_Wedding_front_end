# Front-End - Digital Invitation Platform

This project is a React-based web application for luxury digital wedding invitations, featuring pixel-perfect visual fidelity to Figma designs, interactive animations, and a rich in-browser customization editor.

---

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.\
Correctly bundles React in production mode and optimizes the build for best performance.

---

# Digital Invitation Template Engineering Guide

> **Standard Operating Procedure (SOP)**  
> This guide defines the fixed, end-to-end architecture and workflow for introducing a new digital invitation template into the platform—from raw Figma nodes to a 1:1 pixel-perfect mirror, through dynamic reactivity, animations, and full editor integration.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TEMPLATE PIPELINE                                 │
├─────────────────┬─────────────────┬───────────────────┬─────────────────────┤
│  1. FIGMA DATA  │ 2. 1:1 MIRROR   │ 3. DYNAMIC INVITE │ 4. EDITOR & CONFIG  │
│  • AST JSON     │ • Coordinate Box│ • getText/getStyle│ • template.json     │
│  • Asset Export │ • Frozen Canvas │ • Countdown & Map │ • registry.js       │
│  • Reference PNG│ • Diff QA Tool  │ • Audio & Physics │ • Editor Controls   │
└─────────────────┴─────────────────┴───────────────────┴─────────────────────┘
```

---

## Table of Contents
1. [Architecture & File Structure](#1-architecture--file-structure)
2. [Step 1: Figma Data Extraction & Asset Preparation](#step-1-figma-data-extraction--asset-preparation)
3. [Step 2: Building the 1:1 Figma Mirror (`<Name>FigmaMirror.jsx`)](#step-2-building-the-11-figma-mirror-namefigmamirrorjsx)
4. [Step 3: Creating the Dynamic Template Component (`<Name>InvitePage.jsx`)](#step-3-creating-the-dynamic-template-component-nameinvitepagejsx)
5. [Step 4: Template JSON Configuration (`src/data/digital/templates/<id>.json`)](#step-4-template-json-configuration)
6. [Step 5: Registering the Template (`src/templates/digitalInviteTemplates.js`)](#step-5-registering-the-template)
7. [Step 6: Editor Integration (`src/pages/DigitalInviteEditorPage.jsx`)](#step-6-editor-integration)
8. [Step 7: Animations, Audio & Interactive Physics](#step-7-animations-audio--interactive-physics)
9. [Step 8: Quality Assurance & Pixel-Perfect Diff Verification](#step-8-quality-assurance--pixel-perfect-diff-verification)
10. [Critical Rules & Constraints](#critical-rules--constraints)

---

## 1. Architecture & File Structure

Every template follows a **dual-file separation of concerns**:

| File / Location | Role | Description |
| :--- | :--- | :--- |
| `src/pages/<Name>FigmaMirror.jsx` | **Static Ground Truth** | 1:1 pixel-perfect reproduction of the raw Figma canvas. Unaltered by user state, frozen as a benchmark for visual diff testing. |
| `src/pages/<Name>InvitePage.jsx` | **Dynamic Production Component** | Parameterized component reading from `inviteData`, supporting editor selection, live countdown, background audio, interactive timeline, and animations. |
| `src/data/digital/templates/<id>.json` | **Template Definition** | Metadata (name, thumbnail, price), default text/content, supported active sections, and fixed timeline steps. |
| `src/templates/digitalInviteTemplates.js` | **Central Registry** | Registers all available templates for pickers, routes, and preview handlers. |
| `src/pages/DigitalInviteEditorPage.jsx` | **Editor Control Schema** | Configures section-by-section editable element IDs, labels, and supported tool controls. |
| `public/assets/digital/<id>/` | **Static Assets** | High-res PNG textures, photos, and vector SVGs exported from Figma. |

---

## Step 1: Figma Data Extraction & Asset Preparation

### 1. Identify Canvas Dimensions
- Standardize the mobile portrait viewport at **`430px` width** (standard modern mobile canvas width).
- Note total canvas height (e.g., `3430px`, `4200px`).

### 2. Extract Figma AST (Abstract Syntax Tree)
Use the Figma MCP tool or REST API (`/v1/files/:key/nodes?ids=...`) to retrieve:
- Bounding boxes: `absoluteBoundingBox` (`x, y, width, height`).
- Render bounds: `absoluteRenderBounds` (includes drop shadows and blur margins).
- Typography: `fontFamily`, `fontSize`, `fontWeight`, `lineHeightPx`, `letterSpacing`, `textAlign`, and `textCase`.
- Fills & Strokes: Hex/RGBA colors, gradients, image fills, opacity.

> [!IMPORTANT]
> Always normalize child coordinates relative to the root frame origin $(x_0, y_0)$:
> $$\text{relativeX} = x_{\text{node}} - x_0, \quad \text{relativeY} = y_{\text{node}} - y_0$$

### 3. Asset Classification & Export
- **Vector Graphics & Icons**: Export as clean **SVG** (e.g., ocean wave dividers, geometric arches, seashell line-art).
- **Collage Elements, Textures & Photos**: Export as **3x lossless PNG** (`scale=3&format=png`).
  - *Why?* Figma embeds low-res compressed base64 images when exporting complex bitmap fills to SVG. 3x PNG preserves crisp paper grain, photo fidelity, and alpha transparency.
- **Reference Overlay**: Export a full-length 2x PNG snapshot of the entire Figma frame (used for the diff comparison slider).

---

## Step 2: Building the 1:1 Figma Mirror (`<Name>FigmaMirror.jsx`)

The mirror component serves as the permanent, immutable benchmark.

### 1. Canvas Container
```jsx
export default function MyTemplateFigmaMirror() {
  return (
    <div
      className="relative mx-auto overflow-hidden bg-[#FBF8F3] text-stone-800"
      style={{ width: 430, minHeight: 3430 }}
    >
      {/* Absolute Figma Nodes */}
    </div>
  );
}
```

### 2. Coordinate Helper (`figmaBox`)
Use a helper to translate Figma AST properties directly to CSS:
```javascript
const figmaBox = ({ x, y, width, height, zIndex = 1, ...extra }) => ({
  position: 'absolute',
  left: `${x}px`,
  top: `${y}px`,
  width: `${width}px`,
  height: `${height}px`,
  zIndex,
  ...extra,
});
```

### 3. Rotated Elements Geometry
When an element in Figma has a rotation $\theta \neq 0$, the API provides an Axis-Aligned Bounding Box (AABB) rather than unrotated width/height.
- To avoid distortion or offset rotation centers, solve the linear system for unrotated dimensions $(W, H)$ and position at $(X_c - W/2, Y_c - H/2)$ with `transformOrigin: "center center"`.
- Detailed formulas and examples are documented in [`FIGMA_PIXEL_PERFECT_GUIDE.md`](./FIGMA_PIXEL_PERFECT_GUIDE.md).

### 4. Typography & Optical Tuning
- **Text Case**: Apply `textTransform: 'uppercase'` or `'capitalize'` matching Figma's `style.textCase`.
- **Line Heights**: Explicitly specify `lineHeight: '...px'`.
- **Arabic & Bilingual Titles**:
  > [!NOTE]
  > Browser typography engines calculate font ascenders/descenders differently from Figma (especially for Arabic fonts like Amiri or Katibeh). 
  > Bilingual section titles (e.g. English + Arabic) often require an optical $+5\text{px}$ downward nudge on $y$ and explicit `lineHeight: 1` to align optically with English text.

---

## Step 3: Creating the Dynamic Template Component (`<Name>InvitePage.jsx`)

Duplicate the mirror file to create the dynamic component, replacing static values with reactive state and data hooks.

### 1. Component Interface
```jsx
export default function MyTemplateInvitePage({
  invite = {},
  editable = false,
  activeSection = null,
  onSelectElement = null,
  selectedElementId = null,
}) {
  const currentInvite = { ...defaultTemplateData, ...invite };
  // ...
}
```

### 2. Dynamic Text & Style Resolvers
Abstract hardcoded strings and styles through fallback getters:
```javascript
const getText = (id, fallback) => {
  return currentInvite.customTexts?.[id] ?? fallback;
};

const getStyle = (id, defaultStyle = {}) => {
  const custom = currentInvite.customStyles?.[id] || {};
  return { ...defaultStyle, ...custom };
};
```

### 3. Click-to-Select in Editor Mode
Allow users to click any element in the iframe to highlight its controls in the editor:
```jsx
const makeSelectable = (id, baseStyle) => ({
  ...getStyle(id, baseStyle),
  cursor: editable ? 'pointer' : 'default',
  outline: editable && selectedElementId === id ? '2px solid #2563EB' : undefined,
  outlineOffset: '2px',
});

// JSX usage:
<h1
  style={makeSelectable('hero-names', figmaBox({ x: 40, y: 320, width: 350, height: 120 }))}
  onClick={(e) => {
    if (editable) {
      e.stopPropagation();
      onSelectElement?.('hero-names');
    }
  }}
>
  {getText('hero-names', "Houssem & Dorra")}
</h1>
```

### 4. Dynamic Business Logic
- **Live Countdown**: Calculate remaining days, hours, minutes, seconds from `currentInvite.eventDate`.
- **Audio Player**: Embed `<AudioPlayer src={currentInvite.musicUrl} autoPlay={...} />`.
- **Google Maps Redirection**: Wire the location button to open `currentInvite.mapAddress || currentInvite.mapUrl`.
- **RSVP Action**: Trigger a modal or direct WhatsApp link populated with guest confirmation details.

---

## Step 4: Template JSON Configuration

Create `src/data/digital/templates/<template-id>.json`:

```json
{
  "id": "brezza-marina",
  "label": "Brezza Marina",
  "name": "Brezza Marina E-invite",
  "price": "90",
  "thumbnail": "assets/digital/brezza-marina/thumbnail.png",
  "description": "Une invitation digitale côtière et élégante aux teintes marines...",
  "features": [
    "Compte à rebours",
    "Programme interactif",
    "Lien personnalisé",
    "RSVP en ligne",
    "Localisation Google Maps"
  ],
  "format": "Landing page",
  "previewPath": "/digital-invitation/brezza-marina",
  "defaults": {
    "template": "brezza-marina",
    "coupleNames": "Houssem & Dorra",
    "eventDate": "2026-06-15",
    "heroQuote": "L'amour n'est qu'un mot, jusqu'à ce que quelqu'un vienne lui donner un sens.",
    "venueName": "Dar Bouraoui Carthage Malaga",
    "city": "Carthage Malaga",
    "mapUrl": "https://maps.google.com",
    "mapAddress": "Dar Bouraoui Carthage Malaga",
    "ourStoryTitle": "Hi, it’s\nUs !",
    "ourStoryText": "Placeat accusamus...",
    "dressCodeText": "Nous prions nos invités d'éviter de porter du blanc et du noir",
    "rsvpDeadline": "the fifteenth of June, 2026",
    "timeline": [
      { "name": "Accueil", "time": "17:00" },
      { "name": "Contrat\nde mariage", "time": "18:00" },
      { "name": "Fête", "time": "20:00" },
      { "name": "Photos", "time": "22:00" },
      { "name": "La fin", "time": "02:00" }
    ],
    "activeSections": [
      "hero",
      "countdown",
      "location",
      "our-story",
      "timeline",
      "dress-code",
      "rsvp",
      "footer"
    ],
    "animationType": "fade-up",
    "animationDuration": 1.2,
    "musicUrl": ""
  },
  "fixedTimelineSteps": [
    "Accueil",
    "Contrat de mariage",
    "Fête",
    "Photos",
    "La fin"
  ]
}
```

---

## Step 5: Registering the Template

Register the new template in `src/templates/digitalInviteTemplates.js`:

```javascript
import MyTemplateInvitePage from "../pages/MyTemplateInvitePage";
import myTemplateConfig from "../data/digital/templates/my-template.json";

export const DIGITAL_TEMPLATE_IDS = {
  // ...
  MY_TEMPLATE: myTemplateConfig.id,
};

export const digitalInviteTemplates = [
  // ...
  {
    id: myTemplateConfig.id,
    label: myTemplateConfig.label,
    description: myTemplateConfig.description,
    Component: MyTemplateInvitePage,
    defaults: myTemplateConfig.defaults,
    fixedTimelineSteps: myTemplateConfig.fixedTimelineSteps,
  },
];
```

---

## Step 6: Editor Integration

Register the template's editable sections and controls in `src/pages/DigitalInviteEditorPage.jsx` inside `getElementsForSection(sectionId, templateId)`:

```javascript
const getElementsForSection = (sectionId, templateId) => {
  if (templateId === 'my-template') {
    switch (sectionId) {
      case 'hero': return [
        { id: 'hero-subtitle', label: 'Texte de la Citation', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "..." },
        { id: 'hero-names', label: 'Noms des Mariés', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "..." }
      ];
      case 'location': return [
        { id: 'location-venue', label: 'Nom du Lieu', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "..." },
        { id: 'location-btn', label: 'Bouton Carte ("Open in maps")', controls: ['text', 'mapAddress', 'font', 'fontSize', 'color'], defaultText: "Open in maps" }
      ];
      case 'our-story': return [
        { id: 'story-photo', label: 'Photo du Couple', controls: ['upload'] },
        { id: 'story-card-title', label: 'Titre Carte Postale', controls: ['text', 'font', 'fontSize', 'color'] }
      ];
      // Configure remaining sections...
      default: return [];
    }
  }
  
  // Sidi Bou Said fallback...
};
```

### Supported Control Types:
- `'text'`: Single-line or multi-line text editing.
- `'font'`: Font family selector.
- `'fontSize'`: Font size slider / number input.
- `'color'`: Color picker with hex/palette support.
- `'mapAddress'`: Physical address or Google Maps URL input.
- `'upload'`: Image uploader with preview.
- `'musicUpload'`: Audio MP3 selector/uploader.
- `'position'`: X and Y coordinate nudging (when applicable).

---

## Step 7: Animations, Audio & Interactive Physics

### 1. Scroll-Driven Reveal Animations (`.reveal`)
- Use an `IntersectionObserver` that attaches `.revealed` to elements as they scroll into view.
- **Scroll Parent Gotcha**: In public mode, scrolling occurs on `window`. In the editor iframe, scrolling occurs inside an `.overflow-y-auto` container. The observer must listen to both or omit root to observe viewport intersection:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.15 });
```

> [!WARNING]
> **CSS Transform Collision**: Never apply `.reveal` directly to elements that have intrinsic CSS rotation (e.g. `transform: rotate(90deg)` on vertical ocean stripes). `.reveal.revealed { transform: translateY(0); }` will overwrite the rotation!  
> **Solution**: Place `.reveal` on an outer container and keep the rotation on an inner child, or isolate the transform.

### 2. Interactive Physics (e.g. Draggable Timeline Pearl)
- Model the trajectory mathematically (e.g. sinusoidal wave curve: $y(x) = y_0 + A \cos(\omega x)$).
- Wire unified `pointerdown`, `pointermove`, and `pointerup` handlers.
- Track client coordinates, clamp along the curve, detect nearest milestone, and snap smoothly upon release.

---

## Step 8: Quality Assurance & Pixel-Perfect Diff Verification

1. **Overlay Comparison Tool**:
   - Open `/preview` or `IframePreviewPage`.
   - Use the QA Diff Toolbar to overlay the 2x Figma reference screenshot directly over the React mirror.
   - Adjust the **Opacity Slider** (0% to 100%) to verify 0px drift on typography, vectors, and imagery.
2. **Mobile Viewport Scaling**:
   - Verify that the `430px` canvas is smoothly scaled on smaller mobile viewports (`360px` - `414px`) via CSS transform scaling:
     $$\text{scaleFactor} = \min(1, \frac{\text{windowWidth}}{430})$$
3. **Editor Live Updates**:
   - Open `/editor/:inviteId`.
   - Verify that modifying texts, fonts, colors, and images in the sidebar instantly updates the iframe canvas without flickering or layout jumps.

---

## Critical Rules & Constraints

- **Protected Files**: Never modify `src/pages/SidiBouSaidFigmaMirror.jsx`. It remains frozen as the project's permanent 1:1 benchmark.
- **Terminal Constraints**: Never run `git commit`, `git push`, or `firebase deploy` commands automatically.
- **Section Titles Optical Invariance**: Preserve the manual $-5\text{px}$ optical adjustments and explicit `lineHeight: 1` on bilingual section titles (`BrezzaMarinaFigmaMirror.jsx` & `BrezzaMarinaInvitePage.jsx`) to avoid browser rendering regressions.
