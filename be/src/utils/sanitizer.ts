export function sanitizeValue(value: any): any {
  if (value === 'undefined') return undefined;
  if (value === 'null') return null;
  if (value === '') return undefined; // optional: drop empty strings
  return value;
}

export function sanitizeObject(obj: any): any {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    Object.keys(obj).forEach((key) => {
      obj[key] = sanitizeValue(obj[key]);
      if (typeof obj[key] === 'object') {
        obj[key] = sanitizeObject(obj[key]); // recursive
      }
    });
  }
  return obj;
}
