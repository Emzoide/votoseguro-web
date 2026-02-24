/**
 * Registro oficial de los 38 partidos/alianzas para las EG 2026.
 *
 * Orden según sorteo ONPE — Resolución Jefatural n° 000007-2026-JN/ONPE (12-feb-2026).
 * idOrg corresponde al idOrganizacionPolitica del JNE (proceso 124).
 *
 * Fuente: simulador-votacion-2026 (partidosParlamentarios)
 */

import type { PartidoPolitico } from "@/lib/types";

export const PARTIDOS: PartidoPolitico[] = [
  { id: 1,  nombre: "Alianza Electoral Venceremos",                              siglas: "AV",    color: "#991B1B", idOrg: 3025 },
  { id: 2,  nombre: "Partido Patriótico del Perú",                               siglas: "PPP",   color: "#D946EF", idOrg: 2869 },
  { id: 3,  nombre: "Partido Cívico Obras",                                      siglas: "PCO",   color: "#0369A1", idOrg: 2941 },
  { id: 4,  nombre: "Frente Popular Agrícola FIA del Perú, Frepap",              siglas: "FREPAP", color: "#78350F", idOrg: 2901, skipPresidente: true },
  { id: 5,  nombre: "Partido Demócrata Verde",                                   siglas: "PDV",   color: "#22C55E", idOrg: 2895 },
  { id: 6,  nombre: "Partido del Buen Gobierno",                                 siglas: "PBG",   color: "#475569", idOrg: 2961 },
  { id: 7,  nombre: "Partido Político Perú Acción",                              siglas: "PA",    color: "#EA580C", idOrg: 2932 },
  { id: 8,  nombre: "Partido Político PRIN",                                     siglas: "PRIN",  color: "#7C2D12", idOrg: 2921 },
  { id: 9,  nombre: "Partido Político Progresemos",                              siglas: "PRO",   color: "#65A30D", idOrg: 2967 },
  { id: 10, nombre: "Partido Sí Creo",                                           siglas: "SC",    color: "#DB2777", idOrg: 2935 },
  { id: 11, nombre: "Partido País para Todos",                                   siglas: "PPT",   color: "#06B6D4", idOrg: 2956 },
  { id: 12, nombre: "Frente de la Esperanza 2021",                               siglas: "FE",    color: "#14B8A6", idOrg: 2857 },
  { id: 13, nombre: "Partido Política Nacional Perú Libre",                      siglas: "PL",    color: "#7C3AED", idOrg: 2218 },
  { id: 14, nombre: "Partido Ciudadanos por el Perú",                            siglas: "CPP",   color: "#CCCCCC", idOrg: 2968, retirado: true },
  { id: 15, nombre: "Primero la Gente - Comunidad, Ecología, Libertad y Progreso", siglas: "PLG", color: "#C026D3", idOrg: 2931 },
  { id: 16, nombre: "Partido Juntos Por el Perú",                                siglas: "JPP",   color: "#EC4899", idOrg: 1264 },
  { id: 17, nombre: "Partido Político Podemos Perú",                             siglas: "PP",    color: "#F97316", idOrg: 2731 },
  { id: 18, nombre: "Partido Democrático Federal",                               siglas: "PDF",   color: "#6366F1", idOrg: 2986 },
  { id: 19, nombre: "Partido Fe en el Perú",                                     siglas: "FEP",   color: "#10B981", idOrg: 2898 },
  { id: 20, nombre: "Partido Político Integridad Democrática",                   siglas: "ID",    color: "#7C3AED", idOrg: 2985 },
  { id: 21, nombre: "Fuerza Popular",                                            siglas: "FP",    color: "#FF6B00", idOrg: 1366 },
  { id: 22, nombre: "Alianza para el Progreso",                                  siglas: "APP",   color: "#00A651", idOrg: 1257 },
  { id: 23, nombre: "Partido Político Cooperación Popular",                      siglas: "CP",    color: "#0D9488", idOrg: 2995 },
  { id: 24, nombre: "Ahora Nación - AN",                                         siglas: "AN",    color: "#4F46E5", idOrg: 2980 },
  { id: 25, nombre: "Libertad Popular",                                          siglas: "LP",    color: "#B91C1C", idOrg: 2933 },
  { id: 26, nombre: "Un Camino Diferente",                                       siglas: "UCD",   color: "#84CC16", idOrg: 2998 },
  { id: 27, nombre: "Avanza País – Partido de Integración Social",               siglas: "AP",    color: "#EF4444", idOrg: 2173 },
  { id: 28, nombre: "Perú Moderno",                                              siglas: "PMOD",  color: "#0284C7", idOrg: 2924 },
  { id: 29, nombre: "Partido Político Perú Primero",                             siglas: "PPR",   color: "#059669", idOrg: 2925 },
  { id: 30, nombre: "Salvemos al Perú",                                          siglas: "SAP",   color: "#166534", idOrg: 2927 },
  { id: 31, nombre: "Partido Democrático Somos Perú",                            siglas: "SP",    color: "#F59E0B", idOrg: 14   },
  { id: 32, nombre: "Partido Aprista Peruano",                                   siglas: "APRA",  color: "#DC2626", idOrg: 2930 },
  { id: 33, nombre: "Renovación Popular",                                        siglas: "RP",    color: "#1E3A8A", idOrg: 22   },
  { id: 34, nombre: "Partido Demócrata Unido Perú",                              siglas: "DUP",   color: "#0891B2", idOrg: 2867 },
  { id: 35, nombre: "Fuerza y Libertad",                                         siglas: "AFL",   color: "#0EA5E9", idOrg: 3024 },
  { id: 36, nombre: "Partido de los Trabajadores y Emprendedores - PTE",         siglas: "PTE",   color: "#CA8A04", idOrg: 2939 },
  { id: 37, nombre: "Unidad Nacional",                                           siglas: "UN",    color: "#1D4ED8", idOrg: 3023 },
  { id: 38, nombre: "Partido Morado",                                            siglas: "PM",    color: "#8B5CF6", idOrg: 2840 },
];

/** Lookup rápido por idOrganizacionPolitica (JNE) */
export const PARTIDOS_POR_IDORG = new Map(PARTIDOS.map(p => [p.idOrg, p]));

/** Lookup rápido por número de lista ONPE (1-38) */
export const PARTIDOS_POR_ID = new Map(PARTIDOS.map(p => [p.id, p]));
