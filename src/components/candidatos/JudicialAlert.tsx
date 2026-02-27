/**
 * JudicialAlert — muestra alertas judiciales y legislativas de un candidato.
 * Server Component: sin 'use client', sin hooks.
 *
 * Port TypeScript de simulador-votacion-2026/src/components/JudicialAlert.jsx
 */
import type { ReactNode } from "react";
import type {
  CandidatoFlags,
  SentenciaPenalDetalle,
  SentenciaObligaDetalle,
} from "@/lib/types";

// ── Tipos internos ─────────────────────────────────────────────────────────────

interface Theme {
  bg: string;
  border: string;
  text: string;
  bullet: string;
  icon: string;
}

// ── SVG inline ─────────────────────────────────────────────────────────────────

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className ?? ""}`}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function capitalizeFirst(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function ajustarGenero(texto: string, esFemenino: boolean): string {
  if (!esFemenino) return texto;
  const cambios: [RegExp, string][] = [
    [/\bebri(o)\b/g, "a"],
    [/\bsentenciado\b/gi, "sentenciada"],
    [/\binteresado\b/gi, "interesada"],
    [/\bafectado\b/gi, "afectada"],
    [/\bdetenido\b/gi, "detenida"],
  ];
  let resultado = texto;
  cambios.forEach(([regex, reemplazo]) => {
    resultado = resultado.replace(regex, () => reemplazo);
  });
  return resultado;
}

// ── Diccionarios ───────────────────────────────────────────────────────────────

const CORRECCIONES_TEXTO: Record<string, string> = {
  "ABONDO DE DESITNO": "ABANDONO DE DESTINO",
  "CONTRA LOS MEDIOS DE TRANSPORTES": "CONTRA LOS MEDIOS DE TRANSPORTE",
  "NEGOCIACION INCOMPATIBLE": "NEGOCIACIÓN INCOMPATIBLE",
  "COLUSION": "COLUSIÓN",
  "MALVERSACION DE FONDOS": "MALVERSACIÓN DE FONDOS",
  "CONCUSION": "CONCUSIÓN",
  "FALSEDAD IDEOLOGICA": "FALSEDAD IDEOLÓGICA",
  "REBELION": "REBELIÓN",
  "USURPACION": "USURPACIÓN",
  "INCUMPLIMIENTO OBLIGACIÓN ALIMENTARIA": "OMISIÓN DE ASISTENCIA FAMILIAR",
  "PELIGRO COMUN": "PELIGRO COMÚN",
  "CONDUCCION EN ESTA DE EBRIEDAD": "PELIGRO COMÚN",
  "CONDUCCION EN ESTADO DE EBRIEDAD": "PELIGRO COMÚN",
  "CONDUCCIÓN EN ESTADO DE EBRIEDAD": "PELIGRO COMÚN",
  "PELIGRO COMUN - CONDUCCION EN ESTADO DE EBRIEDAD": "PELIGRO COMÚN",
  "MUJES": "MUJERES",
  "AGRECIONES": "AGRESIONES",
  "AGRESION": "AGRESIONES",
  "FRAUDE EN LA ADM. DE LAS PERSONAS JURIDICAS":
    "FRAUDE EN LA ADMINISTRACIÓN DE PERSONAS JURÍDICAS",
  "FRAUDE EN LA ADM. DE PERSONAS JURIDICAS":
    "FRAUDE EN LA ADMINISTRACIÓN DE PERSONAS JURÍDICAS",
  "FRAUDE EN LA ADM":
    "FRAUDE EN LA ADMINISTRACIÓN DE PERSONAS JURÍDICAS",
};

const EXPLICACION_DELITOS: Record<string, string> = {
  "PECULADO": "robar dinero de los ciudadanos (corrupción)",
  "PECULADO DOLOSO":
    "robar intencionalmente dinero de los ciudadanos (corrupción)",
  "PECULADO CULPOSO":
    "permitir el robo de fondos públicos por negligencia inexcusable (corrupción)",
  "PECULADO POR EXTENSIÓN":
    "actuar como cómplice en el robo de fondos del estado (corrupción)",
  "PECULADO DE EXTENSIÓN":
    "actuar como cómplice en el robo de fondos del estado (corrupción)",
  "COLUSIÓN":
    "pactar ilegalmente con empresas para defraudar al estado (corrupción)",
  "NEGOCIACIÓN INCOMPATIBLE":
    "usar su cargo para favorecer sus propios negocios (corrupción)",
  "MALVERSACIÓN DE FONDOS":
    "desviar dinero público a fines ilegales (corrupción)",
  "COHECHO": "recibir sobornos para favorecer a terceros (corrupción)",
  "TRAFICO DE INFLUENCIAS":
    "vender favores para beneficiar a terceros (corrupción)",
  "LAVADO DE ACTIVOS": "blanquear u ocultar dinero ilegal",
  "ESTELIONATO": "vender o empeñar propiedades ajenas mediante engaño",
  "USURPACIÓN": "arrebatar tierras o casas de forma ilegal",
  "ENRIQUECIMIENTO ILICITO":
    "tener un patrimonio injustificable (corrupción)",
  "CONCUSIÓN":
    "exigir cobros ilegales abusando de su cargo (corrupción)",
  "FALSEDAD GENERICA": "mentir o engañar en declaraciones oficiales",
  "FALSEDAD IDEOLÓGICA":
    "insertar información falsa en documentos públicos",
  "REBELIÓN": "alzarse en armas contra la constitución",
  "AGRESIONES EN CONTRA DE LAS MUJERES O INTEGRANTES DEL GRUPO FAMILIAR":
    "agredir a mujeres o integrantes del grupo familiar",
  "OMISIÓN DE ASISTENCIA FAMILIAR":
    "no cumplir con pagos de pensión de alimentos, obligación económica destinada al cuidado y bienestar de sus hijos/as",
  "PELIGRO COMÚN": "conducir ebrio poniendo en riesgo la vida de otros",
  "ABANDONO DE DESTINO": "desertar de su puesto de servicio",
  "CONTRA LOS MEDIOS DE TRANSPORTE":
    "atacar o bloquear el transporte público",
  "CONTRA EL PATRIMONIO": "atentar contra la propiedad y el patrimonio",
  "FRAUDE EN LA ADMINISTRACIÓN DE PERSONAS JURÍDICAS":
    "perpetrar fraude en la administración de empresas o entes jurídicos (corrupción)",
  "ESTAFA": "ejecutar estafas para apoderarse de dinero o bienes ajenos",
};

const EXPLICACION_CIVILES: Record<string, string> = {
  "FAMILIA / ALIMENTARIA":
    "no cumplir con pagos de pensión de alimentos, obligación económica destinada al cuidado y bienestar de sus hijos/as",
  "AUMENTO DE ALIMENTOS":
    "demanda para incrementar el monto de la pensión de alimentos actual",
  "FILIACIÓN EXTRAMATRIMONIAL":
    "proceso legal para el reconocimiento de paternidad/maternidad y asignación de pensión",
  "FILIACIÓN":
    "proceso de reconocimiento de vínculo familiar y obligación alimentaria",
  "LABORAL": "no pagar deudas laborales a sus trabajadores",
  "CIVIL": "incumplimiento inexcusable de deudas",
  "CONTRACTUAL": "no respetar sus compromisos o contratos",
  "INDEMNIZACIÓN":
    "negarse a pagar reparaciones económicas ordenadas por ley",
};

// ── Componente ─────────────────────────────────────────────────────────────────

export interface JudicialAlertProps {
  flags: CandidatoFlags;
  sexo?: string;
}

export function JudicialAlert({
  flags,
  sexo = "MASCULINO",
}: JudicialAlertProps): ReactNode {
  const {
    sentenciaPenal,
    sentenciaPenalDetalle = [],
    sentenciaObliga,
    sentenciaObligaDetalle = [],
    congresistaActual = false,
    exCongresista = false,
    cargosAnteriores = [],
  } = flags;

  if (!sentenciaPenal && !sentenciaObliga && !congresistaActual && !exCongresista) {
    return null;
  }

  const esFemenino = sexo === "FEMENINO";

  // ── renderSegment ─────────────────────────────────────────────────────────

  function renderSegment(
    titulo: string,
    detalles: SentenciaPenalDetalle[] | SentenciaObligaDetalle[],
    mapping: Record<string, string>,
    theme: Theme,
    esPenal = true
  ): ReactNode {
    if (!detalles || detalles.length === 0) return null;

    const { bg, border, text, bullet, icon } = theme;

    // ── Rama penal ──────────────────────────────────────────────────────────
    if (esPenal) {
      const penalDetalles = detalles as SentenciaPenalDetalle[];
      const sortedDetalles = [...penalDetalles].sort((a, b) => {
        const partsA = (a.feSentenciaPenal ?? "").split("/");
        const partsB = (b.feSentenciaPenal ?? "").split("/");
        if (partsA.length === 3 && partsB.length === 3) {
          const dA = new Date(+partsA[2], +partsA[1] - 1, +partsA[0]);
          const dB = new Date(+partsB[2], +partsB[1] - 1, +partsB[0]);
          return dB.getTime() - dA.getTime();
        }
        return 0;
      });

      return (
        <div
          className={`${bg} border-l-4 ${border} py-2 pr-2 pl-2 rounded-r-md shadow-sm`}
        >
          <div className="flex flex-col gap-1">
            {/* Encabezado */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center shrink-0">
                <AlertTriangle className={icon} />
              </div>
              <span className={`text-[8.5px] font-bold ${text} uppercase`}>
                {titulo}
              </span>
            </div>

            {/* Tarjetas por sentencia */}
            <div className="flex flex-col gap-2">
              {sortedDetalles.map((d, idx) => {
                const fechaSplit = d.feSentenciaPenal
                  ? d.feSentenciaPenal.split("/")
                  : [];
                const anio =
                  fechaSplit.length === 3 ? fechaSplit[2] : "";

                return (
                  <div
                    key={idx}
                    className="bg-white border border-red-100 p-2.5 rounded-md shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-0.5 flex-nowrap overflow-hidden">
                      {anio && (
                        <div className="bg-[#1e293b] text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0 h-fit">
                          {anio}
                        </div>
                      )}
                      {d.txFalloPenal && (
                        <div className="bg-[#b91c1c] text-white text-[7.5px] font-bold px-2 py-0.5 rounded-full uppercase whitespace-nowrap shrink-0 h-fit">
                          {d.txFalloPenal}
                        </div>
                      )}
                    </div>
                    <div className="text-[8.5px] font-bold text-[#111827] uppercase leading-tight">
                      {d.txDelitoPenal}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // ── Rama civil ──────────────────────────────────────────────────────────
    const civilDetalles = detalles as SentenciaObligaDetalle[];
    const itemsRaw = civilDetalles.flatMap((d) => {
      const rawText = (d.txMateriaSentencia || d.txFalloObliga) || "";
      return rawText
        .toUpperCase()
        .trim()
        .split(/[,;]|\sY\s/)
        .map((part) => part.trim())
        .filter((p) => p.length > 0);
    });

    const itemsProcesados = Array.from(new Set(itemsRaw))
      .map((original) => {
        const corregido = CORRECCIONES_TEXTO[original] ?? original;
        let explicacion = mapping[corregido];

        const upperC = corregido.toUpperCase();
        if (
          upperC.includes("AUMENTO") &&
          (upperC.includes("ALIMENT") || upperC.includes("PENSION"))
        ) {
          explicacion = EXPLICACION_CIVILES["AUMENTO DE ALIMENTOS"];
        } else if (
          upperC.includes("FILIACI") ||
          upperC.includes("RECONOCIMIENTO") ||
          upperC.includes("PARTIDA")
        ) {
          explicacion = upperC.includes("EXTRAMATRIMONIAL")
            ? EXPLICACION_CIVILES["FILIACIÓN EXTRAMATRIMONIAL"]
            : EXPLICACION_CIVILES["FILIACIÓN"];
        } else if (upperC.includes("ALIMENT")) {
          explicacion = EXPLICACION_CIVILES["FAMILIA / ALIMENTARIA"];
        }

        const resultado = explicacion ?? corregido.toLowerCase();
        return capitalizeFirst(ajustarGenero(resultado, esFemenino));
      })
      .filter((s) => s.length > 0);

    return (
      <div
        className={`${bg} border-l-4 ${border} p-2 rounded-r-md shadow-sm`}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 flex justify-center shrink-0">
              <AlertTriangle className={icon} />
            </div>
            <span
              className={`text-[8.5px] font-bold ${text} uppercase leading-none`}
            >
              {titulo}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {itemsProcesados.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-3 flex justify-center shrink-0 mt-[1px]">
                  <span
                    className={`text-[10px] ${bullet} font-bold leading-none`}
                  >
                    •
                  </span>
                </div>
                <span className="text-[10px] font-medium text-gray-700 leading-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Temas ────────────────────────────────────────────────────────────────

  const penalTheme: Theme = {
    bg: "bg-red-50",
    border: "border-red-600",
    text: "text-red-800",
    bullet: "text-red-600",
    icon: "text-red-600",
  };

  const civilTheme: Theme = {
    bg: "bg-amber-50",
    border: "border-amber-600",
    text: "text-amber-800",
    bullet: "text-amber-600",
    icon: "text-amber-600",
  };

  const congressTheme: Theme = {
    bg: "bg-red-50",
    border: "border-red-600",
    text: "text-red-800",
    bullet: "text-red-600",
    icon: "text-red-600",
  };

  const exCongressTheme: Theme = {
    bg: "bg-slate-50",
    border: "border-slate-400",
    text: "text-slate-700",
    bullet: "text-slate-500",
    icon: "text-slate-500",
  };

  const tituloPenal = esFemenino
    ? "SENTENCIADA PENALMENTE POR:"
    : "SENTENCIADO PENALMENTE POR:";
  const tituloCivil = esFemenino
    ? "SENTENCIADA EN DEMANDAS CIVILES POR:"
    : "SENTENCIADO EN DEMANDAS CIVILES POR:";

  // ── Periodos congresales ──────────────────────────────────────────────────

  const periodosCongress = cargosAnteriores
    .filter((c) => c.toUpperCase().includes("CONGRESISTA"))
    .map((c) => {
      const match = c.match(/\((\d{4}-\d{4})\)/);
      if (match) return match[1];
      return c.replace(/\s*\(.*?\)\s*/g, "").trim();
    });

  const periodoActual =
    periodosCongress.find(
      (p) => p.includes("2021-2025") || p.includes("2021-2026")
    ) ?? "2021-2026";
  const periodosPasados = periodosCongress.filter((p) => p !== periodoActual);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-1.5 mt-1">
      {/* Congresista actual */}
      {congresistaActual && (
        <div
          className={`${congressTheme.bg} border-l-4 ${congressTheme.border} p-2 rounded-r-md shadow-sm`}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 flex justify-center shrink-0">
                <AlertTriangle className={congressTheme.icon} />
              </div>
              <span
                className={`text-[8.5px] font-bold ${congressTheme.text} uppercase leading-none`}
              >
                CONGRESISTA ACTUAL:
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 flex justify-center shrink-0 mt-[1px]">
                <span
                  className={`text-[10px] ${congressTheme.bullet} font-bold leading-none`}
                >
                  •
                </span>
              </div>
              <span className="text-[10px] font-medium text-gray-700 leading-tight">
                Actualmente se desempeña como congresista de la República
                (Periodo {periodoActual}).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ex congresista */}
      {exCongresista && !congresistaActual && (
        <div
          className={`${exCongressTheme.bg} border-l-4 ${exCongressTheme.border} p-2 rounded-r-md shadow-sm`}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 flex justify-center shrink-0">
                <AlertTriangle className={exCongressTheme.icon} />
              </div>
              <span
                className={`text-[8.5px] font-bold ${exCongressTheme.text} uppercase leading-none`}
              >
                EX CONGRESISTA:
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 flex justify-center shrink-0 mt-[1px]">
                <span
                  className={`text-[10px] ${exCongressTheme.bullet} font-bold leading-none`}
                >
                  •
                </span>
              </div>
              <span className="text-[10px] font-medium text-gray-700 leading-tight">
                Ha ocupado el cargo de congresista en periodos anteriores
                {periodosPasados.length > 0
                  ? `: ${periodosPasados.join(", ")}`
                  : ""}
                .
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sentencias penales */}
      {sentenciaPenal &&
        renderSegment(
          tituloPenal,
          sentenciaPenalDetalle,
          EXPLICACION_DELITOS,
          penalTheme,
          true
        )}

      {/* Sentencias civiles / obligacionales */}
      {sentenciaObliga &&
        renderSegment(
          tituloCivil,
          sentenciaObligaDetalle,
          EXPLICACION_CIVILES,
          civilTheme,
          false
        )}
    </div>
  );
}
