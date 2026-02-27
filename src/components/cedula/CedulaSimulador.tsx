"use client";

import { useState } from "react";
import { ColumnaElectoral } from "./ColumnaElectoral";
import { ResultadoVoto } from "./ResultadoVoto";
import { TutorialOnboarding } from "./TutorialOnboarding";
import { useCedula } from "@/hooks/useCedula";
import { CONFIG_COLUMNAS } from "@/lib/cedula-logic";
import type { DatosSimulador, VotoCedula } from "@/lib/types";

type ColumnaKey = keyof Omit<VotoCedula, "formulaPresidencial">;

const TODAS_COLUMNAS: Array<{
  key: "formulaPresidencial" | ColumnaKey;
  configIdx: number;
  esFormula: boolean;
}> = [
  { key: "formulaPresidencial", configIdx: 0, esFormula: true },
  { key: "senadorNacional", configIdx: 1, esFormula: false },
  { key: "senadorRegional", configIdx: 2, esFormula: false },
  { key: "diputado", configIdx: 3, esFormula: false },
  { key: "parlamentoAndino", configIdx: 4, esFormula: false },
];

const TAB_LABELS: Record<string, { short: string; full: string }> = {
  formulaPresidencial: { short: "Presidencial", full: "Formula Presidencial" },
  senadorNacional: { short: "Sen. Nacional", full: "Senadores Nacionales" },
  senadorRegional: { short: "Sen. Regional", full: "Senadores Regionales" },
  diputado: { short: "Diputados", full: "Diputados" },
  parlamentoAndino: { short: "P. Andino", full: "Parlamento Andino" },
};

interface Props {
  datos: DatosSimulador;
}

