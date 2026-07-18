# Scene icon replacement map

The card layouts are code-native and every rendered icon now carries:

```html
data-icon-name="crown"
data-icon-fallback="false"
```

To paste an exact SVG later, replace only the matching value in `ICONS` inside
`src/components/broadcastChrome.js`. Keep the `viewBox="0 0 24 24"` where
possible. The scene markup, cue controls, and animation selectors do not need
to change.

## Exact artwork still needed

The current SVGs are clean line-icon recreations. The following storyboard
icons have distinctive artwork that cannot be recovered pixel-for-pixel from
the raster reference. Supply the original SVGs for exact matching.

| Scene | Card or location | Icon key to replace | Reference artwork |
| --- | --- | --- | --- |
| 06 | Professional Creators | `user` | creator/person with small music mark |
| 06 | Participation Assets | `play` | outlined play triangle |
| 07 | Sustainable Creative Economy | `chart` | sprouting plant |
| 09 | Campaigns | `megaphone` | rounded megaphone |
| 09 | Events | `calendar` | calendar with two date dots |
| 10 | Choose Access Level | `crown` | person above crown |
| 10 | Receive Participation Assets | `gift` | document entering an inbox |
| 11 | LoopCode | `qr` | QR code with exact module pattern |
| 12 | Signature VIP | `crown` | three-point open crown |
| 13 | Builder | `user` | thumbs-up |
| 13 | Advocate | `people` | two-person outline |
| 13 | Partner | `handshake` | rounded handshake |
| 15 | Recognized Impact Pending | `chart` | hourglass |
| 15 | Recognized Impact Confirmed | `check` | award seal |
| 15 | Recognized Impact Released | `megaphone` | paper plane |
| 16 | Dashboard metrics | mixed | megaphone, people, heart, growth chart |
| 17 | Campaign cards and activity rail | mixed | star, waveform, play, trophy, user |
| 18 | Campaign detail modules | mixed | target, gift, shield, crown |
| 19 | Access cards | `user`, `crown` | people, filled crown, faceted diamond |
| 20 | Asset rows | mixed | note, play, user, starred calendar, community |
| 21 | LoopLink and LoopCode | `link`, `qr` | heavy rounded link and exact QR modules |
| 22 | Flow nodes | mixed | link, people, checked shield, growth chart |
| 23 | Qualification cards | mixed | clock, checked shield, starred shield, close circle |
| 24 | Explanation rows | mixed | hands-heart, checked shield, clipboard-check |
| 25 | Trust panels | mixed | scales, calendar, shield, megaphone, question chat |
| 26 | Events interface | mixed | video, people, star, chat and calendar icons |
| 27 | Event detail interface | mixed | calendar, clock, pin, play, document, people, cloud |
| 28 | Changemaker profiles | mixed | use the original profile/avatar assets if available |
| 29 | Creator story proof | mixed | use the original thumbnail/profile assets if available |
| 30 | Impact dashboard | mixed | link, clock, shield, impact badge, tier crown |
| 31 | Builder tracker | mixed | tier medals and milestone artwork |
| 32 | Leaderboard | mixed | rank medals, movement arrows and avatars |
| 33 | FAQ cards | mixed | question categories and plus controls |
| 34 | Enrollment CTA | mixed | QR surround and access-level icons |
| 35 | Next-step cards | mixed | email, chat, dashboard and LoopLink |
| 36 | Live Q&A | mixed | question/chat broadcast artwork |
| 37 | Enrollment progress | mixed | live metric and activity-feed artwork |

## Safe replacement rules

1. Paste SVG markup only into `ICONS`; do not insert it into scene catalog text.
2. Keep paths free of hard-coded fills. The CSS uses `currentColor` so each
   scene can apply its own cyan, blue, purple, or amber treatment.
3. If the supplied SVG requires fills, add `fill="currentColor"` only to the
   filled shapes and retain `stroke="currentColor"` for outlines.
4. Do not rename `data-control-cue` values. Those values drive the existing
   operator controls and card highlighting.

