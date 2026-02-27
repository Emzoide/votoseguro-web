/**
 * Barrel: senadores regionales enriquecidos particionados por departamento.
 *
 * JSONs copiados de simulador-votacion-2026 (datos de hoja de vida JNE).
 * Formato: { fetchedAt, idProcesoElectoral, count, data: EnrichedCandidatoRaw[] }
 */

import type { EnrichedCandidatoRaw } from "@/lib/types";

import amazonas from "./amazonas.json";
import ancash from "./ancash.json";
import apurimac from "./apurimac.json";
import arequipa from "./arequipa.json";
import ayacucho from "./ayacucho.json";
import cajamarca from "./cajamarca.json";
import callao from "./callao.json";
import cusco from "./cusco.json";
import huancavelica from "./huancavelica.json";
import huanuco from "./huanuco.json";
import ica from "./ica.json";
import junin from "./junin.json";
import laLibertad from "./la-libertad.json";
import lambayeque from "./lambayeque.json";
import lima from "./lima.json";
import limaProvincias from "./lima-provincias.json";
import loreto from "./loreto.json";
import madreDeDios from "./madre-de-dios.json";
import moquegua from "./moquegua.json";
import pasco from "./pasco.json";
import piura from "./piura.json";
import puno from "./puno.json";
import sanMartin from "./san-martin.json";
import tacna from "./tacna.json";
import tumbes from "./tumbes.json";
import ucayali from "./ucayali.json";
import peruanosExtranjero from "./peruanos-extranjero.json";

type EnrichedWrapper = { data: any[] };

function extract(mod: EnrichedWrapper): EnrichedCandidatoRaw[] {
  return mod.data as EnrichedCandidatoRaw[];
}

export const SENADORES_REGIONAL_ENRICHED: Record<string, EnrichedCandidatoRaw[]> = {
  "amazonas":            extract(amazonas as EnrichedWrapper),
  "ancash":              extract(ancash as EnrichedWrapper),
  "apurimac":            extract(apurimac as EnrichedWrapper),
  "arequipa":            extract(arequipa as EnrichedWrapper),
  "ayacucho":            extract(ayacucho as EnrichedWrapper),
  "cajamarca":           extract(cajamarca as EnrichedWrapper),
  "callao":              extract(callao as EnrichedWrapper),
  "cusco":               extract(cusco as EnrichedWrapper),
  "huancavelica":        extract(huancavelica as EnrichedWrapper),
  "huanuco":             extract(huanuco as EnrichedWrapper),
  "ica":                 extract(ica as EnrichedWrapper),
  "junin":               extract(junin as EnrichedWrapper),
  "la-libertad":         extract(laLibertad as EnrichedWrapper),
  "lambayeque":          extract(lambayeque as EnrichedWrapper),
  "lima":                extract(lima as EnrichedWrapper),
  "lima-provincias":     extract(limaProvincias as EnrichedWrapper),
  "loreto":              extract(loreto as EnrichedWrapper),
  "madre-de-dios":       extract(madreDeDios as EnrichedWrapper),
  "moquegua":            extract(moquegua as EnrichedWrapper),
  "pasco":               extract(pasco as EnrichedWrapper),
  "piura":               extract(piura as EnrichedWrapper),
  "puno":                extract(puno as EnrichedWrapper),
  "san-martin":          extract(sanMartin as EnrichedWrapper),
  "tacna":               extract(tacna as EnrichedWrapper),
  "tumbes":              extract(tumbes as EnrichedWrapper),
  "ucayali":             extract(ucayali as EnrichedWrapper),
  "peruanos-extranjero": extract(peruanosExtranjero as EnrichedWrapper),
};
