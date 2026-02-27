"use client";

// ============================================================
// useCedula — Hook de estado para el simulador de cédula
// ============================================================

import { useState, useCallback } from "react";
import type { VotoCedula, SeleccionColumna, ResultadoCedula } from "@/lib/types";
import { validarCedula } from "@/lib/cedula-logic";

interface UseCedulaReturn {
  voto: VotoCedula;
  resultado: ResultadoCedula | null;
  seleccionarFormula: (idLista: number) => void;
  seleccionarLista: (
    columna: keyof Omit<VotoCedula, "formulaPresidencial">,
    idLista: number
  ) => void;
  togglePreferencial: (
    columna: keyof Omit<VotoCedula, "formulaPresidencial">,
    numeroCandidato: number,
    maxPrefs: number
  ) => void;
  setPreferencial: (
    columna: keyof Omit<VotoCedula, "formulaPresidencial">,
    slot: number,
    numeroCandidato: number | null,
    maxPrefs: number
  ) => void;
  resetear: () => void;
  validar: () => ResultadoCedula;
  tiempoInicio: number;
  cambiosRealizados: number;
}

const VOTO_INICIAL: VotoCedula = {};

export function useCedula(): UseCedulaReturn {
  const [voto, setVoto] = useState<VotoCedula>(VOTO_INICIAL);
  const [resultado, setResultado] = useState<ResultadoCedula | null>(null);
  const [tiempoInicio] = useState<number>(() => Date.now());
  const [cambiosRealizados, setCambiosRealizados] = useState<number>(0);

  const registrarCambio = useCallback(() => {
    setCambiosRealizados((prev) => prev + 1);
  }, []);

  const seleccionarFormula = useCallback(
    (idLista: number) => {
      setVoto((prev) => {
        // Deseleccionar si ya estaba seleccionado
        if (prev.formulaPresidencial === idLista) {
          const { formulaPresidencial: _, ...rest } = prev;
          void _;
          return rest;
        }
        return { ...prev, formulaPresidencial: idLista };
      });
      registrarCambio();
      setResultado(null);
    },
    [registrarCambio]
  );

  const seleccionarLista = useCallback(
    (
      columna: keyof Omit<VotoCedula, "formulaPresidencial">,
      idLista: number
    ) => {
      setVoto((prev) => {
        const selActual = prev[columna];
        // Deseleccionar si ya estaba seleccionado el mismo partido
        if (selActual?.idLista === idLista) {
          const next = { ...prev };
          delete next[columna];
          return next;
        }
        // Cambiar de lista: resetear preferenciales
        return {
          ...prev,
          [columna]: { idLista, preferencias: [] } as SeleccionColumna,
        };
      });
      registrarCambio();
      setResultado(null);
    },
    [registrarCambio]
  );

  const togglePreferencial = useCallback(
    (
      columna: keyof Omit<VotoCedula, "formulaPresidencial">,
      numeroCandidato: number,
      maxPrefs: number
    ) => {
      setVoto((prev) => {
        const sel = prev[columna];
        if (!sel) return prev; // No hay lista seleccionada, ignorar

        const prefs = sel.preferencias;
        const yaSeleccionado = prefs.includes(numeroCandidato);

        if (yaSeleccionado) {
          // Deseleccionar
          return {
            ...prev,
            [columna]: {
              ...sel,
              preferencias: prefs.filter((p) => p !== numeroCandidato),
            },
          };
        }

        // No agregar si ya llegó al máximo
        if (prefs.length >= maxPrefs) return prev;

        return {
          ...prev,
          [columna]: {
            ...sel,
            preferencias: [...prefs, numeroCandidato],
          },
        };
      });
      registrarCambio();
      setResultado(null);
    },
    [registrarCambio]
  );

  // Establece un número de candidato en un slot específico (0-based).
  // Si numeroCandidato es null o <=0, limpia ese slot.
  const setPreferencial = useCallback(
    (
      columna: keyof Omit<VotoCedula, "formulaPresidencial">,
      slot: number,
      numeroCandidato: number | null,
      maxPrefs: number
    ) => {
      setVoto((prev) => {
        const sel = prev[columna];
        if (!sel) return prev; // No hay lista seleccionada

        // Construir array de longitud maxPrefs (0 = vacío)
        const prefs: number[] = Array.from({ length: maxPrefs }, (_, i) => sel.preferencias[i] ?? 0);

        if (numeroCandidato === null || numeroCandidato <= 0) {
          prefs[slot] = 0;
        } else {
          // Si el número ya está en otro slot, quitarlo primero
          for (let i = 0; i < prefs.length; i++) {
            if (i !== slot && prefs[i] === numeroCandidato) prefs[i] = 0;
          }
          prefs[slot] = numeroCandidato;
        }

        return {
          ...prev,
          [columna]: { ...sel, preferencias: prefs.filter((n) => n > 0) },
        };
      });
      registrarCambio();
      setResultado(null);
    },
    [registrarCambio]
  );

  const resetear = useCallback(() => {
    setVoto(VOTO_INICIAL);
    setResultado(null);
    registrarCambio();
  }, [registrarCambio]);

  const validar = useCallback((): ResultadoCedula => {
    const r = validarCedula(voto);
    setResultado(r);
    return r;
  }, [voto]);

  return {
    voto,
    resultado,
    seleccionarFormula,
    seleccionarLista,
    togglePreferencial,
    setPreferencial,
    resetear,
    validar,
    tiempoInicio,
    cambiosRealizados,
  };
}
