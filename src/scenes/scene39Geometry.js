export const SCENE_39_GEOMETRY = Object.freeze({
  presenterSafe: Object.freeze({ x: 0, y: 96, width: 596, height: 907 }),
  brand: Object.freeze({ x: 47, y: 38, width: 369, height: 132 }),
  endBadge: Object.freeze({ x: 1717, y: 35, width: 143, height: 67 }),
  headline: Object.freeze({ x: 619, y: 198, width: 790, height: 162 }),
  divider: Object.freeze({ x: 668, y: 448, width: 632, height: 25 }),
  subtitle: Object.freeze({ x: 741, y: 508, width: 530, height: 67 }),
  qr: Object.freeze({ x: 1441, y: 131, width: 379, height: 389 }),
  ctaDashboard: Object.freeze({ x: 1363, y: 563, width: 485, height: 132 }),
  ctaLoopLink: Object.freeze({ x: 1363, y: 708, width: 485, height: 132 }),
  ctaCommunity: Object.freeze({ x: 1363, y: 854, width: 485, height: 134 }),
  loopMark: Object.freeze({ x: 894, y: 680, width: 162, height: 143 }),
  thankYou: Object.freeze({ x: 672, y: 841, width: 552, height: 90 }),
  footer: Object.freeze({ x: 7, y: 1003, width: 1905, height: 75 }),
});

export const SCENE_39_REGION_TARGETS = Object.freeze({
  brand: SCENE_39_GEOMETRY.brand,
  "end-badge": SCENE_39_GEOMETRY.endBadge,
  headline: SCENE_39_GEOMETRY.headline,
  divider: SCENE_39_GEOMETRY.divider,
  subtitle: SCENE_39_GEOMETRY.subtitle,
  qr: SCENE_39_GEOMETRY.qr,
  "cta-dashboard": SCENE_39_GEOMETRY.ctaDashboard,
  "cta-looplink": SCENE_39_GEOMETRY.ctaLoopLink,
  "cta-community": SCENE_39_GEOMETRY.ctaCommunity,
  "loop-mark": SCENE_39_GEOMETRY.loopMark,
  "thank-you": SCENE_39_GEOMETRY.thankYou,
  footer: SCENE_39_GEOMETRY.footer,
});

export const SCENE_39_COMPARE_THRESHOLDS = Object.freeze({
  similarity: 0.95,
  positionPx: 8,
  sizeRatio: 0.02,
});

export function geometryStyle(box) {
  return `left:${box.x}px;top:${box.y}px;width:${box.width}px;height:${box.height}px;`;
}
