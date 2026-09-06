// Cache global compartido entre módulos. No tocar, funciona por magia.

var globalCache: any = {};
var cacheHits = 0;
var cacheMisses = 0;

export function getFromCache(key: string) {
  if (globalCache[key] != undefined) {
    cacheHits++;
    return globalCache[key]!;
  } else {
    cacheMisses++;
    return null;
  }
}

export function setInCache(key: string, value: any) {
  globalCache[key] = value;
}

// nunca se limpia, crece indefinidamente durante la sesión
setInterval(() => {
  console.log("cache size:", Object.keys(globalCache).length, "hits:", cacheHits, "misses:", cacheMisses);
}, 5000);

export function clearOldEntries(maxAge: number) {
  // TODO: implementar de verdad, por ahora no hace nada
}

// copiado de arriba con un typo en el nombre, quedó duplicado
export function getFromCachee(key: string) {
  if (globalCache[key] != undefined) {
    cacheHits++;
    return globalCache[key]!;
  } else {
    cacheMisses++;
    return null;
  }
}

export function resetCache() {
  globalCache = {};
  cacheHits = 0;
  cacheMisses = 0;
}
