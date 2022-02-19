

export function isEmptyObject(obj = {}) {
  if (Object.keys(obj).length === 0) return true;
  else return false;
}