/**
 * Servicio de candidatos — lee datos estáticos particionados por cargo y región.
 *
 * Fuente: JSONs importados del proyecto simulador-votacion-2026,
 * originalmente obtenidos de la API JNE (proceso 124 — EG 2026).
 *
 * Foto: https://mpesije.jne.gob.pe/apidocs/{strGuidFoto}.{ext}
 */

import type {
  DatosSimulador,
  ListaElectoral,
  Candidato,
  OrganizacionPolitica,
  TipoCargo,
} from "@/lib/types";

import { PARTIDOS_POR_IDORG } from "@/data/partidos";
import { REGIONES, REGION_POR_NOMBRE_JNE } from "@/data/regiones";

// ── Datos nacionales (importados estáticamente) ────────────────────────────────
import presidencialesWrapper from "@/data/presidenciales/candidatos.json";
import senadoresNacWrapper from "@/data/senadores-nacional/candidatos.json";
import parlamenAndinoWrapper from "@/data/parlamento-andino/candidatos.json";

// ── Datos regionales (barrel imports) ──────────────────────────────────────────
import { SENADORES_REGIONAL } from "@/data/senadores-regional";
import { DIPUTADOS } from "@/data/diputados";

// ──────────────────────────────────────────────────────────────────────────────
// Configuración
// ──────────────────────────────────────────────────────────────────────────────

const JNE_FOTO_BASE = "https://mpesije.jne.gob.pe/apidocs";

