"use client";

/**
 * Celdas para el layout de escritorio row-based de la cédula.
 * Cada celda ocupa una columna electoral para una fila de partido.
 *
 * CeldaPresidencialDesktop  — min-w-[196px]  (checkbox + nombre + logo + foto)
 * CeldaPreferencialDesktop  — min-w-[246px]  (checkbox + nombre + logo + prefs)
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { getLogoPartido } from "@/lib/partidos-logos";
import type {
  ListaElectoral,
  PartidoPolitico,
  SeleccionColumna,
} from "@/lib/types";

// ── CeldaPresidencialDesktop ────────────────────────────────────────────────────

interface CeldaPresidencialDesktopProps {
  partido: PartidoPolitico;
  lista: ListaElectoral | undefined;
  seleccion: number | undefined;
  onSeleccionar: (idLista: number) => void;
}

export function CeldaPresidencialDesktop({
  partido,
  lista,
  seleccion,
  onSeleccionar,
}: CeldaPresidencialDesktopProps) {
  const isSelected = lista !== undefined && seleccion === lista.id;
  const logoUrl = lista ? getLogoPartido(partido.idOrg) : undefined;
  const presidente = lista?.presidente;
  const fotoUrl = presidente?.fotoUrl;

  // Partido retirado: fila en blanco con opacidad reducida
  if (partido.retirado) {
    return (
      <div
        className="flex items-stretch h-[64px] w-[196px] shrink-0 bg-[#eceef0] opacity-40"
        aria-hidden="true"
      >
        <div className="w-12 shrink-0" />
        <div className="flex-1 min-w-0" />
        <div className="w-12 shrink-0 border-l border-[#c8d0d8]" />
        <div className="w-12 shrink-0 border-l border-[#c8d0d8]" />
      </div>
    );
  }

  // Sin fórmula o sin candidato presidencial: fila vacía
  if (!lista || !presidente) {
    return (
      <div
        className="flex items-stretch h-[64px] w-[196px] shrink-0 bg-[#eceef0]"
        aria-hidden="true"
      >
        <div className="w-12 shrink-0" />
        <div className="flex-1 min-w-0" />
        <div className="w-12 shrink-0 border-l border-[#c8d0d8]" />
        <div className="w-12 shrink-0 border-l border-[#c8d0d8]" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-stretch h-[64px] w-[196px] shrink-0 transition-colors duration-200 cursor-pointer ${isSelected ? "bg-red-50" : "bg-[#eceef0] hover:bg-[#e7eaee]"
        }`}
      onClick={() => onSeleccionar(lista.id)}
    >
      {/* Checkbox aspa */}
      <div className="flex items-center justify-center w-12 shrink-0">
        <div
          className={`w-8 h-8 border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${isSelected
            ? "border-black bg-red-100 shadow-sm"
            : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          onClick={(e) => {
            e.stopPropagation();
            onSeleccionar(lista.id);
          }}
        >
          {isSelected && (
            <span className="text-lg font-black leading-none text-red-700">
              ✓
            </span>
          )}
        </div>
      </div>

      {/* Nombre partido + candidato */}
      <div className="flex-1 min-w-0 py-1.5 pr-2 flex flex-col justify-center">
        <p className={`text-[10px] font-black uppercase leading-tight line-clamp-3 transition-colors duration-200 ${isSelected ? "text-red-700" : "text-black"
          }`}>
          {lista.organizacion.nombre}
        </p>
        <p className={`text-[9px] leading-tight mt-0.5 truncate transition-colors duration-200 ${isSelected ? "font-bold text-red-600" : "font-semibold text-slate-800"
          }`}>
          {presidente.nombres} {presidente.apellidoPaterno}
        </p>
      </div>

      {/* Logo partido */}
      <div className="flex items-center justify-center w-12 shrink-0 py-1.5 border-l border-[#c8d0d8]">
        {logoUrl ? (
          <div className="relative w-10 h-10 border border-black overflow-hidden bg-white">
            <Image
              src={logoUrl}
              alt={`Logo ${lista.organizacion.nombre}`}
              fill
              className="object-contain p-0.5"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-10 h-10 border border-black bg-white flex items-center justify-center">
            <span className="text-[8px] font-black text-gray-600 text-center">
              {lista.organizacion.sigla.slice(0, 4)}
            </span>
          </div>
        )}
      </div>

      {/* Foto presidente - con checkmark overlay si está seleccionada */}
      <div className="w-12 shrink-0 border-l border-[#c8d0d8] bg-[#eceef0] flex items-center justify-center py-1.5">
        {fotoUrl ? (
          <div className="relative w-10 h-10 border border-black overflow-hidden bg-white">
            <Image
              src={fotoUrl}
              alt={presidente.nombreCompleto}
              fill
              className="object-contain bg-white"
              unoptimized
            />
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-600 bg-opacity-80 rounded-sm">
                <span className="text-lg font-black text-white drop-shadow-lg">✓</span>
              </div>
            )}
          </div>
        ) : (
          <div className={`relative w-10 h-10 border border-black flex items-center justify-center ${isSelected ? "bg-red-600" : "bg-[#f2f2f2]"}`}>
            {isSelected && (
              <span className="text-lg font-black text-white drop-shadow-lg">✓</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── CeldaPreferencialDesktop ────────────────────────────────────────────────────

interface CeldaPreferencialDesktopProps {
  partido: PartidoPolitico;
  lista: ListaElectoral | undefined;
  maxPref: number;
  seleccion: SeleccionColumna | undefined;
  onSeleccionar: (idLista: number) => void;
  onSetPreferencial: (slot: number, valor: number | null) => void;
}

export function CeldaPreferencialDesktop({
  partido,
  lista,
  maxPref,
  seleccion,
  onSeleccionar,
  onSetPreferencial,
}: CeldaPreferencialDesktopProps) {
  const isSelected = lista !== undefined && seleccion?.idLista === lista.id;
  const prefs = isSelected ? (seleccion?.preferencias ?? []) : [];
  const logoUrl = lista ? getLogoPartido(partido.idOrg) : undefined;

  const [inputVals, setInputVals] = useState<string[]>(
    Array.from({ length: maxPref }, (_, i) =>
      prefs[i] ? String(prefs[i]) : ""
    )
  );

  useEffect(() => {
    setInputVals(
      Array.from({ length: maxPref }, (_, i) =>
        prefs[i] ? String(prefs[i]) : ""
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected, seleccion?.preferencias?.join(","), maxPref]);

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

  // Prefwidth para el bloque de inputs
  const prefBlockWidth = maxPref === 1 ? "w-[56px]" : "w-[92px]";

  // Partido retirado: fila en blanco con opacidad reducida
  if (partido.retirado) {
    return (
      <div
        className="flex items-stretch h-[64px] w-[246px] shrink-0 bg-[#eceef0] opacity-40"
        aria-hidden="true"
      >
        <div className="w-12 shrink-0" />
        <div className="flex-1 min-w-0" />
        <div className="w-12 shrink-0 border-l border-[#c8d0d8]" />
        {maxPref > 0 && (
          <div
            className={`${prefBlockWidth} shrink-0 border-l border-[#c8d0d8]`}
          />
        )}
      </div>
    );
  }

  // Sin lista para esta circunscripción: fila vacía
  if (!lista) {
    return (
      <div
        className="flex items-stretch h-[64px] w-[246px] shrink-0 bg-[#eceef0]"
        aria-hidden="true"
      >
        <div className="w-12 shrink-0" />
        <div className="flex-1 min-w-0" />
        <div className="w-12 shrink-0 border-l border-[#c8d0d8]" />
        {maxPref > 0 && (
          <div
            className={`${prefBlockWidth} shrink-0 border-l border-[#c8d0d8]`}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-stretch h-[64px] w-[246px] shrink-0 transition-colors duration-200 cursor-pointer ${isSelected ? "bg-red-50" : "bg-[#eceef0] hover:bg-[#e7eaee]"
        }`}
      onClick={() => onSeleccionar(lista.id)}
    >
      {/* Checkbox aspa */}
      <div className="flex items-center justify-center w-12 shrink-0">
        <div
          className={`w-8 h-8 border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${isSelected
            ? "border-black bg-red-100 shadow-sm"
            : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          onClick={(e) => {
            e.stopPropagation();
            onSeleccionar(lista.id);
          }}
        >
          {isSelected && (
            <span className="text-lg font-black leading-none text-red-700">
              ✓
            </span>
          )}
        </div>
      </div>

      {/* Nombre partido */}
      <div className="flex-1 min-w-0 flex items-center py-1.5 pr-2">
        <p className={`text-[10px] font-black uppercase leading-tight line-clamp-4 transition-colors duration-200 ${isSelected ? "text-red-700" : "text-black"
          }`}>
          {lista.organizacion.nombre}
        </p>
      </div>

      {/* Logo partido */}
      <div className="flex items-center justify-center w-12 shrink-0 py-1.5 border-l border-[#c8d0d8]">
        {logoUrl ? (
          <div className="relative w-10 h-10 border border-black overflow-hidden bg-white">
            <Image
              src={logoUrl}
              alt={`Logo ${lista.organizacion.nombre}`}
              fill
              className="object-contain p-0.5"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-10 h-10 border border-black bg-white flex items-center justify-center">
            <span className="text-[8px] font-black text-gray-600 text-center">
              {lista.organizacion.sigla.slice(0, 4)}
            </span>
          </div>
        )}
      </div>

      {/* Inputs preferenciales */}
      {maxPref > 0 && (
        <div
          className={`flex items-center justify-center gap-1.5 px-2 shrink-0 border-l border-[#c8d0d8] ${prefBlockWidth}`}
          onClick={(e) => {
            if (isSelected) e.stopPropagation();
          }}
        >
          {isSelected &&
            Array.from({ length: maxPref }).map((_, slot) => {
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
                  className={`w-9 h-9 text-center text-[11px] font-black border-2 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:outline-none active:scale-90 ${hasVal
                    ? "border-black bg-white text-black"
                    : "border-slate-400 bg-[#f9f9f9] text-slate-500 placeholder-slate-400"
                    }`}
                  aria-label={`Preferencia ${slot + 1} para ${lista.organizacion.nombre
                    }`}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}
