# OBS Presentation Review Handoff

Branch: `experiment/scene37-foreground-blockout`

The generated review package is intentionally excluded from Git because it is
approximately 214 MB. Generate or refresh it with `npm run review:capture`; the
local output is `review-package/README.md` with screenshots, overlays, diffs,
alpha reports, contact sheets, and motion recordings beneath that directory.

## Browser-source URLs

These are the exact local review URLs for Scene 01. Replace `01` only with the
required two-digit scene number after deploying the same build.

- Underlay (Z0/Z1): `http://127.0.0.1:4173/?scene=01&mode=live&output=obs&render=underlay&clean=true&dataMode=live&sessionId=open_enrollment_2026`
- Foreground (Z3 plus global ticker): `http://127.0.0.1:4173/?scene=01&mode=live&output=obs&render=foreground&clean=true&dataMode=live&sessionId=open_enrollment_2026`
- Composite review: `http://127.0.0.1:4173/?scene=01&mode=live&output=obs&render=composite&clean=true&dataMode=live&sessionId=open_enrollment_2026`
- Reference: `http://127.0.0.1:4173/?scene=01&mode=reference&output=obs&render=composite&clean=true&paused=true&ticker=hide`
- Overlay: `http://127.0.0.1:4173/?scene=01&mode=overlay&output=obs&render=composite&clean=true&paused=true&refOpacity=0.5&refOnTop=true&overlayView=both&ticker=hide`
- Operator view: `http://127.0.0.1:4173/?scene=01&mode=live&output=storyboard&render=composite&dataMode=live&sessionId=open_enrollment_2026`

OBS source order from back to front is Underlay browser, Presenter camera, then
Foreground browser. Both browser sources use 1920×1080. Use
`dataMode=simulated` for rehearsal. Scenes 38 and 39 mute the ticker by default;
append `ticker=show` to override that behavior.

## Verification evidence

- `npm run build`: pass.
- `npm run test:scenes`: 50 passed. This includes all four outputs for all 39
  scenes, layer cue behavior, ticker persistence and controls, Scene 36 operator
  selection, production API scope and value updates for Scenes 01/08/37, and
  transparent foreground checks for every scene.
- `npm run test:visual`: 46 passed after reviewed stale baselines were refreshed.
- `npm run review:capture`: pass; 39 scenes captured and all foreground alpha
  checks passed.
- `npm run visual:scene39`: geometry passes for every locked region; the strict
  pixel-style comparator reports 71.26% and therefore remains non-zero.

## Known limitations and targeted questions

1. The supplied API contract has no dedicated `questions_answered` field.
   Scene 37 prefers that field when supplied and otherwise uses
   `session-stats.actions_this_session`. Confirm the intended backend mapping.
2. Scene 39's locked geometry matches its accepted coordinates, but its supplied
   browser assets differ from reference-only presenter photography, brand mark,
   and QR artwork. Confirm the production brand/QR assets before requiring the
   strict 95% pixel comparator to pass. The geometry was not redesigned.
3. Presenter imagery is the OBS Z2 camera source, so browser-only comparison
   images deliberately exclude the live presenter.
4. Priority announcements are local operator events synchronized through
   `localStorage`/`BroadcastChannel`. The admin-only backend POST endpoint is not
   called from a public browser source.
5. Ticker persistence assumes scene browser sources share the same OBS browser
   profile/storage. Separate isolated browser profiles cannot share local state.
