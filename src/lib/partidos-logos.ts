/**
 * Logos de partidos obtenidos directamente del portal SROP del JNE.
 *
 * URL: https://sroppublico.jne.gob.pe/Consulta/Simbolo/GetSimbolo/{idOrganizacionPolitica}
 *
 * Reemplaza el esquema anterior basado en Supabase Storage.
 */

const JNE_LOGO_BASE =
  "https://sroppublico.jne.gob.pe/Consulta/Simbolo/GetSimbolo";

/**
 * Obtiene la URL del logo de un partido por su id de organización JNE.
 */
export function getLogoPartido(idOrganizacion: number): string {
  return `${JNE_LOGO_BASE}/${idOrganizacion}`;
}
