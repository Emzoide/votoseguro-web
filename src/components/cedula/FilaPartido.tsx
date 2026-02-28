"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getLogoPartido } from "@/lib/partidos-logos";
import type { ListaElectoral, SeleccionColumna } from "@/lib/types";

interface FilaPartidoProps {
  lista: ListaElectoral;
  seleccion: SeleccionColumna | undefined;
  onSeleccionarLista: (idLista: number) => void;
  onSetPreferencial: (slot: number, numeroCandidato: number | null) => void;
  maxPreferenciales: number;
  accentColor?: string;
}

export function FilaPartido({
  lista,
  seleccion,
  onSeleccionarLista,
  onSetPreferencial,
  maxPreferenciales,
  accentColor = "border-l-slate-700",
}: FilaPartidoProps) {
  const isSelected = seleccion?.idLista === lista.id;
  const prefs = isSelected ? (seleccion?.preferencias ?? []) : [];
  const { organizacion } = lista;
  const logoUrl = getLogoPartido(organizacion.id);

  const [inputVals, setInputVals] = useState<string[]>(
    Array.from({ length: maxPreferenciales }, (_, i) => (prefs[i] ? String(prefs[i]) : ""))
  );

  useEffect(() => {
    setInputVals(Array.from({ length: maxPreferenciales }, (_, i) => (prefs[i] ? String(prefs[i]) : "")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected, seleccion?.preferencias?.join(","), maxPreferenciales]);

  const handleInputChange = (slot: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 4);
    const next = [...inputVals];
    next[slot] = cleaned;
    setInputVals(next);
  };

  const handleInputCommit = (slot: number) => {
    const val = parseInt(inputVals[slot], 10);
    onSetPreferencial(slot, Number.isNaN(val) || val <= 0 ? null : val);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch border-b border-[#c8d0d8] transition-colors duration-200 cursor-pointer min-h-[64px] sm:h-[64px] ${
        isSelected ? `bg-red-50 sm:${accentColor}` : "bg-[#eceef0] hover:bg-[#e7eaee]"
      }`}
      onClick={() => onSeleccionarLista(lista.id)}
    >
      {/* Header row para móvil */}
      <div className="flex items-center sm:flex-col sm:justify-center w-full sm:w-12 shrink-0">
        <div
          className={`w-10 h-10 sm:w-8 sm:h-8 border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ml-2 sm:ml-0 ${
            isSelected ? "border-black bg-red-100 shadow-sm" : "border-gray-300 bg-white hover:border-gray-400"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSeleccionarLista(lista.id);
          }}
        >
          {isSelected && <span className="text-lg font-black leading-none text-red-700">✓</span>}
        </div>

        <div className="flex-1 min-w-0 flex items-center sm:hidden py-2 px-2">
          <p className={`text-[11px] font-bold uppercase leading-tight transition-colors duration-200 ${
            isSelected ? "text-red-700" : "text-gray-900"
          }`}>{organizacion.nombre}</p>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex sm:flex-1 sm:min-w-0 sm:items-center py-1.5 pr-2">
        <p className={`text-[10px] font-black uppercase leading-tight line-clamp-4 transition-colors duration-200 ${
          isSelected ? "text-red-700" : "text-black"
        }`}>{organizacion.nombre}</p>
      </div>

      <div className="hidden sm:flex sm:items-center sm:justify-center w-12 shrink-0 py-1.5 border-l border-[#c8d0d8]">
        {logoUrl ? (
          <div className="relative w-10 h-10 border border-black overflow-hidden bg-white">
            <Image src={logoUrl} alt={`Logo ${organizacion.nombre}`} fill className="object-contain p-0.5" unoptimized />
          </div>
        ) : (
          <div className="w-10 h-10 border border-black bg-white flex items-center justify-center">
            <span className="text-[8px] font-black text-gray-600 text-center">{organizacion.sigla.slice(0, 4)}</span>
          </div>
        )}
      </div>

      {/* Mobile: show logo below checkbox */}
      <div className="flex sm:hidden items-center justify-center py-2 px-2 border-l border-[#c8d0d8] bg-[#f9f9f9]">
        {logoUrl ? (
          <div className="relative w-9 h-9 border border-gray-400 overflow-hidden bg-white">
            <Image src={logoUrl} alt={`Logo ${organizacion.nombre}`} fill className="object-contain p-0.5" unoptimized />
          </div>
        ) : (
          <div className="w-9 h-9 border border-gray-400 bg-white flex items-center justify-center">
            <span className="text-[7px] font-black text-gray-600 text-center">{organizacion.sigla.slice(0, 3)}</span>
          </div>
        )}
      </div>

      {/* Preferences inputs */}
      {maxPreferenciales > 0 && isSelected && (
        <div className="flex items-center justify-center gap-1 px-2 py-2 sm:py-1.5 shrink-0 sm:border-l border-t sm:border-t-0 border-[#c8d0d8] bg-red-50 sm:bg-transparent" onClick={(e) => e.stopPropagation()}>
          {Array.from({ length: maxPreferenciales }).map((_, slot) => {
            const hasVal = !!prefs[slot];
            return (
              <input
                key={slot}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={`${slot + 1}`}
                value={inputVals[slot] ?? ""}
                onChange={(e) => handleInputChange(slot, e.target.value)}
                onBlur={() => handleInputCommit(slot)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className={`w-10 sm:w-9 h-10 sm:h-9 text-center text-[12px] sm:text-[11px] font-black border-2 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:outline-none active:scale-90 ${
                  hasVal
                    ? "border-red-700 bg-white text-red-700 font-bold"
                    : "border-gray-400 bg-[#fafafa] text-gray-600 placeholder-gray-500"
                }`}
                aria-label={`Preferencia ${slot + 1} para ${organizacion.nombre}`}
              />
            );
          })}
        </div>
      )}

      {/* Mobile hint text */}
      {!isSelected && maxPreferenciales > 0 && (
        <div className="flex sm:hidden items-center justify-center text-[9px] text-gray-500 py-2 px-2 border-t border-[#c8d0d8] bg-gray-100 w-full">
          Toca para preferencias
        </div>
      )}
    </div>
  );
}
