import Image from "next/image";
import { BadgeAntecedente } from "./BadgeAntecedente";
import { JudicialAlert } from "./JudicialAlert";
import { getHojaVidaUrl } from "@/lib/candidatos-service";
import type { Candidato } from "@/lib/types";
import congresistasData from "@/data/congresistas-2021-2025.json";

interface CongresistaMeta {
  periodo: string;
  tipo: "CONGRESISTA_ACTUAL" | "EX_CONGRESISTA";
}

const congresistas = congresistasData as unknown as Record<string, CongresistaMeta>;

interface FilaCandidatoProps {
  candidato: Candidato;
  posicion: number;
  esPresidencial?: boolean;
}

export function FilaCandidato({ candidato, posicion, esPresidencial = false }: FilaCandidatoProps) {
  const meta = candidato.dni ? congresistas[candidato.dni] : undefined;
  const hojaVidaUrl = candidato.dni ? getHojaVidaUrl(candidato.dni, candidato.idOrganizacion) : undefined;

  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Posición */}
      <div className="w-6 shrink-0 text-center">
        <span className="text-[10px] font-black text-gray-400">#{posicion}</span>
      </div>

      {/* Foto */}
      <div className="shrink-0">
        {candidato.fotoUrl ? (
          <div className={`relative overflow-hidden rounded-full border border-gray-200 bg-gray-100 ${esPresidencial ? "w-12 h-12" : "w-9 h-9"}`}>
            <Image
              src={candidato.fotoUrl}
              alt={candidato.nombreCompleto}
              fill
              className="object-cover object-top"
              unoptimized
            />
          </div>
        ) : (
          <div className={`rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-300 ${esPresidencial ? "w-12 h-12 text-xl" : "w-9 h-9 text-base"}`}>
            👤
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-800 leading-tight">
          {candidato.nombreCompleto}
        </p>
        <div className="flex flex-wrap items-center gap-1 mt-0.5">
          {candidato.dni && (
            <span className="text-[9px] text-gray-400">DNI: {candidato.dni}</span>
          )}
          {meta && (
            <BadgeAntecedente tipo={meta.tipo} periodo={meta.periodo} />
          )}
          {candidato.estado === "IMPUGNADO" && (
            <BadgeAntecedente tipo="IMPUGNADO" />
          )}
        </div>
        {/* Alertas judiciales y legislativas del enriched data */}
        {candidato.flags && (
          <JudicialAlert flags={candidato.flags} sexo={candidato.sexo} />
        )}
      </div>

      {/* Ver hoja de vida */}
      {hojaVidaUrl && (
        <a
          href={hojaVidaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[9px] font-bold text-blue-600 hover:text-blue-800 hover:underline leading-tight text-right"
          onClick={(e) => e.stopPropagation()}
        >
          Ver HV →
        </a>
      )}
    </div>
  );
}
