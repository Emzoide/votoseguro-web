"use client";

import { useState, useEffect } from "react";

// Domingo 12 de abril de 2026 a las 8:00 AM (hora Perú, UTC-5)
const FECHA_ELECCIONES = new Date("2026-04-12T08:00:00-05:00");

interface TimeLeft {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  pasaron: boolean;
}

function calcularTiempoRestante(): TimeLeft {
  const ahora = new Date();
  const diff = FECHA_ELECCIONES.getTime() - ahora.getTime();

  if (diff <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0, pasaron: true };
  }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diff % (1000 * 60)) / 1000);

  return { dias, horas, minutos, segundos, pasaron: false };
}

export function CountdownElecciones({ compact = false }: { compact?: boolean }) {
  const [tiempo, setTiempo] = useState<TimeLeft>({
    dias: 0, horas: 0, minutos: 0, segundos: 0, pasaron: false,
  });
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTiempo(calcularTiempoRestante());
    setMontado(true);

    const intervalo = setInterval(() => {
      setTiempo(calcularTiempoRestante());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  if (!montado) return null;

  if (tiempo.pasaron) {
    return (
      <div className="text-center">
        <span className="text-yellow-300 font-black text-sm">
          🗳️ ¡HOY ES DÍA DE ELECCIONES!
        </span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs">
        <span className="text-red-200">Faltan:</span>
        <span className="font-black text-yellow-300">
          {tiempo.dias}d {String(tiempo.horas).padStart(2, "0")}h{" "}
          {String(tiempo.minutos).padStart(2, "0")}m
        </span>
        <span className="text-red-200">para votar</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {[
        { valor: tiempo.dias, label: "días" },
        { valor: tiempo.horas, label: "horas" },
        { valor: tiempo.minutos, label: "min" },
        { valor: tiempo.segundos, label: "seg" },
      ].map(({ valor, label }) => (
        <div key={label} className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 min-w-[52px] sm:min-w-[60px]">
            <span className="text-xl sm:text-2xl font-black text-white tabular-nums block">
              {String(valor).padStart(2, "0")}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-red-200 uppercase tracking-wider mt-1 block">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
