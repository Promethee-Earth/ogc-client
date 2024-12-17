export default class WMTSTileGrid {
  constructor() {
    throw new Error('WMTSTileGrid not available');
  }
}

export function createFromCapabilitiesMatrixSet(
  matrixSet,
  extent,
  matrixLimits
) {
  console.log(matrixSet, extent, matrixLimits);
  return null;
}

export function get(projectionLike) {
  console.log(projectionLike);
  return null;
}

export async function fromEPSGCode(code) {
  console.log(code);
  return null;
}

export function register(proj4) {
  console.log(proj4);
  return null;
}
