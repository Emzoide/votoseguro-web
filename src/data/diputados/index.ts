/**
 * Barrel: diputados particionados por departamento.
 *
 * Cada JSON tiene formato { data: CandidatoJNERaw[] } directo de la API JNE.
 * Se exporta un objeto indexado por region-id (kebab-case).
 */

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JNEDataWrapper = { data: any[] };

function extract(mod: JNEDataWrapper) {
  return mod.data;
}

export const DIPUTADOS: Record<string, unknown[]> = {
  "amazonas":            extract(amazonas as JNEDataWrapper),
  "ancash":              extract(ancash as JNEDataWrapper),
  "apurimac":            extract(apurimac as JNEDataWrapper),
  "arequipa":            extract(arequipa as JNEDataWrapper),
  "ayacucho":            extract(ayacucho as JNEDataWrapper),
  "cajamarca":           extract(cajamarca as JNEDataWrapper),
  "callao":              extract(callao as JNEDataWrapper),
  "cusco":               extract(cusco as JNEDataWrapper),
  "huancavelica":        extract(huancavelica as JNEDataWrapper),
  "huanuco":             extract(huanuco as JNEDataWrapper),
  "ica":                 extract(ica as JNEDataWrapper),
  "junin":               extract(junin as JNEDataWrapper),
  "la-libertad":         extract(laLibertad as JNEDataWrapper),
  "lambayeque":          extract(lambayeque as JNEDataWrapper),
  "lima":                extract(lima as JNEDataWrapper),
  "lima-provincias":     extract(limaProvincias as JNEDataWrapper),
  "loreto":              extract(loreto as JNEDataWrapper),
  "madre-de-dios":       extract(madreDeDios as JNEDataWrapper),
  "moquegua":            extract(moquegua as JNEDataWrapper),
  "pasco":               extract(pasco as JNEDataWrapper),
  "piura":               extract(piura as JNEDataWrapper),
  "puno":                extract(puno as JNEDataWrapper),
  "san-martin":          extract(sanMartin as JNEDataWrapper),
  "tacna":               extract(tacna as JNEDataWrapper),
  "tumbes":              extract(tumbes as JNEDataWrapper),
  "ucayali":             extract(ucayali as JNEDataWrapper),
  "peruanos-extranjero": extract(peruanosExtranjero as JNEDataWrapper),
};
