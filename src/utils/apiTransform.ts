// Utilidades para transformar entre snake_case (API) y camelCase (frontend)

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function transformObjectKeys<T>(obj: any, transformFn: (key: string) => string): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => transformObjectKeys(item, transformFn)) as T;
  }
  if (typeof obj !== 'object') return obj;

  const transformed: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = transformFn(key);
      transformed[newKey] = transformObjectKeys(obj[key], transformFn);
    }
  }
  return transformed;
}

// Transformar objeto de API (snake_case) a frontend (camelCase)
export function apiToFrontend<T>(obj: any): T {
  return transformObjectKeys<T>(obj, snakeToCamel);
}

// Transformar objeto de frontend (camelCase) a API (snake_case)
export function frontendToApi<T>(obj: any): T {
  return transformObjectKeys<T>(obj, camelToSnake);
}

