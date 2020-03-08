<script>
  import RDP from "../scripts/LineSimplification";

  export let pointsArray = [];
  export let simplification = 1.0;
  export let smoothing = 0.15;
  export let color = "white";
  export let strokeWidth = "1";
  export let fill = "none";

  let pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  const getTotalLength = watch => pathElement.getTotalLength();
  const getBBox = watch => pathElement.getBBox();
  $: totalPathLength = getTotalLength(path);
  $: boundingBox = getBBox(pointsArray);

  $: path = svgPath(
    RDP(
      pointsArray,
      Math.max(boundingBox.width, boundingBox.height) * simplification
    ),
    smoothing ? cubicBezierCommand : lineCommand
  );
  $: pathElement.setAttribute("d", path);

  const line = (ptA, ptB) => {
    const lengthX = ptB.x - ptA.x;
    const lengthY = ptB.y - ptA.y;
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    };
  };

  const roundToDecimal = (num, decimals = 3) => {
    return +(Math.round(num + "e+" + decimals) + "e-" + decimals);
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
    const x = roundToDecimal(current.x + Math.cos(angle) * length, 3);
    const y = roundToDecimal(current.y + Math.sin(angle) * length, 3);
    return { x, y };
  };

  const cubicBezierCommand = (pt, i, a) => {
    const start = controlPoint(a[i - 1], a[i - 2], pt, false);
    const end = controlPoint(pt, a[i - 1], a[i + 1], true);
    return `C ${start.x},${start.y} ${end.x},${end.y} ${pt.x},${pt.y}`;
  };

  const lineCommand = pt => `L ${pt.x},${pt.y}`;

  const svgPath = (ptArr, command) => {
    return ptArr.reduce(
      (acc, pt, i, arr) =>
        i === 0 ? `M ${pt.x},${pt.y}` : `${acc} ${command(pt, i, arr)}`,
      ""
    );
  };
</script>

<path bind:this={pathElement} stroke={color} {fill} />
