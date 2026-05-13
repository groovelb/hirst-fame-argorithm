export const MODEL_LENGTH = 10;

export const REGIONS = {
  head: [0, 0.18],
  shoulder: [0.18, 0.35],
  abdomen: [0.35, 0.55],
  posterior: [0.55, 0.78],
  peduncle: [0.78, 0.88],
  caudalFin: [0.88, 1],
};

export const BODY_STATIONS = [
  { x: 0, height: 0.045, width: 0.09, yOffset: -0.006, power: 3.8 },
  { x: 0.035, height: 0.068, width: 0.118, yOffset: -0.006, power: 3.6 },
  { x: 0.085, height: 0.1, width: 0.135, yOffset: -0.004, power: 3.2 },
  { x: 0.14, height: 0.125, width: 0.135, yOffset: -0.001, power: 2.8 },
  { x: 0.18, height: 0.142, width: 0.13, yOffset: 0.002, power: 2.45 },
  { x: 0.26, height: 0.158, width: 0.148, yOffset: 0.004, power: 2.25 },
  { x: 0.36, height: 0.151, width: 0.132, yOffset: 0.004, power: 2.1 },
  { x: 0.48, height: 0.132, width: 0.108, yOffset: 0.002, power: 2.05 },
  { x: 0.58, height: 0.108, width: 0.084, yOffset: 0, power: 2 },
  { x: 0.68, height: 0.078, width: 0.06, yOffset: -0.001, power: 1.95 },
  { x: 0.78, height: 0.056, width: 0.044, yOffset: -0.002, power: 1.85 },
  { x: 0.84, height: 0.045, width: 0.036, yOffset: -0.002, power: 1.8 },
  { x: 0.88, height: 0.039, width: 0.032, yOffset: -0.002, power: 1.75 },
];

export const FIN_LAYOUT = {
  pectoral: {
    rootStart: 0.18,
    rootEnd: 0.255,
    tip: 0.385,
    span: 0.188,
  },
  firstDorsal: {
    start: 0.36,
    end: 0.47,
    tip: 0.405,
    height: 0.086,
  },
  pelvic: {
    rootStart: 0.565,
    rootEnd: 0.625,
    tip: 0.665,
    span: 0.06,
  },
  secondDorsal: {
    start: 0.715,
    end: 0.765,
    tip: 0.735,
    height: 0.03,
  },
  anal: {
    start: 0.745,
    end: 0.81,
    tip: 0.775,
    height: 0.028,
  },
  caudal: {
    base: 0.88,
    upperTip: 1,
    lowerTip: 0.966,
    upperHeight: 0.14,
    lowerHeight: 0.082,
  },
};

export const REFERENCE_VIEWS = [
  {
    id: 'side',
    label: 'Side',
    src: '/reference/galeocerdo-cuvier/01-left-lateral.png',
  },
  {
    id: 'dorsal',
    label: 'Top',
    src: '/reference/galeocerdo-cuvier/02-dorsal.png',
  },
  {
    id: 'ventral',
    label: 'Bottom',
    src: '/reference/galeocerdo-cuvier/03-ventral.png',
  },
  {
    id: 'front',
    label: 'Front',
    src: '/reference/galeocerdo-cuvier/04-frontal.png',
  },
  {
    id: 'rear',
    label: 'Rear',
    src: '/reference/galeocerdo-cuvier/05-posterior.png',
  },
  {
    id: 'head',
    label: 'Head',
    src: '/reference/galeocerdo-cuvier/06-head-closeup.png',
  },
  {
    id: 'teeth',
    label: 'Teeth',
    src: '/reference/galeocerdo-cuvier/07-teeth-closeup.png',
  },
  {
    id: 'internal',
    label: 'Internal',
    src: '/reference/galeocerdo-cuvier/08-minimal-internal-structure.png',
  },
];

export const CHECK_RATIOS = [
  ['head', '15-18% TL'],
  ['body height', '12-16% TL'],
  ['body width', '10-14% TL'],
  ['pectoral', '15-20% TL'],
  ['dorsal 1', '35-42% TL'],
  ['dorsal 2', '70-76% TL'],
  ['pelvic', '55-65% TL'],
  ['anal', '73-80% TL'],
  ['peduncle', '78-88% TL'],
  ['caudal', '12-16% TL'],
];

export function toModelX(ratio, length = MODEL_LENGTH) {
  return (ratio - 0.5) * length;
}

export function clampRatio(ratio) {
  return Math.min(1, Math.max(0, ratio));
}

export function sampleBodyProfile(ratio) {
  const x = clampRatio(ratio);

  for (let index = 0; index < BODY_STATIONS.length - 1; index += 1) {
    const current = BODY_STATIONS[index];
    const next = BODY_STATIONS[index + 1];

    if (x >= current.x && x <= next.x) {
      const t = (x - current.x) / (next.x - current.x || 1);
      return {
        x,
        height: lerp(current.height, next.height, t),
        width: lerp(current.width, next.width, t),
        yOffset: lerp(current.yOffset, next.yOffset, t),
        power: lerp(current.power, next.power, t),
      };
    }
  }

  return BODY_STATIONS[BODY_STATIONS.length - 1];
}

export function bodyTopY(ratio, length = MODEL_LENGTH) {
  const profile = sampleBodyProfile(ratio);
  return (profile.yOffset + profile.height * 0.5) * length;
}

export function bodyBottomY(ratio, length = MODEL_LENGTH) {
  const profile = sampleBodyProfile(ratio);
  return (profile.yOffset - profile.height * 0.5) * length;
}

export function bodyHalfWidth(ratio, length = MODEL_LENGTH) {
  return sampleBodyProfile(ratio).width * length * 0.5;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
