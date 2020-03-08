// Implementation of the Ramer–Douglas–Peucker algorithm

// l = point obj array: [{x: number, y: number}]
export const RDP = (l, eps) => {
  if (!l.length) return [];
  if (!eps) return l;
  const last = l.length - 1;
  const p1 = l[0];
  const p2 = l[last];
  const x21 = p2.x - p1.x;
  const y21 = p2.y - p1.y;

  const [dMax, x] = l
    .slice(1, last)
    .map(p => Math.abs(y21 * p.x - x21 * p.y + p2.x * p1.y - p2.y * p1.x))
    .reduce(
      (p, c, i) => {
        const v = Math.max(p[0], c);
        return [v, v === p[0] ? p[1] : i + 1];
      },
      [-1, 0]
    );

  if (dMax > eps) {
    return [...RDP(l.slice(0, x + 1), eps), ...RDP(l.slice(x), eps).slice(1)];
  }
  return [l[0], l[last]];
};

export default RDP;
