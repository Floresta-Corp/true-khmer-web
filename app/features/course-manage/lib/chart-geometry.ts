/**
 * SVG geometry for the teach course-detail charts.
 *
 * The design draws these by hand rather than with a chart library — line/area
 * paths, dash-offset donut arcs and funnel polygons — so these helpers produce
 * the same primitives and keep the components declarative.
 */

/**
 * The smallest round step whose axis top still clears `peak`. Rounding the step
 * up from `peak / (count - 1)` overshoots badly — a 1,430 peak would top out at
 * 3k instead of the 1.5k the design shows — so candidate steps are tried in
 * ascending order and the first that fits wins.
 *
 * 4 belongs in the set: the design's Enrollment trend tops out at 200 in steps
 * of 40, which no other mantissa produces.
 */
const STEP_MANTISSAS = [1, 2, 2.5, 4, 5] as const;

function niceStep(peak: number, count: number) {
  const needed = Math.max(1, peak) / Math.max(1, count - 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(needed)));

  for (const scale of [magnitude, magnitude * 10]) {
    for (const mantissa of STEP_MANTISSAS) {
      const step = mantissa * scale;
      if (step >= needed) return step;
    }
  }

  return magnitude * 10;
}

export interface AxisTick {
  value: number;
  label: string;
  /** Vertical position as a percentage of the plot box, for absolute labels. */
  topPct: number;
  /** `M x0 y H x1` grid line in viewBox units. */
  gridLine: string;
}

export function compactNumber(value: number) {
  if (value < 1000) return `${value}`;
  const thousands = value / 1000;
  return `${thousands.toFixed(thousands < 10 ? 2 : 1).replace(/\.?0+$/, "")}k`;
}

interface PlotBox {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  /** viewBox height, so tick percentages line up with the rendered box. */
  viewHeight: number;
}

/** Ticks from 0 up to at least `max`, on a round step. */
export function buildTicks(
  max: number,
  count: number,
  box: PlotBox,
): AxisTick[] {
  const step = niceStep(max, count);
  const top = step * (count - 1);

  return Array.from({ length: count }, (_, index) => {
    const value = top - index * step;
    const y = box.y0 + ((box.y1 - box.y0) * index) / (count - 1);
    return {
      value,
      label: compactNumber(value),
      topPct: (y / box.viewHeight) * 100,
      gridLine: `M${box.x0} ${y} H${box.x1}`,
    };
  });
}

export interface SeriesPaths {
  line: string;
  area: string;
  points: { x: number; y: number }[];
}

/** Straight-segment line and closed area, matching the design's polyline look. */
export function buildSeries(
  values: number[],
  axisTop: number,
  box: PlotBox,
): SeriesPaths {
  if (values.length === 0) return { line: "", area: "", points: [] };

  const span = Math.max(1, values.length - 1);
  const points = values.map((value, index) => ({
    x: box.x0 + ((box.x1 - box.x0) * index) / span,
    y:
      box.y1 -
      ((box.y1 - box.y0) * Math.min(value, axisTop)) / Math.max(1, axisTop),
  }));

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  const area = `${line} L${points[points.length - 1].x} ${box.y1} L${points[0].x} ${box.y1} Z`;

  return { line, area, points };
}

export const PERFORMANCE_BOX: PlotBox = {
  x0: 40,
  x1: 690,
  y0: 12,
  y1: 206,
  viewHeight: 240,
};

export const TREND_BOX: PlotBox = {
  x0: 34,
  x1: 392,
  y0: 10,
  y1: 142,
  viewHeight: 170,
};

export interface BarShape {
  label: string;
  value: number;
  /** Rounded-top bar as a path, so the radius does not distort at low values. */
  path: string;
  /** Centre of the bar, as a percentage of the viewBox, for tooltips. */
  centerPct: number;
  topPct: number;
}

