# Digital Template Editing Guide

Each template has its own JSON file in this folder.

- `dolce-vita.json`
- `sidi-bousaid.json`

## Content

Edit the variable text shown in previews inside `sample`.

Edit the blank/default values used by the dashboard inside `defaults`.

Text that should not be edited by customers lives in `fixedText`.

Timeline labels and their matching image keys live in `fixedTimelineSteps`.
The invitation `timeline` rows only store editable times, in the same order as those fixed steps.

Example:

```json
"sample": {
  "title": "La Dolce Vita",
  "coupleNames": "Bilel & Dorra"
},
"fixedText": {
  "introLabel": "We are getting married",
  "introText": "We would like to invite you to celebrate with us the most special day of our lives",
  "locationIntro": "The ceremony will take place at",
  "closingText": "We hope you can make it"
},
"fixedTimelineSteps": [
  { "title": "accueil des invites", "image": "accueil" },
  { "title": "arrivee des maries", "image": "arrivee" }
],
"defaults": {
  "timeline": [
    { "time": "20h" },
    { "time": "20h30" }
  ]
}
```

## Text Style

Edit visual text styling inside `design`.

Hero text:

```json
"hero": {
  "intro": {
    "fontFamily": "Urbanist, sans-serif",
    "fontSize": 8,
    "fontWeight": 400,
    "fontStyle": "normal",
    "letterSpacing": "0.1em",
    "textTransform": "uppercase"
  },
  "title": {
    "fontFamily": "\"Pinyon Script\", cursive",
    "fontSize": 46
  }
}
```

Section text:

```json
"sections": {
  "heading": {},
  "smallText": {},
  "countdownValue": {},
  "countdownLabel": {},
  "locationName": {},
  "timelineTime": {},
  "timelineTitle": {},
  "timelineSubtitle": {},
  "closingText": {},
  "closingNames": {}
}
```

Common values:

- `fontFamily`: `"Urbanist, sans-serif"`, `"\"Pinyon Script\", cursive"`, `"Crimson Text, sans-serif"`, or `"Taprom, cursive"`
- `fontSize`: number in pixels
- `fontWeight`: `400`, `600`, `700`
- `fontStyle`: `"normal"` or `"italic"`
- `color`: hex color like `"#130554"`
- `letterSpacing`: `"0.1em"`
- `textTransform`: `"uppercase"` or `"none"`

## Position and Size

Images and absolute blocks use:

```json
{ "top": 8, "left": "50%", "width": 126, "transform": "translateX(-50%)" }
```

Numbers are pixels. Strings can be CSS values like `"50%"`, `"100%"`, or `"auto"`.

Timeline positions are controlled by `timelineItems`.

```json
"timelineItems": [
  { "top": -10, "left": 35, "width": 65, "textAlign": "right", "timeTextAlign": "left" },
  { "top": 20, "right": 49, "width": 65, "textAlign": "right", "timeTextAlign": "right" }
]
```

`textAlign` controls the title. `timeTextAlign` controls the time below it.

`stageHeight` controls the editable timeline area. `timelineImages` controls the fixed image position for each step. `timelineArrows` controls the arrow positions between visible steps. The arrow assets cycle in order: `arrow1`, `arrow2`, `arrow3`, `arrow4`.

The first invitation timeline entry uses the first position, the second entry uses the second position, and so on. If an invite has more timeline entries than the configured list, extra entries are placed automatically using:

```json
"timeline": {
  "itemGap": 110
}
```

