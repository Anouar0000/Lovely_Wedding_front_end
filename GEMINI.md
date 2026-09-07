# Antigravity AI Coding Rules

## Execution Constraints
- NEVER execute git commit commands (`git commit`).
- NEVER execute git push commands (`git push`).
- NEVER execute firebase deployment commands (`firebase deploy`).
- If a commit, push, or deployment is needed to complete a task, list the exact commands and instruct the user to run them manually in their terminal.

## Protected Files (DO NOT MODIFY)
- NEVER modify or touch `src/pages/SidiBouSaidFigmaMirror.jsx`. It must remain permanently frozen as the 1:1 Figma AST benchmark.

## Design & UI Constraints
- **Brezza Marina Section Titles**: DO NOT overwrite the specific `y` coordinates or typography rules for the English and Arabic section titles (Countdown, Location, Our Story, Timeline, Dress Code) in `BrezzaMarinaFigmaMirror.jsx` and `BrezzaMarinaInvitePage.jsx`. They have been manually nudged (shifted down by 5px with optimized spacing) and explicitly given `lineHeight: 1` to fix optical browser rendering issues. Do not revert them to raw Figma API bounding boxes.