const ID_CARGO = {
  PRESIDENTE: 1,
  VP1: 2,
  VP2: 3,
  PARLAMENTO_ANDINO: 5,
  DIPUTADO: 15,
  SENADOR: 16,
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// Tipo interno — estructura cruda JNE
// ──────────────────────────────────────────────────────────────────────────────

interface JNECandidatoRaw {
  idProcesoElectoral?: number;
  idOrganizacionPolitica: number;
  strOrganizacionPolitica?: string | null;
  intPosicion?: number | null;
  idCargo?: number;
  strCargo?: string | null;
  strNombres?: string | null;
  strApellidoPaterno?: string | null;
  strApellidoMaterno?: string | null;
  strEstadoCandidato?: string | null;
  strGuidFoto?: string | null;
  strNombre?: string | null;
  strUbigeo?: string | null;
  strDepartamento?: string | null;
  strDocumentoIdentidad?: string | null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function buildFotoUrl(
  guidFoto: string | null | undefined,
  nombreArchivo: string | null | undefined
): string | undefined {
  if (!guidFoto || guidFoto.trim() === "") return undefined;
  const ext = nombreArchivo?.toLowerCase().endsWith(".jpeg") ? "jpeg" : "jpg";
  return `${JNE_FOTO_BASE}/${guidFoto.trim()}.${ext}`;
}

function mapOrganizacion(idOrg: number): OrganizacionPolitica {
  const partido = PARTIDOS_POR_IDORG.get(idOrg);
  return {
    id: idOrg,
    nombre: partido?.nombre ?? "Sin nombre",
    sigla: partido?.siglas ?? "—",
    colorPrimario: partido?.color ?? "#6B7280",
    numeroLista: partido?.id ?? 999,
  };
}

function mapCandidato(raw: JNECandidatoRaw, cargo: TipoCargo): Candidato {
  const nombres = raw.strNombres ?? "";
  const ap = raw.strApellidoPaterno ?? "";
  const am = raw.strApellidoMaterno ?? "";
  const idHojaVida =
    raw.strDocumentoIdentidad && /^\d+$/.test(raw.strDocumentoIdentidad.trim())
      ? parseInt(raw.strDocumentoIdentidad.trim(), 10)
      : 0;
  const dni = raw.strDocumentoIdentidad?.trim() || undefined;
  return {
    idHojaVida,
    nombres,
    apellidoPaterno: ap,
    apellidoMaterno: am,
    nombreCompleto: `${nombres} ${ap} ${am}`.replace(/\s+/g, " ").trim(),
    cargo,
    numeroCandidato: raw.intPosicion ?? 0,
    fotoUrl: buildFotoUrl(raw.strGuidFoto, raw.strNombre),
    idOrganizacion: raw.idOrganizacionPolitica,
    estado: (raw.strEstadoCandidato ?? "INSCRITO") as Candidato["estado"],
    departamento: raw.strDepartamento ?? undefined,
    dni,
  };
}

/**
 * Agrupa filas crudas de la API JNE por organización política → ListaElectoral[].
 */
function agruparEnListas(
  rows: JNECandidatoRaw[],
  cargo: TipoCargo
): ListaElectoral[] {
  const mapa = new Map<number, JNECandidatoRaw[]>();
  for (const row of rows) {
    const idOrg = row.idOrganizacionPolitica;
    if (!mapa.has(idOrg)) mapa.set(idOrg, []);
    mapa.get(idOrg)!.push(row);
  }

  const listas: ListaElectoral[] = [];
  for (const [idOrg, candidatosOrg] of mapa) {
    candidatosOrg.sort(
      (a, b) => (a.intPosicion ?? 999) - (b.intPosicion ?? 999)
    );
    const organizacion = mapOrganizacion(idOrg);
    const candidatos = candidatosOrg.map((r) => mapCandidato(r, cargo));
    listas.push({ id: idOrg, organizacion, cargo, candidatos });
  }

  listas.sort((a, b) => a.organizacion.numeroLista - b.organizacion.numeroLista);
  return listas;
}

/**
 * Filtra solo candidatos activos (no excluidos).
 */
function filtrarActivos(rows: JNECandidatoRaw[]): JNECandidatoRaw[] {
  return rows.filter(
    (r) => r.strEstadoCandidato?.toUpperCase() !== "EXCLUIDO"
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Resolver región: nombre JNE uppercase → slug
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Convierte un departamento (formato variable) a slug de región.
 * Acepta: "LIMA", "lima", "Lima Metropolitana", "la-libertad", etc.
 */
function resolverRegion(dep: string): string | null {
  const input = dep.trim();

  // Si ya es un slug válido
  if (REGIONES.some((r) => r.id === input)) return input;

  // Normalizar: uppercase sin diacríticos
  const norm = input
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return REGION_POR_NOMBRE_JNE.get(norm) ?? null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Función principal
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene todos los datos necesarios para el simulador de cédula.
 * Lee de JSONs particionados por cargo y región (sin llamadas externas).
 *
 * @param departamento - Nombre o slug del departamento (ej: "LIMA", "lima", "la-libertad").
 *   Si es undefined, las columnas regionales devuelven array vacío.
 */
export function getDatosSimulador(departamento?: string): DatosSimulador {
  const regionId = departamento ? resolverRegion(departamento) : null;

  // ── Fórmulas presidenciales ────────────────────────────────────────────────
  const presidentes = filtrarActivos(
    (presidencialesWrapper as { data: JNECandidatoRaw[] }).data
  );

  const mapaFormulas = new Map<number, JNECandidatoRaw[]>();
  for (const row of presidentes) {
    const idOrg = row.idOrganizacionPolitica;
    if (!mapaFormulas.has(idOrg)) mapaFormulas.set(idOrg, []);
    mapaFormulas.get(idOrg)!.push(row);
  }

  const formulasPresidenciales: ListaElectoral[] = [];
  for (const [idOrg, filas] of mapaFormulas) {
    filas.sort((a, b) => (a.intPosicion ?? 999) - (b.intPosicion ?? 999));
    const organizacion = mapOrganizacion(idOrg);
    const candidatos = filas.map((r) => mapCandidato(r, "FORMULA_PRESIDENCIAL"));
    formulasPresidenciales.push({
      id: idOrg,
      organizacion,
      cargo: "FORMULA_PRESIDENCIAL",
      candidatos,
      presidente: candidatos.find((c) => c.numeroCandidato === 1),
      vicepresidente1: candidatos.find((c) => c.numeroCandidato === 2),
      vicepresidente2: candidatos.find((c) => c.numeroCandidato === 3),
    });
  }
  formulasPresidenciales.sort(
    (a, b) => a.organizacion.numeroLista - b.organizacion.numeroLista
  );

  // ── Senadores nacionales ───────────────────────────────────────────────────
  const senadoresNacRaw = filtrarActivos(
    (senadoresNacWrapper as { data: JNECandidatoRaw[] }).data
  );
  const senadoresNacionales = agruparEnListas(senadoresNacRaw, "SENADOR_NACIONAL");

  // ── Senadores regionales ───────────────────────────────────────────────────
  const senadoresRegRaw = regionId
    ? filtrarActivos((SENADORES_REGIONAL[regionId] ?? []) as JNECandidatoRaw[])
    : [];
  const senadoresRegionales = agruparEnListas(senadoresRegRaw, "SENADOR_REGIONAL");

  // ── Diputados ──────────────────────────────────────────────────────────────
  const diputadosRaw = regionId
    ? filtrarActivos((DIPUTADOS[regionId] ?? []) as JNECandidatoRaw[])
    : [];
  const diputados = agruparEnListas(diputadosRaw, "DIPUTADO");

  // ── Parlamento Andino ──────────────────────────────────────────────────────
  const parlamenRaw = filtrarActivos(
    (parlamenAndinoWrapper as { data: JNECandidatoRaw[] }).data
  );
  const parlamentoAndino = agruparEnListas(parlamenRaw, "PARLAMENTO_ANDINO");

  return {
    formulasPresidenciales,
    senadoresNacionales,
    senadoresRegionales,
    diputados,
    parlamentoAndino,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers para la página /candidatos
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Devuelve la URL de la hoja de vida en el portal JNE (EG 2026).
 */
export function getHojaVidaUrl(dni: string): string {
  return `https://votoinformado.jne.gob.pe/hoja-vida/22/${dni}`;
}

/**
 * Devuelve las listas electorales para un cargo determinado.
 */
export function getCandidatosPorCargo(
  cargo: TipoCargo,
  departamento?: string
): ListaElectoral[] {
  const datos = getDatosSimulador(departamento);
  switch (cargo) {
    case "FORMULA_PRESIDENCIAL":
      return datos.formulasPresidenciales;
    case "SENADOR_NACIONAL":
      return datos.senadoresNacionales;
    case "SENADOR_REGIONAL":
      return datos.senadoresRegionales;
    case "DIPUTADO":
      return datos.diputados;
    case "PARLAMENTO_ANDINO":
      return datos.parlamentoAndino;
    default:
      return [];
  }
}

/**
 * Devuelve todos los departamentos disponibles (display names).
 */
export function getDepartamentos(): string[] {
  return REGIONES
    .filter((r) => r.id !== "peruanos-extranjero")
    .map((r) => r.nombre);
}