export function CedulaSimulador({ datos }: Props) {
  const DATOS = datos;

  const COLUMNA_DATOS: Record<ColumnaKey, typeof DATOS.senadoresNacionales> = {
    senadorNacional: DATOS.senadoresNacionales,
    senadorRegional: DATOS.senadoresRegionales,
    diputado: DATOS.diputados,
    parlamentoAndino: DATOS.parlamentoAndino,
  };

  const {
    voto,
    resultado,
    seleccionarFormula,
    seleccionarLista,
    setPreferencial,
    resetear,
    validar,
  } = useCedula();

  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [columnaActiva, setColumnaActiva] = useState(0);

  const handleValidar = () => {
    validar();
    setMostrarResultado(true);
    setTimeout(() => {
      document.getElementById("resultado-voto")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleReintentar = () => {
    resetear();
    setMostrarResultado(false);
    setColumnaActiva(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tieneSeleccion = (key: string) => {
    if (key === "formulaPresidencial") return voto.formulaPresidencial !== undefined;
    return voto[key as ColumnaKey] !== undefined;
  };

  const columnasMarcadas = TODAS_COLUMNAS.filter((c) => tieneSeleccion(c.key)).length;
  const progreso = (columnasMarcadas / TODAS_COLUMNAS.length) * 100;

  const hayAlgunaSeleccion =
    voto.formulaPresidencial !== undefined ||
    voto.senadorNacional !== undefined ||
    voto.senadorRegional !== undefined ||
    voto.diputado !== undefined ||
    voto.parlamentoAndino !== undefined;

  const renderColumna = (col: (typeof TODAS_COLUMNAS)[number], className = "") => {
    const config = CONFIG_COLUMNAS[col.configIdx];
    if (col.esFormula) {
      return (
        <ColumnaElectoral
          key={col.key}
          config={config}
          listas={DATOS.formulasPresidenciales}
          seleccion={voto.formulaPresidencial}
          onSeleccionarLista={seleccionarFormula}
          esFormula={true}
          className={className}
        />
      );
    }

    const ck = col.key as ColumnaKey;
    return (
      <ColumnaElectoral
        key={col.key}
        config={config}
        listas={COLUMNA_DATOS[ck]}
        seleccion={voto[ck]}
        onSeleccionarLista={(idLista) => seleccionarLista(ck, idLista)}
        onSetPreferencial={(slot, num) => setPreferencial(ck, slot, num, config.maxPreferenciales)}
        esFormula={false}
        className={className}
      />
    );
  };

  const esUltima = columnaActiva === TODAS_COLUMNAS.length - 1;
  const colActualLabel = TAB_LABELS[TODAS_COLUMNAS[columnaActiva].key];

  return (
    <div className="max-w-full">
      <TutorialOnboarding />

      <section className="overflow-hidden border border-[#bfc6cf] bg-white">
        <header className="bg-red-700 text-white text-center px-4 py-3">
          <h2 className="text-lg sm:text-2xl font-black uppercase tracking-wide">Cedula de sufragio</h2>
          <p className="text-xs sm:text-sm text-slate-100 mt-1">
            Marque con una cruz o un aspa. El voto preferencial es opcional.
          </p>
        </header>

        <div className="bg-[#f8f6e8] border-y border-[#e7dfb0] px-3 py-1.5">
          <p className="text-[11px] text-[#c2410c] text-center">
            Los espacios vacios corresponden a partidos sin candidatos.
          </p>
        </div>

        <div className="bg-white border-b border-gray-300 px-3 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-600 font-semibold">Progreso de marcado</span>
            <span className="text-[11px] font-bold text-gray-800">{columnasMarcadas} / 5 columnas</span>
          </div>
          <div
            className="w-full bg-gray-200 rounded-full h-2"
            role="progressbar"
            aria-valuenow={columnasMarcadas}
            aria-valuemin={0}
            aria-valuemax={5}
            aria-label={`${columnasMarcadas} de 5 columnas completadas`}
          >
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progreso}%`,
                backgroundColor: progreso === 100 ? "#16a34a" : "#1e293b",
              }}
            />
          </div>
        </div>

        <div className="lg:hidden flex flex-col">
          <div className="flex gap-1 bg-gray-100 border-b border-gray-300 px-2 py-1.5" role="tablist" aria-label="Columnas de la cedula">
            {TODAS_COLUMNAS.map((col, idx) => {
              const activo = columnaActiva === idx;
              const marcado = tieneSeleccion(col.key);
              return (
                <button
                  key={col.key}
                  type="button"
                  role="tab"
                  aria-selected={activo}
                  onClick={() => setColumnaActiva(idx)}
                  className={`flex-1 min-h-[40px] rounded border text-[9px] font-bold px-1 ${
                    activo ? "bg-white border-gray-400 text-gray-900" : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  {TAB_LABELS[col.key].short}
                  {marcado ? " *" : ""}
                </button>
              );
            })}
          </div>

          <div className="min-h-[72vh] bg-white flex flex-col" role="tabpanel">
            {renderColumna(TODAS_COLUMNAS[columnaActiva], "flex-1")}
          </div>

          <div className="flex border-t border-gray-300">
            <button
              type="button"
              onClick={() => setColumnaActiva((c) => Math.max(0, c - 1))}
              disabled={columnaActiva === 0}
              aria-label="Columna anterior"
              className="w-24 shrink-0 py-3 text-sm font-bold text-slate-700 bg-gray-100 disabled:opacity-30"
            >
              Atras
            </button>
            <div className="flex-1 flex items-center justify-center text-xs font-bold text-slate-700">
              {columnaActiva + 1} de {TODAS_COLUMNAS.length} - {colActualLabel.full}
            </div>
            {esUltima ? (
              <button
                type="button"
                onClick={handleValidar}
                aria-label="Verificar mi voto"
                className="w-24 shrink-0 py-3 text-sm font-bold text-white bg-green-700"
              >
                Verificar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setColumnaActiva((c) => Math.min(TODAS_COLUMNAS.length - 1, c + 1))}
                aria-label={`Ir a ${TAB_LABELS[TODAS_COLUMNAS[columnaActiva + 1]?.key ?? "senadorNacional"].full}`}
                className="w-24 shrink-0 py-3 text-sm font-bold text-white bg-slate-700"
              >
                Siguiente
              </button>
            )}
          </div>
        </div>

        <div className="hidden lg:block bg-gray-50">
          <div className="max-h-[76vh] overflow-y-auto border-t border-gray-300">
            <div className="grid grid-cols-5 divide-x divide-gray-300 min-w-[1200px]">
              {TODAS_COLUMNAS.map((col) => renderColumna(col))}
            </div>
          </div>
        </div>
      </section>

      <p className="text-[10px] text-gray-500 text-center mt-2 px-2">
        Simulador educativo. Datos referenciales del JNE. La cedula oficial es emitida por la ONPE.
      </p>

      <div className="mt-3 px-1">
        {hayAlgunaSeleccion ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleValidar}
              className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-3.5 rounded-lg text-sm transition-colors min-h-[48px]"
            >
              Verificar mi voto
            </button>
            <button
              type="button"
              onClick={handleReintentar}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3.5 px-4 rounded-lg text-sm transition-colors min-h-[48px]"
            >
              Borrar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleValidar}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3.5 rounded-lg text-sm transition-colors min-h-[48px]"
          >
            Verificar mi voto
          </button>
        )}
      </div>

      {mostrarResultado && resultado && (
        <div id="resultado-voto" className="mt-6">
          <ResultadoVoto resultado={resultado} voto={voto} datos={DATOS} onReintentar={handleReintentar} />
        </div>
      )}
    </div>
  );
}
