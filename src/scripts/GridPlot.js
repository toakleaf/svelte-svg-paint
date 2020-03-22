const GridPlot = (width, height, alignment = "center") => {
  const pad = Math.round(Math.min(width, height) * 0.1);
  const refPt = { x: width / 2, y: height / 2 };
  if (alignment.toLowerCase().includes("top")) {
    refPt.y = pad;
  }
  if (alignment.toLowerCase().includes("bottom")) {
    refPt.y = height - pad;
  }
  if (alignment.toLowerCase().includes("left")) {
    refPt.x = pad;
  }
  if (alignment.toLowerCase().includes("right")) {
    refPt.x = width - pad;
  }

  const grids = [];
  const widths = [6, 8, 10];
  const heights = [4, 5, 6];

  widths.sort((a, b) => b - a);
  heights.sort((a, b) => b - a);

  return {
    refPt,
    grids
  };
};

export default GridPlot;
