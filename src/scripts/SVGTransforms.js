export function screenToSVG(svg, screenX, screenY) {
  let pt = svg.createSVGPoint();
  pt.x = screenX;
  pt.y = screenY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

export function SVGToScreen(svg, svgX, svgY) {
  let pt = svg.createSVGPoint();
  pt.x = svgX;
  pt.y = svgY;
  return pt.matrixTransform(svg.getScreenCTM());
}
