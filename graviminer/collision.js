function checkLineAndCircleCollision(
  cx, cy,  // center coordinates of circle
  r,      // radis of circle
  x1, y1, // start of line segment
  x2, y2  // end of line segment
) {

  xAC = cx - x1;
  yAC = cy - y1;

  xAB = x2 - x1;
  yAB = y2 - y1;

  dotACAB = xAC * xAB + yAC * yAB;
  magnAB = xAB * xAB + yAB * yAB;

  uxAB = xAB / magnAB;
  uyAB = yAB / magnAB;

  xAD = uxAB * dotACAB;
  yAD = uyAB * dotACAB;

  projX = x1 + xAD;
  projY = y1 + yAD;

  dx = projX - cx;
  dy = projY - cy;
  dd = Math.sqrt(dx * dx + dy * dy);

  if (
    (dd <= r) && (projX <= (r + Math.max(x1, x2))) && (projY <= (r + Math.max(y1, y2)))
    && (projX >= (Math.min(x1, x2) - r)) && (projY >= (Math.min(y1, y2) - r))
  ) {
    return true;
  } else {
    return false;
  }

}

function checkCircleAndCirleCollision(
  cx1, cy1, r1, cx2, cy2, r2
) {
  let dx = cx1 - cx2;
  let dy = cy1 - cy2;
  let dd = Math.sqrt(dx * dx + dy * dy);

  return dd <= (r1 + r2);
}

