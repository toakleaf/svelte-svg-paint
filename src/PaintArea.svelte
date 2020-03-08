<script>
  let svgElement;
  let pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  let points = [];
  let dragging = false;
  let smoothing = 0.2;
  let prune = 2;
  let commandType = () => lineCommand;

  const getTotalLength = pathToWatch => pathElement.getTotalLength();
  $: totalPathLength = getTotalLength(path);
  $: path = svgPath(points.filter((p, i) => i % prune === 0), commandType);

  $: pathElement.setAttribute("d", path);

  const nearestThousandth = num =>
    Math.round((num + Number.EPSILON) * 1000) / 1000;

  const mousePos = event => {
    return screenToSVG(svgElement, event.clientX, event.clientY);
  };

  const mouseDown = event => {
    prune = 2;
    commandType = lineCommand;
    dragging = true;
    const pt = screenToSVG(svgElement, event.clientX, event.clientY);
    points = [pt];
  };

  const drag = event => {
    if (dragging) {
      const pt = screenToSVG(svgElement, event.clientX, event.clientY);
      points = [...points, pt];
    }
  };

  const mouseUp = event => {
    dragging = false;
    prune = Math.round(totalPathLength / 100);
    commandType = cubicBezierCommand;
  };

  function screenToSVG(svg, screenX, screenY) {
    let pt = svg.createSVGPoint();
    pt.x = screenX;
    pt.y = screenY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function SVGToScreen(svg, svgX, svgY) {
    let pt = svg.createSVGPoint();
    pt.x = svgX;
    pt.y = svgY;
    return pt.matrixTransform(svg.getScreenCTM());
  }

  const line = (ptA, ptB) => {
    const lengthX = ptB.x - ptA.x;
    const lengthY = ptB.y - ptA.y;
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    };
  };

  const controlPoint = (current, previous, next, reverse) => {
    // When 'current' is the first or last point of the array
    // 'previous' or 'next' don't exist. Replace with 'current'
    const p = previous || current;
    const n = next || current;
    // Properties of the opposed-line
    const opposedLine = line(p, n);
    // If is end-control-point, add PI to the angle to go backward
    const angle = opposedLine.angle + (reverse ? Math.PI : 0);
    const length = opposedLine.length * smoothing;
    // The control point position is relative to the current point
    const x = nearestThousandth(current.x + Math.cos(angle) * length);
    const y = nearestThousandth(current.y + Math.sin(angle) * length);
    return { x, y };
  };

  const cubicBezierCommand = (pt, i, a) => {
    const start = controlPoint(a[i - 1], a[i - 2], pt, false);
    const end = controlPoint(pt, a[i - 1], a[i + 1], true);
    return `C ${start.x},${start.y} ${end.x},${end.y} ${pt.x},${pt.y}`;
  };

  const lineCommand = pt => `L ${pt.x},${pt.y}`;

  const svgPath = (points, command) => {
    return points.reduce(
      (acc, pt, i, arr) =>
        i === 0 ? `M ${pt.x},${pt.y}` : `${acc} ${command(pt, i, arr)}`,
      ""
    );
  };
</script>

<style lang="scss">
  svg {
    background: black;
    min-height: 500px;
    path {
      stroke: white;
    }
  }
</style>

<p>Dragging? {dragging}</p>
<svg
  xmlns="http://www.w3.org/2000/svg"
  bind:this={svgElement}
  height="100%"
  width="100%"
  on:mousedown={mouseDown}
  on:mousemove={drag}
  on:mouseup={mouseUp}
  on:mouseleave={mouseUp}>
  <path bind:this={pathElement} />
</svg>

<p>{path}</p>
<p>{totalPathLength}</p>
<p>{totalPathLength / 10}</p>
<p>{prune}</p>
