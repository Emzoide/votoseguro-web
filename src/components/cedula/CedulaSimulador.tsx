"use client";

import { useState, useEffect } from "react";
import { ColumnaElectoral } from "./ColumnaElectoral";
import { ResultadoVoto } from "./ResultadoVoto";
import { TutorialOnboarding } from "./TutorialOnboarding";
import {
  CeldaPresidencialDesktop,
  CeldaPreferencialDesktop,
} from "./CeldaDesktop";
import { useCedula } from "@/hooks/useCedula";
import { CONFIG_COLUMNAS } from "@/lib/cedula-logic";
import { PARTIDOS } from "@/data/partidos";
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
  regionNombre?: string;
}

export function CedulaSimulador({ datos, regionNombre = "" }: Props) {
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
          {/* Tab buttons - improved for mobile */}
          <div className="bg-gray-100 border-b border-gray-300 px-1 py-2 overflow-x-auto" role="tablist" aria-label="Columnas de la cedula">
            <div className="flex gap-0.5 min-w-fit">
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
                    className={`shrink-0 min-h-[44px] px-2 py-2 rounded border text-[10px] sm:text-[11px] font-bold transition-all duration-200 whitespace-nowrap ${
                      activo
                        ? "bg-white border-red-700 text-red-700 shadow-sm"
                        : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {TAB_LABELS[col.key].short}
                    {marcado ? " ✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="bg-white border-b border-gray-200 px-3 py-2">
            <div className="flex items-center justify-between mb-1 gap-2">
              <span className="text-[10px] text-gray-600 font-semibold">Columna {columnaActiva + 1} de {TODAS_COLUMNAS.length}</span>
              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded">
                {columnasMarcadas}/5 marcadas
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${progreso}%`,
                  backgroundColor: progreso === 100 ? "#dc2626" : "#64748b",
                }}
              />
            </div>
          </div>

          {/* Main content area */}
          <div className="min-h-[65vh] bg-white flex flex-col overflow-y-auto" role="tabpanel">
            {renderColumna(TODAS_COLUMNAS[columnaActiva], "flex-1")}
          </div>

          {/* Navigation footer */}
          <div className="flex gap-2 border-t border-gray-300 bg-gray-50 p-2 sticky bottom-0">
            <button
              type="button"
              onClick={() => setColumnaActiva((c) => Math.max(0, c - 1))}
              disabled={columnaActiva === 0}
              aria-label="Columna anterior"
              className="shrink-0 px-4 py-3 text-sm font-bold text-slate-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              ← Atrás
            </button>

            <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
              <p className="text-[10px] font-bold text-gray-600">{colActualLabel.full}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">
                {columnaActiva === 0 ? "Marca la fórmula presidencial" : "Selecciona una lista y tus preferencias (opcional)"}
              </p>
            </div>

            {esUltima ? (
              <button
                type="button"
                onClick={handleValidar}
                aria-label="Verificar mi voto"
                className="shrink-0 px-4 py-3 text-sm font-bold text-white bg-red-700 hover:bg-red-800 rounded transition-colors"
              >
                Verificar ✓
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setColumnaActiva((c) => Math.min(TODAS_COLUMNAS.length - 1, c + 1))}
                aria-label={`Ir a ${TAB_LABELS[TODAS_COLUMNAS[columnaActiva + 1]?.key ?? "senadorNacional"].full}`}
                className="shrink-0 px-4 py-3 text-sm font-bold text-white bg-slate-700 hover:bg-slate-800 rounded transition-colors"
              >
                Siguiente →
              </button>
            )}
          </div>
        </div>

        {/* ── Layout desktop: una fila por partido ──────────────────────── */}
        <div className="hidden lg:block bg-gray-50">
          <div className="max-h-[76vh] overflow-x-auto overflow-y-auto border-t border-gray-300">
            {/* ── Header 2 filas sticky ── */}
            <div className="sticky top-0 z-10 w-fit min-w-full">
              {/* Fila 1: etiquetas agrupadas */}
              <div className="flex divide-x divide-gray-300">
                <div className="w-[196px] shrink-0 bg-[#b31b1b] text-white py-2 px-2 text-center">
                  <h3 className="font-black text-[11px] uppercase tracking-wide leading-tight">
                    FÓRMULA<br />PRESIDENCIAL
                  </h3>
                </div>
                <div className="w-[246px] shrink-0 bg-[#1f3f94] text-white py-2 px-2 text-center">
                  <h3 className="font-black text-[11px] uppercase tracking-wide leading-tight">
                    SENADORES<br />NACIONALES
                  </h3>
                </div>
                <div className="w-[246px] shrink-0 bg-[#14653a] text-white py-2 px-2 text-center">
                  <h3 className="font-black text-[11px] uppercase tracking-wide leading-tight">
                    SENADORES<br />{regionNombre ? regionNombre.toUpperCase() : "REGIONALES"}
                  </h3>
                </div>
                <div className="w-[246px] shrink-0 bg-[#5b1f94] text-white py-2 px-2 text-center">
                  <h3 className="font-black text-[11px] uppercase tracking-wide leading-tight">
                    DIPUTADOS<br />{regionNombre ? regionNombre.toUpperCase() : ""}
                  </h3>
                </div>
                <div className="w-[246px] shrink-0 bg-[#b27607] text-white py-2 px-2 text-center">
                  <h3 className="font-black text-[11px] uppercase tracking-wide leading-tight">
                    PARLAMENTO<br />ANDINO
                  </h3>
                </div>
              </div>
              {/* Fila 2: sub-títulos descriptivos */}
              <div className="flex divide-x divide-gray-300 text-white text-[9px] font-bold uppercase bg-opacity-90">
                <div className="w-[196px] shrink-0 bg-[#b31b1b] bg-opacity-70 py-1.5 px-2 text-center">
                  Presidente y VP
                </div>
                <div className="w-[246px] shrink-0 bg-[#1f3f94] bg-opacity-70 py-1.5 px-2 text-center">
                  Circunscripción<br />Nacional
                </div>
                <div className="w-[246px] shrink-0 bg-[#14653a] bg-opacity-70 py-1.5 px-2 text-center">
                  Por tu<br />Departamento
                </div>
                <div className="w-[246px] shrink-0 bg-[#5b1f94] bg-opacity-70 py-1.5 px-2 text-center">
                  Cámara de<br />Diputados
                </div>
                <div className="w-[246px] shrink-0 bg-[#b27607] bg-opacity-70 py-1.5 px-2 text-center">
                  Representación<br />Internacional
                </div>
              </div>
            </div>

            {/* ── Body: una fila por partido ── */}
            <div className="flex flex-col w-fit min-w-full">
              {PARTIDOS.map((p) => {
                const formulaLista = DATOS.formulasPresidenciales.find(
                  (l) => l.organizacion.id === p.idOrg
                );
                const senadNacLista = DATOS.senadoresNacionales.find(
                  (l) => l.organizacion.id === p.idOrg
                );
                const senadRegLista = DATOS.senadoresRegionales.find(
                  (l) => l.organizacion.id === p.idOrg
                );
                const dipLista = DATOS.diputados.find(
                  (l) => l.organizacion.id === p.idOrg
                );
                const parlLista = DATOS.parlamentoAndino.find(
                  (l) => l.organizacion.id === p.idOrg
                );
                return (
                  <div
                    key={p.id}
                    className="flex border-b border-[#c8d0d8] divide-x divide-[#c8d0d8]"
                  >
                    <CeldaPresidencialDesktop
                      partido={p}
                      lista={formulaLista}
                      seleccion={voto.formulaPresidencial}
                      onSeleccionar={seleccionarFormula}
                    />
                    <CeldaPreferencialDesktop
                      partido={p}
                      lista={senadNacLista}
                      maxPref={2}
                      seleccion={voto.senadorNacional}
                      onSeleccionar={(id) =>
                        seleccionarLista("senadorNacional", id)
                      }
                      onSetPreferencial={(slot, num) =>
                        setPreferencial("senadorNacional", slot, num, 2)
                      }
                    />
                    <CeldaPreferencialDesktop
                      partido={p}
                      lista={senadRegLista}
                      maxPref={1}
                      seleccion={voto.senadorRegional}
                      onSeleccionar={(id) =>
                        seleccionarLista("senadorRegional", id)
                      }
                      onSetPreferencial={(slot, num) =>
                        setPreferencial("senadorRegional", slot, num, 1)
                      }
                    />
                    <CeldaPreferencialDesktop
                      partido={p}
                      lista={dipLista}
                      maxPref={2}
                      seleccion={voto.diputado}
                      onSeleccionar={(id) =>
                        seleccionarLista("diputado", id)
                      }
                      onSetPreferencial={(slot, num) =>
                        setPreferencial("diputado", slot, num, 2)
                      }
                    />
                    <CeldaPreferencialDesktop
                      partido={p}
                      lista={parlLista}
                      maxPref={2}
                      seleccion={voto.parlamentoAndino}
                      onSeleccionar={(id) =>
                        seleccionarLista("parlamentoAndino", id)
                      }
                      onSetPreferencial={(slot, num) =>
                        setPreferencial("parlamentoAndino", slot, num, 2)
                      }
                    />
                  </div>
                );
              })}
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
