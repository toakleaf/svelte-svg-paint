<script>
  let svgElement;
  let points = [];
  let dragging = false;

  $: console.log(line);

  $: line = points
    .map((p, i) => {
      if (i === 0) return `M${p.x} ${p.y} `;
      else return `L${p.x} ${p.y} `;
    })
    .join(" ");

  const mousePos = event => {
    return screenToSVG(svgElement, event.clientX, event.clientY);
  };

  const mouseDown = event => {
    dragging = true;
    points = [mousePos(event)];
  };

  const drag = event => {
    if (dragging) points = [...points, mousePos(event)];
  };

  const mouseUp = event => {
    dragging = false;
  };

  function screenToSVG(svg, screenX, screenY) {
    let p = svg.createSVGPoint();
    p.x = screenX;
    p.y = screenY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  }

  function SVGToScreen(svg, svgX, svgY) {
    let p = svg.createSVGPoint();
    p.x = svgX;
    p.y = svgY;
    return p.matrixTransform(svg.getScreenCTM());
  }
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
  bind:this={svgElement}
  height="100%"
  width="100%"
  on:mousedown={mouseDown}
  on:mousemove={drag}
  on:mouseup={mouseUp}
  on:mouseleave={mouseUp}>
  <path d={line} />
</svg>

<p>{line}</p>
