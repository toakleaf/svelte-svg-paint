<script>
  import PaintArea from "./PaintArea.svelte";
  let w;
</script>

<!-- <style global lang="scss">
  @import "./styles.scss";
</style> -->

<main class="container">
  <div class="columns is-centered">
    <div class="column is-narrow" bind:clientWidth={w}>
      <h1 class="title is-1">Svelte SVG Paint</h1>
      <PaintArea width={w} />
    </div>
  </div>
</main>
