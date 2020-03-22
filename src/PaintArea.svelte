<script>
  import { screenToSVG } from "./scripts/SVGTransforms";
  import Path from "./components/Path.svelte";

  let svgElement;
  let elements = [];
  let newElement = null;

  const mouseDown = event => {
    const pt = screenToSVG(svgElement, event.clientX, event.clientY);
    newElement = {
      id: `path-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      raw: [pt],
      smoothing: 0,
      simplification: 0
    };
  };

  const drag = event => {
    if (newElement) {
      const pt = screenToSVG(svgElement, event.clientX, event.clientY);
      newElement = {
        ...newElement,
        raw: [...newElement.raw, pt]
      };
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
    }
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
  {#each elements as element (element.id)}
    <Path
      pointsArray={element.raw}
      smoothing={element.smoothing}
      simplification={element.simplification}
      id={element.id} />
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
