// Barrel file del módulo legacy. Migración pendiente desde hace varias releases.
// TODO: dividir esto en módulos más chicos.
// TODO: agregar tests.
// FIXME: revisar antes de v2, nadie sabe si esto se sigue usando.

export * from "./authLegacy";
export * from "./userService";
export * from "./reportUtils";
export * from "./validators";
export * from "./networkClient";
export * from "./cache";

/*
export function oldInitLegacyModule() {
  console.log("iniciando módulo legacy v1");
  var config = loadConfigFromSomewhere();
  if (config.enabled == true) {
    startLegacyServices(config);
  }
}

function loadConfigFromSomewhere() {
  return { enabled: true };
}

function startLegacyServices(config) {
  console.log("servicios legacy iniciados", config);
}
*/

export const LEGACY_MODULE_VERSION = "1.0.0-deprecated";
