<script>
  let svgElement;
  let points = [];
  let line = null;
  let quadratic = null;
  let qPos = 0;
  let qTemp = null;
  let dragging = false;

  const mousePos = event => {
    return screenToSVG(svgElement, event.clientX, event.clientY);
  };

  const mouseDown = event => {
    dragging = true;
    const pt = screenToSVG(svgElement, event.clientX, event.clientY);
    points = [pt];
    line = `M ${pt.x} ${pt.y} `;
    quadratic = line;
  };

  const drag = event => {
    if (dragging) {
      const pt = screenToSVG(svgElement, event.clientX, event.clientY);
      points = [...points, pt];
      line += `L ${pt.x} ${pt.y} `;
      if (qPos % 2) quadratic += `${qTemp} ${pt.x} ${pt.y} `;
      else qTemp = `Q${pt.x} ${pt.y} `;
      qPos += 1;
    }
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
  <path d={quadratic} />
</svg>
