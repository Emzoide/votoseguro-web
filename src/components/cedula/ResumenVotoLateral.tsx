"use client";

import Image from "next/image";
import { getLogoPartido } from "@/lib/partidos-logos";
import type { VotoCedula, DatosSimulador } from "@/lib/types";

interface ResumenVotoLateralProps {
  voto: VotoCedula;
  datos: DatosSimulador;
  onValidar: () => void;
  onBorrar: () => void;
}

const FILAS = [
  {
    key: "formulaPresidencial" as const,
    label: "Presidente",
    color: "bg-red-100 text-red-700",
    dot: "bg-red-600",
  },
  {
    key: "senadorNacional" as const,
    label: "Sen. Nacional",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-700",
  },
  {
    key: "senadorRegional" as const,
    label: "Sen. Regional",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-700",
  },
  {
    key: "diputado" as const,
    label: "Diputados",
    color: "bg-purple-100 text-purple-700",
    dot: "bg-purple-700",
  },
  {
    key: "parlamentoAndino" as const,
    label: "P. Andino",
    color: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-600",
  },
] as const;

export function ResumenVotoLateral({ voto, datos, onValidar, onBorrar }: ResumenVotoLateralProps) {
  // Conteo de columnas marcadas
  const marcadas = FILAS.filter((f) => {
    if (f.key === "formulaPresidencial") return voto.formulaPresidencial !== undefined;
    return voto[f.key] !== undefined;
  }).length;

  const hayAlguna = marcadas > 0;

  return (
    <div className="sticky top-4 flex flex-col gap-3">

      {/* Tarjeta resumen */}
      <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="bg-red-700 text-white px-4 py-3">
          <h3 className="text-xs font-black uppercase tracking-wide">Tu voto simulado</h3>
          <p className="text-[10px] text-red-200 mt-0.5">
            {marcadas} de 5 columnas marcadas
          </p>
          {/* Barra de progreso mini */}
          <div className="mt-2 bg-red-900/50 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(marcadas / 5) * 100}%`,
                backgroundColor: marcadas === 5 ? "#4ade80" : "#fbbf24",
              }}
            />
          </div>
        </div>

        {/* Filas */}
        <div className="divide-y divide-gray-100">
          {FILAS.map((fila) => {
            let sigla: string | null = null;
            let logoId: number | null = null;
            let logoUrl: string | undefined = undefined;
            let marcado = false;

            if (fila.key === "formulaPresidencial") {
              if (voto.formulaPresidencial !== undefined) {
                marcado = true;
                const lista = datos.formulasPresidenciales.find((l) => l.id === voto.formulaPresidencial);
                sigla = lista?.organizacion.sigla ?? null;
                logoId = lista?.organizacion.id ?? null;
              }
            } else {
              const sel = voto[fila.key];
              if (sel) {
                marcado = true;
                const fuente =
                  fila.key === "senadorNacional" ? datos.senadoresNacionales
                  : fila.key === "senadorRegional" ? datos.senadoresRegionales
                  : fila.key === "diputado" ? datos.diputados
                  : datos.parlamentoAndino;
                const lista = fuente.find((l) => l.id === sel.idLista);
                sigla = lista?.organizacion.sigla ?? "Partido sel.";
                logoId = lista?.organizacion.id ?? null;
              }
            }

            if (logoId !== null) {
              logoUrl = getLogoPartido(logoId) ?? undefined;
            }

            return (
              <div key={fila.key} className={`flex items-center gap-2.5 px-3 py-2 ${marcado ? "" : "opacity-50"}`}>
                {/* Dot de cargo */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${marcado ? fila.dot : "bg-gray-300"}`} />

                {/* Label */}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${fila.color}`}>
                  {fila.label}
                </span>

                {/* Partido */}
                <div className="flex-1 min-w-0 flex items-center gap-1.5 justify-end">
                  {marcado && logoUrl ? (
                    <div className="relative w-5 h-5 border border-gray-200 rounded-sm overflow-hidden bg-white shrink-0">
                      <Image
                        src={logoUrl}
                        alt={sigla ?? ""}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <span className={`text-[10px] font-semibold truncate ${marcado ? "text-gray-800" : "text-gray-400 italic"}`}>
                    {marcado ? (sigla ?? "—") : "Sin marcar"}
                  </span>
                  {marcado && <span className="text-green-500 text-xs shrink-0">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón verificar */}
      <button
        type="button"
        onClick={onValidar}
        className="w-full bg-red-700 hover:bg-red-800 text-white font-black text-sm py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 min-h-[48px]"
      >
        <span aria-hidden="true">✓</span>
        Verificar mi voto
      </button>

      {/* Borrar todo */}
      {hayAlguna && (
        <button
          type="button"
          onClick={onBorrar}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs py-2 rounded-xl transition-colors min-h-[36px]"
        >
          Borrar todo
        </button>
      )}

      {/* Nota educativa */}
      <p className="text-[9px] text-gray-400 text-center leading-tight px-1">
        Puedes votar solo algunas columnas. Las no marcadas cuentan como voto en blanco para ese cargo.
      </p>
    </div>
  );
}
