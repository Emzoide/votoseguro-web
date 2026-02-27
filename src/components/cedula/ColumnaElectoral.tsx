"use client";

import Image from "next/image";
import { FilaPartido } from "./FilaPartido";
import { getLogoPartido } from "@/lib/partidos-logos";
import type { ListaElectoral, SeleccionColumna, ConfigColumna } from "@/lib/types";
import { PARTIDOS } from "@/data/partidos";

const COLUMNA_COLORS: Record<number, { header: string; accent: string; border: string }> = {
  0: { header: "bg-[#b31b1b]", accent: "border-l-red-800", border: "border-red-900" },
  1: { header: "bg-[#1f3f94]", accent: "border-l-blue-800", border: "border-blue-900" },
  2: { header: "bg-[#14653a]", accent: "border-l-green-800", border: "border-green-900" },
  3: { header: "bg-[#5b1f94]", accent: "border-l-purple-800", border: "border-purple-900" },
  4: { header: "bg-[#b27607]", accent: "border-l-amber-800", border: "border-amber-900" },
};

interface ColumnaElectoralProps {
  config: ConfigColumna;
  listas: ListaElectoral[];
  seleccion: SeleccionColumna | number | undefined;
  onSeleccionarLista: (idLista: number) => void;
  className?: string;
  onSetPreferencial?: (slot: number, numeroCandidato: number | null) => void;
  esFormula?: boolean;
}

