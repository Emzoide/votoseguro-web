"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { REGIONES, REGION_POR_NOMBRE_JNE } from "@/data/regiones";

interface Props {
  departamentoActual?: string;
}

const OPCIONES = REGIONES
  .filter((r) => r.id !== "lima-provincias" && r.id !== "peruanos-extranjero")
  .map((r) => ({ value: r.id, label: r.nombre }));

export function SelectorDepartamento({ departamentoActual }: Props) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const depSeleccionado = useMemo(() => {
    if (!departamentoActual) return "";
    if (OPCIONES.some((o) => o.value === departamentoActual)) return departamentoActual;

    const norm = departamentoActual
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return REGION_POR_NOMBRE_JNE.get(norm) ?? "";
  }, [departamentoActual]);

  const seleccion = OPCIONES.find((o) => o.value === depSeleccionado);
  const estaSeleccionado = !!seleccion;

  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(ev.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function elegir(dep: string) {
    setAbierto(false);
    if (dep) router.push(`/simulador?dep=${encodeURIComponent(dep)}`);
    else router.push("/simulador");
  }

  return (
    <div
      className={`
        flex flex-col sm:flex-row items-start sm:items-center gap-3
        mb-5 max-w-3xl mx-auto rounded-xl p-3 sm:p-4 border-2 transition-colors
        ${estaSeleccionado ? "bg-green-50 border-green-300" : "bg-yellow-50 border-yellow-300"}
      `}
    >
      <div className="flex items-center gap-2 shrink-0">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
            ${estaSeleccionado ? "bg-green-500 text-white" : "bg-yellow-400 text-gray-800"}
          `}
        >
          {estaSeleccionado ? "X" : "o"}
        </div>
        <div className="leading-tight">
          <p className="text-xs font-black text-gray-700 uppercase tracking-wide">Circunscripcion electoral</p>
          <p className="text-[10px] text-gray-500">
            {estaSeleccionado ? "Viendo candidatos de tu region" : "Necesario para senadores y diputados"}
          </p>
        </div>
      </div>

      <div ref={boxRef} className="relative w-full sm:flex-1">
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className={`
            w-full text-left text-sm border-2 rounded-lg px-3 py-2.5 bg-white
            font-semibold focus:outline-none focus:ring-2 focus:ring-red-600
            transition-colors
            ${estaSeleccionado ? "border-green-300 text-green-800" : "border-gray-300 text-gray-800"}
          `}
          aria-haspopup="listbox"
          aria-expanded={abierto}
        >
          <span>{seleccion?.label ?? "— Elige tu departamento —"}</span>
          <span className="float-right text-gray-500">{abierto ? "▴" : "▾"}</span>
        </button>

        {abierto && (
          <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
            <button
              type="button"
              onClick={() => elegir("")}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            >
              — Elige tu departamento —
            </button>
            {OPCIONES.map((dep) => (
              <button
                key={dep.value}
                type="button"
                onClick={() => elegir(dep.value)}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                {dep.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {estaSeleccionado && (
        <span className="hidden sm:inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 border border-green-200">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          Seleccionado
        </span>
      )}
    </div>
  );
}
