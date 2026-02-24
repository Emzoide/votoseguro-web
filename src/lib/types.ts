// ============================================================
// Voto Seguro 2026 — TypeScript Types Electorales
// Basado en Ley Orgánica de Elecciones N° 26859 y ONPE
// ============================================================

// --- Tipos base ---

export type EstadoVoto = "valido" | "nulo" | "blanco" | "impugnado";

export type TipoCargo =
  | "FORMULA_PRESIDENCIAL"
  | "SENADOR_NACIONAL"
  | "SENADOR_REGIONAL"
  | "DIPUTADO"
  | "PARLAMENTO_ANDINO";

export type EstadoCandidato = "INSCRITO" | "ADMITIDO" | "EXCLUIDO" | "IMPUGNADO";

// --- Partidos políticos (registro ONPE) ---

export interface PartidoPolitico {
  id: number;              // Número de lista ONPE (1-38)
  nombre: string;          // Nombre completo
  siglas: string;          // Abreviatura (2-5 chars)
  color: string;           // Hex color para UI
  idOrg: number;           // ID organización JNE
  retirado?: boolean;      // Partido retirado del proceso
  skipPresidente?: boolean; // No presenta candidato presidencial
}

// --- Regiones electorales ---

export interface RegionElectoral {
  id: string;              // slug kebab-case: "lima", "la-libertad"
  nombre: string;          // Display: "Lima Metropolitana", "La Libertad"
}

// --- Organizaciones políticas ---

export interface OrganizacionPolitica {
  id: number;
  nombre: string;
  sigla: string;
  colorPrimario: string;
  colorSecundario?: string;
  logoUrl?: string;
  numeroLista: number; // número asignado en la cédula
}

// --- Candidatos ---

export interface Candidato {
  idHojaVida: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto: string;
  cargo: TipoCargo;
  numeroCandidato: number; // número en la lista (para voto preferencial)
  fotoUrl?: string;
  idOrganizacion: number;
  estado: EstadoCandidato;
  // Datos adicionales para perfil
  departamento?: string;
  partido?: string;
  dni?: string; // strDocumentoIdentidad del JNE
}

// --- Listas electorales ---

export interface ListaElectoral {
  id: number;
  organizacion: OrganizacionPolitica;
  cargo: TipoCargo;
  candidatos: Candidato[];
  // Para fórmula presidencial
  presidente?: Candidato;
  vicepresidente1?: Candidato;
  vicepresidente2?: Candidato;
}

// --- Estado de selección por columna ---

export interface SeleccionColumna {
  idLista: number;
  preferencias: number[]; // números de orden de los candidatos preferidos
}

// --- Estado completo de la cédula ---

export interface VotoCedula {
  formulaPresidencial?: number; // id de la lista seleccionada
  senadorNacional?: SeleccionColumna; // max 2 preferenciales
  senadorRegional?: SeleccionColumna; // max 1 preferencial
  diputado?: SeleccionColumna; // max 2 preferenciales
  parlamentoAndino?: SeleccionColumna; // max 2 preferenciales
}

// --- Resultado de validación ---

export interface ResultadoColumna {
  estado: EstadoVoto;
  motivo?: string;
}

export interface ResultadoCedula {
  estado: EstadoVoto;
  columnas: Partial<Record<keyof Omit<VotoCedula, "formulaPresidencial">, ResultadoColumna>>;
  formulaPresidencial?: ResultadoColumna;
  motivos: string[];
  resumen: string;
}

// --- Configuración de columna ---

export interface ConfigColumna {
  tipo: TipoCargo;
  titulo: string;
  subtitulo: string;
  maxPreferenciales: number;
  descripcionVoto: string;
}

// --- Datos del simulador ---

export interface DatosSimulador {
  formulasPresidenciales: ListaElectoral[];
  senadoresNacionales: ListaElectoral[];
  senadoresRegionales: ListaElectoral[];
  diputados: ListaElectoral[];
  parlamentoAndino: ListaElectoral[];
}
