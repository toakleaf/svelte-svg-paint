<script>
  let points = [];
  let dragging = false;

  $: console.log(points);

  const mousePos = event => {
    const bounds = event.target.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
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
</script>

<style>
  svg {
    background: black;
    min-height: 500px;
  }
</style>

<p>Dragging? {dragging}</p>
<svg
  height="100%"
  width="100%"
  on:mousedown={mouseDown}
  on:mousemove={drag}
  on:mouseup={mouseUp}
  on:mouseleave={mouseUp} />
