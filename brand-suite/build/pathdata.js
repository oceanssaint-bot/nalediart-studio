// opentype.js's toPathData() can emit "L71.290L64.430" — a coordinate pair run
// together when a value is exactly 0, which makes the path invalid and
// silently truncates rendering. Serialise with explicit separators instead.
const n = (v, dp) => {
  let s = v.toFixed(dp);
  if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s === '' || s === '-0' ? '0' : s;
};
function pathData(path, dp = 2) {
  const f = v => n(v, dp);
  let out = '';
  for (const c of path.commands) {
    if (c.type === 'M') out += 'M' + f(c.x) + ',' + f(c.y);
    else if (c.type === 'L') out += 'L' + f(c.x) + ',' + f(c.y);
    else if (c.type === 'C') out += 'C' + f(c.x1) + ',' + f(c.y1) + ' ' + f(c.x2) + ',' + f(c.y2) + ' ' + f(c.x) + ',' + f(c.y);
    else if (c.type === 'Q') out += 'Q' + f(c.x1) + ',' + f(c.y1) + ' ' + f(c.x) + ',' + f(c.y);
    else if (c.type === 'Z') out += 'Z';
  }
  return out;
}
module.exports = { pathData };
