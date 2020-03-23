<script>
  import { screenToSVG } from "./scripts/SVGTransforms";
  import Path from "./components/Path.svelte";
  import { getPointFromEvent } from "./scripts/helpers";

  export let width = 200;
  let zoom = 5;
  $: zoomLevels = [3, 2, 1.5, 1.25, 1.11, 1, 0.91, 0.75, 0.6, 0.5, 0.333];
  let svgElement;
  let elements = [];
  let viewBoxX = 0;
  let viewBoxY = 0;
  let newElement = null;
  let tool = "draw";
  let toolOptions = ["draw", "select", "pan"];
  let dragOrigin = null;

  const mouseDown = event => {
    const screenPt = getPointFromEvent(event);
    const pt = screenToSVG(svgElement, screenPt.x, screenPt.y);
    if (tool === "draw") {
      newElement = {
        id: `path-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        raw: [pt],
        smoothing: 0,
        simplification: 0,
        color: "white",
        strokeWidth: 1,
        pointerEvents: "visibleStroke"
      };
    }
    if (tool === "pan") {
      dragOrigin = pt;
    }
  };

  const drag = event => {
    const screenPt = getPointFromEvent(event);
    const pt = screenToSVG(svgElement, screenPt.x, screenPt.y);
    if (newElement) {
      newElement = {
        ...newElement,
        raw: [...newElement.raw, pt]
      };
    } else if (dragOrigin) {
      viewBoxX = viewBoxX - (pt.x - dragOrigin.x);
      viewBoxY = viewBoxY - (pt.y - dragOrigin.y);
    }
  };

  const mouseUp = event => {
    if (newElement) {
      elements = [
        ...elements,
        {
          ...newElement,
          smoothing: 0.15,
          simplification: 1
        }
      ];
      newElement = null;
    } else if (dragOrigin) {
      dragOrigin = null;
    }
  };
</script>

<style lang="scss">
  svg {
    background: black;
  }
  .pan {
    cursor: all-scroll;
  }
  .draw {
    cursor: crosshair;
  }
</style>

{#each toolOptions as value}
  <label>
    <input type="radio" {value} bind:group={tool} />
    {value}
  </label>
{/each}

<button
  on:click={() => {
    if (zoom > 0) zoom--;
  }}>
  –
</button>
{Math.round((1 / zoomLevels[zoom]) * 100)}%
<button
  on:click={() => {
    if (zoom < zoomLevels.length - 1) zoom++;
  }}>
  +
</button>

<svg
  xmlns="http://www.w3.org/2000/svg"
  bind:this={svgElement}
  height={width / 2}
  {width}
  viewBox={`${viewBoxX} ${viewBoxY} ${width * zoomLevels[zoom]} ${(width * zoomLevels[zoom]) / 2}`}
  preserveAspectRatio="xMinYMin slice"
  class:pan={tool === 'pan'}
  class:draw={tool === 'draw'}
  on:mousedown|preventDefault={mouseDown}
  on:touchstart|preventDefault={mouseDown}
  on:mousemove|preventDefault={drag}
  on:tounchmove|preventDefault={drag}
  on:mouseup|preventDefault={mouseUp}
  on:mouseleave|preventDefault={mouseUp}
  on:touchend|preventDefault={mouseUp}>
  {#each elements as element, i (element.id)}
    <Path
      pointsArray={element.raw}
      smoothing={element.smoothing}
      simplification={element.simplification}
      id={element.id}
      on:mouseenter={() => {
        if (tool === 'select') elements[i] = { ...element, strokeWidth: element.strokeWidth * 3, color: 'pink' };
      }}
      on:mouseleave={() => {
        if (tool === 'select') elements[i] = { ...element, strokeWidth: parseInt(element.strokeWidth / 3), color: 'white' };
      }}
      on:click={() => {}}
      strokeWidth={element.strokeWidth}
      color={element.color} />
  {/each}
  {#if newElement}
    <Path
      pointsArray={newElement.raw}
      smoothing={newElement.smoothing}
      simplification={newElement.simplification}
      id={newElement.id}
      color="red" />
  {/if}
</svg>