export function ColumnaElectoral({
  config,
  listas,
  seleccion,
  onSeleccionarLista,
  onSetPreferencial,
  esFormula = false,
  className = "",
}: ColumnaElectoralProps) {
  const seleccionColumna = esFormula ? undefined : (seleccion as SeleccionColumna | undefined);
  const seleccionFormula = esFormula ? (seleccion as number | undefined) : undefined;

  const colIdx = config.titulo.toLowerCase().includes("presidencial")
    ? 0
    : config.titulo.toLowerCase().includes("nacional")
      ? 1
      : config.titulo.toLowerCase().includes("regional")
        ? 2
        : config.titulo.toLowerCase().includes("diputado")
          ? 3
          : 4;

  const colors = COLUMNA_COLORS[colIdx] ?? COLUMNA_COLORS[0];
  const tieneSeleccion = esFormula ? seleccionFormula !== undefined : seleccionColumna !== undefined;
  const listaPorOrg = new Map<number, ListaElectoral>(listas.map((l) => [l.organizacion.id, l]));
  const filasRender = !esFormula && listas.length === 0
    ? []
    : PARTIDOS.map((p) => {
        if (p.retirado) {
          return {
            idOrg: p.idOrg,
            lista: undefined,
            esSeparador: true,
          };
        }

        const listaExistente = listaPorOrg.get(p.idOrg);

        // En Parlamento Andino mostramos todos los partidos aunque no tengan
        // candidatos cargados en la fuente, para mantener la cédula completa.
        if (!listaExistente && config.tipo === "PARLAMENTO_ANDINO") {
          return {
            idOrg: p.idOrg,
            lista: {
              id: p.idOrg,
              organizacion: {
                id: p.idOrg,
                nombre: p.nombre,
                sigla: p.siglas,
                colorPrimario: p.color,
                numeroLista: p.id,
              },
              cargo: "PARLAMENTO_ANDINO" as const,
              candidatos: [],
            } as ListaElectoral,
            esSeparador: false,
          };
        }

        return {
          idOrg: p.idOrg,
          lista: listaExistente,
          esSeparador: false,
        };
      });

  return (
    <div className={`flex flex-col min-w-0 bg-white ${className}`}>
      <div className={`${colors.header} text-white px-2 py-1.5 text-center sticky top-0 z-10 border-b ${colors.border} min-h-[54px] flex flex-col items-center justify-center`}>
        <h3 className="text-[12px] font-black uppercase tracking-wide leading-tight">{config.titulo}</h3>
        <p className="text-[10px] text-white/90 leading-tight mt-0.5">{config.subtitulo}</p>
      </div>

      <div className="flex items-center bg-[#eef1f4] border-b border-[#bcc4ce] text-[9px] font-black text-slate-800 uppercase min-h-[30px]">
        <div className="w-12 shrink-0 text-center py-1.5">X</div>
        <div className="flex-1 min-w-0 py-1.5 pl-1.5">Partido</div>
        <div className="w-12 shrink-0 text-center py-1.5 border-l border-[#bcc4ce]">Simbolo</div>
        {esFormula ? (
          <div className="w-12 shrink-0 text-center py-1.5 border-l border-[#bcc4ce]">Foto</div>
        ) : config.maxPreferenciales > 0 ? (
          <div
            className="shrink-0 text-center py-1.5 border-l border-[#bcc4ce]"
            style={{ width: config.maxPreferenciales === 1 ? "56px" : "92px" }}
          >
            Pref.
          </div>
        ) : null}
      </div>

      <div className="bg-[#e9edf2] border-b border-[#c8d0d8] px-2 min-h-[34px] flex items-center justify-center">
        <p className="text-[9px] text-slate-600 text-center leading-tight line-clamp-2">{config.descripcionVoto}</p>
      </div>

      <div className="flex-1 overflow-y-auto lg:overflow-visible">
        {!esFormula && listas.length === 0 && (
          <div className="flex items-center justify-center min-h-[220px] px-3">
            <p className="text-[11px] font-semibold text-gray-500 text-center leading-snug">
              Selecciona tu departamento para visualizar candidatos en esta columna.
            </p>
          </div>
        )}

        {filasRender.map((fila) => {
          const lista = fila.lista;
          if (!lista || fila.esSeparador) {
            return (
              <div
                key={`blank-${fila.idOrg}`}
                className="flex items-stretch border-b border-[#c8d0d8] h-[64px] bg-[#eceef0]"
                aria-hidden="true"
                >
                  <div className="w-12 shrink-0" />
                  <div className="flex-1 min-w-0" />
                  <div className="w-12 shrink-0 border-l border-[#c8d0d8]" />
                  {esFormula ? (
                    <div className="w-12 shrink-0 border-l border-[#c8d0d8]" />
                  ) : config.maxPreferenciales > 0 ? (
                    <div
                      className="shrink-0 border-l border-[#c8d0d8]"
                      style={{ width: config.maxPreferenciales === 1 ? "56px" : "92px" }}
                    />
                  ) : null}
              </div>
            );
          }

          if (esFormula) {
            const isSelected = seleccionFormula === lista.id;
            const logoUrl = getLogoPartido(lista.organizacion.id);
            const fotoUrl = lista.presidente?.fotoUrl;

            if (!lista.presidente) {
              return (
                <div
                  key={lista.id}
                  className="flex items-stretch border-b border-[#c8d0d8] h-[64px] bg-[#eceef0]"
                  aria-hidden="true"
                >
                  <div className="w-12 shrink-0" />
                  <div className="flex-1 min-w-0" />
                  <div className="w-12 shrink-0 border-l border-[#c8d0d8]" />
                  <div className="w-12 shrink-0 border-l border-[#c8d0d8]" />
                </div>
              );
            }
            const presidente = lista.presidente!;

            return (
              <div
                key={lista.id}
                className={`flex items-stretch border-b border-[#c8d0d8] transition-colors cursor-pointer h-[64px] ${
                  isSelected ? "bg-[#e7eaee]" : "bg-[#eceef0] hover:bg-[#e7eaee]"
                }`}
                onClick={() => onSeleccionarLista(lista.id)}
              >
                <div className="flex items-center justify-center w-12 shrink-0">
                  <div className={`w-8 h-8 border flex items-center justify-center ${isSelected ? "border-black bg-[#f2f2f2]" : "border-slate-700 bg-[#f2f2f2]"}`}>
                    {isSelected && <span className="text-lg font-black leading-none text-slate-900">X</span>}
                  </div>
                </div>

                <div className="flex-1 min-w-0 py-1.5 pr-2 flex flex-col justify-center">
                  <p className="text-[10px] font-black text-black uppercase leading-tight line-clamp-3">{lista.organizacion.nombre}</p>
                  <p className="text-[9px] font-semibold text-slate-800 leading-tight mt-0.5 truncate">
                    {presidente.nombres} {presidente.apellidoPaterno}
                  </p>
                </div>

                <div className="flex items-center justify-center w-12 shrink-0 py-1.5 border-l border-[#c8d0d8]">
                  {logoUrl ? (
                    <div className="relative w-10 h-10 border border-black overflow-hidden bg-white">
                      <Image src={logoUrl} alt={`Logo ${lista.organizacion.nombre}`} fill className="object-contain p-0.5" unoptimized />
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center border border-black bg-white">
                      <span className="text-[8px] font-black text-gray-600 text-center">{lista.organizacion.sigla.slice(0, 4)}</span>
                    </div>
                  )}
                </div>

                <div className="w-12 shrink-0 border-l border-[#c8d0d8] bg-[#eceef0] flex items-center justify-center py-1.5">
                  {fotoUrl ? (
                    <div className="relative w-10 h-10 border border-black overflow-hidden bg-white">
                      <Image src={fotoUrl} alt={lista.presidente?.nombreCompleto ?? "Candidato"} fill className="object-contain bg-white" unoptimized />
                    </div>
                  ) : (
                    <div className="w-10 h-10 border border-black bg-[#f2f2f2]" />
                  )}
                </div>
              </div>
            );
          }

          return (
            <FilaPartido
              key={lista.id}
              lista={lista}
              seleccion={seleccionColumna}
              onSeleccionarLista={onSeleccionarLista}
              onSetPreferencial={(slot, num) => onSetPreferencial?.(slot, num)}
              maxPreferenciales={config.maxPreferenciales}
              accentColor={colors.accent}
            />
          );
        })}
      </div>
    </div>
  );
}
