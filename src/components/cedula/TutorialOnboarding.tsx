"use client";

import { useState, useEffect } from "react";

const PASOS = [
  {
    titulo: "¿Cómo marcar tu voto?",
    descripcion: "Toca el recuadro del partido que prefieres para marcarlo con una aspa (✗). Puedes marcar un partido distinto en cada columna.",
    icono: "✗",
  },
  {
    titulo: "5 columnas, 5 decisiones",
    descripcion: "La cédula tiene 5 columnas: Presidencial, Senadores Nacionales, Senadores Regionales, Diputados y Parlamento Andino. Navega con las pestañas.",
    icono: "🗳️",
  },
  {
    titulo: "Voto preferencial (opcional)",
    descripcion: "En Senadores y Diputados puedes elegir candidatos específicos dentro del partido marcado. Es completamente opcional.",
    icono: "⭐",
  },
  {
    titulo: "¡Verifica tu voto!",
    descripcion: "Al terminar pulsa 'Verificar mi voto' para saber si tu cédula sería válida, nula o en blanco.",
    icono: "✅",
  },
];

const STORAGE_KEY = "votoseguro_tutorial_visto";

export function TutorialOnboarding() {
  const [visible, setVisible] = useState(false);
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    // Mostrar solo si el usuario nunca lo vio
    const visto = localStorage.getItem(STORAGE_KEY);
    if (!visto) {
      // Pequeño delay para no interrumpir la carga inicial
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const handleCerrar = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const handleSiguiente = () => {
    if (paso < PASOS.length - 1) {
      setPaso((p) => p + 1);
    } else {
      handleCerrar();
    }
  };

  const handleAnterior = () => {
    setPaso((p) => Math.max(0, p - 1));
  };

  if (!visible) return null;

  const pasoActual = PASOS[paso];

  return (
    <>
      {/* Overlay semitransparente */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-in fade-in duration-300"
        onClick={handleCerrar}
        aria-hidden="true"
      />

      {/* Tooltip / modal centrado */}
      <div
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-32px)] max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Tutorial del simulador"
      >
        <div className="bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Botón cerrar (X) */}
          <button
            type="button"
            onClick={handleCerrar}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-gray-200 font-bold z-10"
            aria-label="Cerrar tutorial"
          >
            ×
          </button>

          {/* Flecha decorativa (apunta hacia la cédula) */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-3 overflow-hidden pointer-events-none">
            <div className="w-4 h-4 bg-gray-900 rotate-45 mx-auto -mt-2" />
          </div>

          {/* Contenido */}
          <div className="px-5 pt-5 pb-4">
            {/* Icono */}
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto shadow-md">
              {pasoActual.icono}
            </div>

            <h3 className="text-base font-black text-white text-center mb-2">
              {pasoActual.titulo}
            </h3>
            <p className="text-sm text-gray-300 text-center leading-relaxed">
              {pasoActual.descripcion}
            </p>
          </div>

          {/* Indicadores de paso */}
          <div className="flex justify-center gap-1.5 pb-3">
            {PASOS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPaso(i)}
                aria-label={`Ir al paso ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === paso ? "w-6 bg-yellow-400" : "w-1.5 bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Botones */}
          <div className="flex border-t border-white/10">
            {paso > 0 ? (
              <button
                type="button"
                onClick={handleAnterior}
                className="flex-1 py-3.5 text-sm font-semibold text-gray-400 hover:text-white
                           transition-colors border-r border-white/10 min-h-[48px]"
              >
                ← Anterior
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCerrar}
                className="flex-1 py-3.5 text-sm font-semibold text-gray-400 hover:text-white
                           transition-colors border-r border-white/10 min-h-[48px]"
              >
                Omitir
              </button>
            )}
            <button
              type="button"
              onClick={handleSiguiente}
              className="flex-1 py-3.5 text-sm font-bold bg-yellow-400 text-gray-900
                         hover:bg-yellow-300 transition-colors min-h-[48px]"
            >
              {paso < PASOS.length - 1 ? "Siguiente →" : "¡Empezar!"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
