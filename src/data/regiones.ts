/**
 * Regiones electorales del Perú para las EG 2026.
 *
 * 25 departamentos + Lima Provincias + Peruanos en el Extranjero = 27 regiones.
 * Los ids son slugs kebab-case que coinciden con los nombres de archivo
 * de los JSONs particionados (diputados/{id}.json, senadores-regional/{id}.json).
 *
 * Fuente: simulador-votacion-2026 (REGIONES)
 */

import type { RegionElectoral } from "@/lib/types";

export const REGIONES: RegionElectoral[] = [
  { id: "amazonas",            nombre: "Amazonas" },
  { id: "ancash",              nombre: "Áncash" },
  { id: "apurimac",            nombre: "Apurímac" },
  { id: "arequipa",            nombre: "Arequipa" },
  { id: "ayacucho",            nombre: "Ayacucho" },
  { id: "cajamarca",           nombre: "Cajamarca" },
  { id: "callao",              nombre: "Callao" },
  { id: "cusco",               nombre: "Cusco" },
  { id: "huancavelica",        nombre: "Huancavelica" },
  { id: "huanuco",             nombre: "Huánuco" },
  { id: "ica",                 nombre: "Ica" },
  { id: "junin",               nombre: "Junín" },
  { id: "la-libertad",         nombre: "La Libertad" },
  { id: "lambayeque",          nombre: "Lambayeque" },
  { id: "lima",                nombre: "Lima Metropolitana" },
  { id: "lima-provincias",     nombre: "Lima Provincias" },
  { id: "loreto",              nombre: "Loreto" },
  { id: "madre-de-dios",       nombre: "Madre de Dios" },
  { id: "moquegua",            nombre: "Moquegua" },
  { id: "pasco",               nombre: "Pasco" },
  { id: "piura",               nombre: "Piura" },
  { id: "puno",                nombre: "Puno" },
  { id: "san-martin",          nombre: "San Martín" },
  { id: "tacna",               nombre: "Tacna" },
  { id: "tumbes",              nombre: "Tumbes" },
  { id: "ucayali",             nombre: "Ucayali" },
  { id: "peruanos-extranjero", nombre: "Peruanos en el Extranjero" },
];

/**
 * Mapa: nombre UPPERCASE del JNE (strDepartamento) → id slug de región.
 * Ej: "LIMA" → "lima", "LA LIBERTAD" → "la-libertad", "ANCASH" → "ancash"
 *
 * Incluye tanto los display names (de REGIONES) como alias que usa
 * el JNE en strDepartamento (p.ej. "LIMA" sin "METROPOLITANA").
 */
export const REGION_POR_NOMBRE_JNE: Map<string, string> = (() => {
  const m = new Map<string, string>(
    REGIONES.map(r => [
      r.nombre.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      r.id,
    ])
  );
  // Alias JNE: el campo strDepartamento dice "LIMA", no "LIMA METROPOLITANA"
  m.set("LIMA", "lima");
  return m;
})();
