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
      className={`flex items-stretch border-b border-[#c8d0d8] transition-colors cursor-pointer h-[64px] ${
        isSelected ? `bg-[#e7eaee] ${accentColor}` : "bg-[#eceef0] hover:bg-[#e7eaee]"
      }`}
      onClick={() => onSeleccionarLista(lista.id)}
    >
      <div className="flex items-center justify-center w-12 shrink-0">
        <div
          className={`w-8 h-8 border flex items-center justify-center ${
            isSelected ? "border-black bg-[#f2f2f2]" : "border-slate-700 bg-[#f2f2f2]"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSeleccionarLista(lista.id);
          }}
        >
          {isSelected && <span className="text-lg font-black leading-none text-slate-900">X</span>}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex items-center py-1.5 pr-2">
        <p className="text-[10px] font-black text-black uppercase leading-tight line-clamp-4">{organizacion.nombre}</p>
      </div>

      <div className="flex items-center justify-center w-12 shrink-0 py-1.5 border-l border-[#c8d0d8]">
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

      {maxPreferenciales > 0 && (
        <div className="flex items-center justify-center gap-1.5 px-2 shrink-0 border-l border-[#c8d0d8]" onClick={(e) => e.stopPropagation()}>
          {Array.from({ length: maxPreferenciales }).map((_, slot) => {
            const hasVal = isSelected && !!prefs[slot];
            return (
              <input
                key={slot}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="-"
                disabled={!isSelected}
                value={isSelected ? (inputVals[slot] ?? "") : ""}
                onChange={(e) => handleInputChange(slot, e.target.value)}
                onBlur={() => handleInputCommit(slot)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className={`w-9 h-9 text-center text-[11px] font-black border ${
                  !isSelected
                    ? "border-slate-700 bg-[#e8e8e8] text-slate-400 cursor-not-allowed"
                    : hasVal
                      ? "border-black bg-white text-black"
                      : "border-slate-700 bg-[#f2f2f2] text-black"
                }`}
                aria-label={`Preferencia ${slot + 1} para ${organizacion.nombre}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
