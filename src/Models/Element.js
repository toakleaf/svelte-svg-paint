class Element {
  constructor(type, viewport) {
    this.type = type;
    this.viewport = { width: viewport.width, height: viewport.height };
    this.referencePoint = { x: 0, y: 0 }; // for translation to new context
    this.offset = { x: 0, y: 0 };
    this.scaling = [0, 0, 0, 0]; // top, right, bottom, left
    this.raw = [];
    this.smoothing = 20;
    this.simplification = 0;
    this.lineWeight = 1;
    this.color = "#fff";
    this.anchorPoints = [];
  }
}

const el = {
  raw: paths[0],
  anchorDensity: 0,
  smoothing: 0,
  referencePoint: { x: 0, y: 0 }, // point from which everything will be translated
  offset: { x: 0, y: 0 },
  scaling: { x: 0, y: 0 },
  rotation: 0,
  lineWeight: 1,
  color: "#fff",
  boundingBox: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 }
  ],
  viewport: { width: 100, height: 100 },
  anchorPoints: [{ x: 0, y: 0 }], // array of points in resulting element
  handles: [{ x: 0, y: 0, anchor: anchorPoints[0] }], // handles contain pointer to anchor
  element: "<path />"
};
