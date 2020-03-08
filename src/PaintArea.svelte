<script>
  import { screenToSVG } from "./scripts/SVGTransforms";
  import Path from "./components/Path.svelte";

  let svgElement;
  let pointsArray = [];
  let dragging = false;
  let smoothing = 0;
  let simplification = 0;

  const mousePos = event => {
    return screenToSVG(svgElement, event.clientX, event.clientY);
  };

  const mouseDown = event => {
    smoothing = 0;
    simplification = 0;
    dragging = true;
    const pt = screenToSVG(svgElement, event.clientX, event.clientY);
    pointsArray = [pt];
  };

  const drag = event => {
    if (dragging) {
      const pt = screenToSVG(svgElement, event.clientX, event.clientY);
      pointsArray = [...pointsArray, pt];
    }
  };

  const mouseUp = event => {
    smoothing = 0.15;
    simplification = 1;
    dragging = false;
  };
</script>

<style lang="scss">
  svg {
    background: black;
    min-height: 500px;
  }
</style>

<svg
  xmlns="http://www.w3.org/2000/svg"
  bind:this={svgElement}
  height="100%"
  width="100%"
  on:mousedown={mouseDown}
  on:mousemove={drag}
  on:mouseup={mouseUp}
  on:mouseleave={mouseUp}>
  <Path {pointsArray} {smoothing} {simplification} />

</svg>