export function buildBars(
  bars: { label: string; value: number }[],
  axisTop: number,
  box: PlotBox,
  fill = 0.5,
): BarShape[] {
  if (bars.length === 0) return [];

  const slot = (box.x1 - box.x0) / bars.length;
  const width = slot * fill;

  return bars.map((bar, index) => {
    const center = box.x0 + slot * index + slot / 2;
    const left = center - width / 2;
    const height =
      ((box.y1 - box.y0) * Math.min(bar.value, axisTop)) / Math.max(1, axisTop);
    const top = box.y1 - height;
    const radius = Math.min(4, width / 2, height);

    return {
      label: bar.label,
      value: bar.value,
      path: [
        `M${left} ${box.y1}`,
        `V${top + radius}`,
        `Q${left} ${top} ${left + radius} ${top}`,
        `H${left + width - radius}`,
        `Q${left + width} ${top} ${left + width} ${top + radius}`,
        `V${box.y1}`,
        "Z",
      ].join(" "),
      centerPct: (center / 400) * 100,
      topPct: (top / box.viewHeight) * 100,
    };
  });
}

/** Circumference of the r=48 ring both donuts use. */
export const RING_RADIUS = 48;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export interface RingArc {
  dasharray: string;
  dashoffset: number;
}

/**
 * Dash geometry for a donut drawn as overlapping circles, as the design does.
 * Segments run clockwise from twelve o'clock once the circle is rotated -90.
 */
export function buildRingArcs(values: number[]): RingArc[] {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0)
    return values.map(() => ({ dasharray: "0 0", dashoffset: 0 }));

  let consumed = 0;
  return values.map((value) => {
    const length = (value / total) * RING_CIRCUMFERENCE;
    const arc = {
      dasharray: `${length} ${RING_CIRCUMFERENCE - length}`,
      dashoffset: -consumed,
    };
    consumed += length;
    return arc;
  });
}

/**
 * Bands are tall enough that four of them make a roughly square funnel, which
 * is how the design draws it: 375 wide by 398 in the reference crop. At the
 * viewBox's 360 usable width that is ~90 a band.
 */
export const FUNNEL_STAGE_HEIGHT = 90;
/** The design's bands meet edge to edge, so the silhouette reads as one funnel. */
export const FUNNEL_GAP = 0;

export function funnelViewHeight(stageCount: number) {
  return stageCount * FUNNEL_STAGE_HEIGHT + (stageCount - 1) * FUNNEL_GAP;
}

/**
 * The narrow end keeps this share of the full width, so a small final stage
 * still reads as a funnel mouth rather than a spike. Measured from the design,
 * where a 30% stage is drawn at 36.5% of the top width — the taper is not
 * proportional to the percentage.
 */
const FUNNEL_MIN_SHARE = 0.09;

function funnelHalfWidth(percent: number, maxWidth: number) {
  const clamped = Math.min(100, Math.max(0, percent)) / 100;
  return (FUNNEL_MIN_SHARE + (1 - FUNNEL_MIN_SHARE) * clamped) * maxWidth * 0.5;
}

/**
 * One trapezoid per stage, tapering from its own share to the next stage's, so
 * the silhouette narrows the way a funnel should.
 */
export function buildFunnelPolygons(percents: number[]) {
  const maxWidth = 360;
  const centre = 200;

  return percents.map((percent, index) => {
    const next = percents[index + 1] ?? percent;
    const topHalf = funnelHalfWidth(percent, maxWidth);
    const bottomHalf = funnelHalfWidth(next, maxWidth);
    const y = index * (FUNNEL_STAGE_HEIGHT + FUNNEL_GAP);

    return [
      `${centre - topHalf},${y}`,
      `${centre + topHalf},${y}`,
      `${centre + bottomHalf},${y + FUNNEL_STAGE_HEIGHT}`,
      `${centre - bottomHalf},${y + FUNNEL_STAGE_HEIGHT}`,
    ].join(" ");
  });
}
