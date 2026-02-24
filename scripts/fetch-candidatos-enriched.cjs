#!/usr/bin/env node
/**
 * Enriquece los JSONs raw de candidatos con datos de la hoja de vida JNE.
 *
 * Lee los JSONs particionados de src/data/ y por cada candidato:
 *   1. Busca su ficha en la API JNE (por DNI)
 *   2. Descarga su hoja de vida (educación, ingresos, trayectoria)
 *   3. Descarga resoluciones del JEE
 *   4. Extrae flags: ex-congresista, sentencias, etc.
 *
 * Uso:
 *   node scripts/fetch-candidatos-enriched.cjs [tipo] [region]
 *
 *   tipo:   all | presidenciales | senadoresNacional | senadoresRegional | diputados | parlamenAndino
 *   region: slug de región (opcional, solo para tipos regionales)
 *
 * Ejemplos:
 *   node scripts/fetch-candidatos-enriched.cjs                          # todo
 *   node scripts/fetch-candidatos-enriched.cjs diputados lima           # solo diputados de Lima
 *   node scripts/fetch-candidatos-enriched.cjs senadoresRegional cusco  # senadores regionales de Cusco
 *
 * Output: src/data/{tipo}-enriched/ con los JSONs enriquecidos.
 *
 * NOTA: Este script es para Fase 2 (datos enriquecidos). Los JSONs raw
 * ya son suficientes para el simulador y la página de candidatos.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const JNE_FOTO = "https://mpesije.jne.gob.pe/apidocs/";
const ID_PROCESO_ELECTORAL = 124;
const DATA_DIR = path.join(__dirname, "..", "src", "data");
const DELAY_MS = 3000;
const DELAY_JITTER = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => DELAY_MS + Math.floor(Math.random() * DELAY_JITTER);

// Browser-like headers to avoid CAPTCHA
const BROWSER_HEADERS =
  '-H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" ' +
  '-H "Accept-Language: es-PE,es;q=0.9" ' +
  '-H "Referer: https://votoinformado.jne.gob.pe/"';

function curlGet(url) {
  try {
    const result = execSync(
      `curl -sk "${url}" ${BROWSER_HEADERS} -H "Accept: application/json"`,
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
    );
    return JSON.parse(result);
  } catch {
    return null;
  }
}

function curlPost(url, body) {
  try {
    const tmpFile = path.join(
      require("os").tmpdir(),
      "jne-body.json"
    );
    fs.writeFileSync(tmpFile, JSON.stringify(body));
    const result = execSync(
      `curl -sk -X POST "${url}" ${BROWSER_HEADERS} ` +
        `-H "Content-Type: application/json" -H "Accept: application/json" ` +
        `-d @${tmpFile}`,
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
    );
    return JSON.parse(result);
  } catch (e) {
    console.error(` [CURL ERROR] ${e.message}`);
    return null;
  }
}

function buscarCandidato(dni) {
  const url =
    "https://apiplataformaelectoral2.jne.gob.pe/api/v1/candidato";
  const body = {
    pageSize: 10,
    skip: 1,
    filter: {
      idProcesoElectoral: ID_PROCESO_ELECTORAL,
      numeroDocumento: dni,
    },
  };
  const res = curlPost(url, body);
  return res?.data?.[0] || null;
}

function fetchHojaVida(idHojaVida) {
  const url = `https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?IdHojaVida=${idHojaVida}`;
  return curlGet(url);
}

function fetchResoluciones(idHojaVida) {
  const url = `https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/resoluciones?IdHojaVida=${idHojaVida}`;
  return curlGet(url);
}

function extractFlags(hoja) {
  const cargosEleccion = hoja.trayectoria?.cargoEleccion || [];
  const isCurrent = (c) =>
    ["2025", "2026", 2025, 2026].includes(c.anioCargoElecHasta);
  return {
    congresistaActual: cargosEleccion.some(
      (c) => c.cargoEleccion?.includes("CONGRESISTA") && isCurrent(c)
    ),
    exCongresista: cargosEleccion.some(
      (c) => c.cargoEleccion?.includes("CONGRESISTA") && !isCurrent(c)
    ),
    exAlcalde: cargosEleccion.some((c) =>
      c.cargoEleccion?.includes("ALCALDE")
    ),
    exGobernador: cargosEleccion.some((c) =>
      c.cargoEleccion?.includes("GOBERNADOR")
    ),
    exMinistro: cargosEleccion.some((c) =>
      c.cargoEleccion?.includes("MINISTRO")
    ),
    cargosAnteriores: cargosEleccion.map(
      (c) =>
        `${c.cargoEleccion} (${c.anioCargoElecDesde}-${c.anioCargoElecHasta})`
    ),
    sentenciaPenal: (hoja.sentenciaPenal?.length || 0) > 0,
    sentenciaPenalDetalle: hoja.sentenciaPenal || [],
    sentenciaObliga: (hoja.sentenciaObliga?.length || 0) > 0,
    sentenciaObligaDetalle: hoja.sentenciaObliga || [],
  };
}

function extractResumen(hoja) {
  const edu = hoja.formacionAcademica;
  const posgrado = edu?.educacionPosgrado?.[0];
  const uni = edu?.educacionUniversitaria?.[0];
  const ingresos = hoja.declaracionJurada?.ingreso?.[0];
  return {
    educacionMax:
      posgrado?.txEspecialidadPosgrado || uni?.carreraUni || null,
    institucion:
      posgrado?.txCenEstudioPosgrado || uni?.universidad || null,
    ingresos2024: ingresos?.totalIngresos || 0,
    experienciaActual:
      hoja.experienciaLaboral?.[0]?.ocupacionProfesion || null,
  };
}

function enrichCandidato(dni, pos = null) {
  try {
    const candidato = buscarCandidato(dni);
    if (!candidato) {
      console.error(` [SKIP] No candidate found for DNI ${dni}`);
      return null;
    }
    const hoja = fetchHojaVida(candidato.idHojaVida);
    if (!hoja?.datoGeneral) return null;
    const resoluciones = fetchResoluciones(candidato.idHojaVida);
    const general = hoja.datoGeneral;
    return {
      dni: general.numeroDocumento,
      idHojaVida: general.idHojaVida,
      idOrg: general.idOrganizacionPolitica,
      pos,
      nombre: `${general.nombres} ${general.apellidoPaterno} ${general.apellidoMaterno}`,
      partido: general.organizacionPolitica,
      cargo: general.cargo,
      foto: JNE_FOTO + general.txNombreArchivo,
      estado: general.estado,
      fechaNacimiento: general.feNacimiento,
      lugarNacimiento: `${general.naciDistrito || ""}, ${general.naciProvincia || ""}`
        .replace(/^, |, $/g, ""),
      flags: extractFlags(hoja),
      resumen: extractResumen(hoja),
      trayectoria: hoja.trayectoria,
      formacionAcademica: hoja.formacionAcademica,
      experienciaLaboral: hoja.experienciaLaboral,
      declaracionJurada: hoja.declaracionJurada,
      sentenciaPenal: hoja.sentenciaPenal,
      sentenciaObliga: hoja.sentenciaObliga,
      resoluciones: resoluciones?.data || [],
    };
  } catch (err) {
    console.error(`Error ${dni}:`, err.message);
    return null;
  }
}

async function processFile(inputFile, outputFile) {
  console.log(`\nProcessing: ${path.relative(DATA_DIR, inputFile)}`);
  const raw = JSON.parse(fs.readFileSync(inputFile, "utf8"));
  const candidates = raw.data || [];

  // Resumable: skip already-enriched candidates
  let existing = [];
  if (fs.existsSync(outputFile)) {
    const existingData = JSON.parse(fs.readFileSync(outputFile, "utf8"));
    existing = existingData.data || [];
  }
  const existingDnis = new Set(existing.map((c) => c.dni));
  const toFetch = candidates.filter(
    (c) => !existingDnis.has(c.strDocumentoIdentidad)
  );

  console.log(
    `  ${candidates.length} total, ${existing.length} already enriched, ${toFetch.length} to fetch`
  );

  if (toFetch.length === 0) {
    console.log("  All candidates already enriched, skipping.");
    return;
  }

  const enriched = [...existing];
  for (let i = 0; i < toFetch.length; i++) {
    const c = toFetch[i];
    const dni = c.strDocumentoIdentidad;
    const pos = c.intPosicion;
    process.stdout.write(
      `\r  [${i + 1}/${toFetch.length}] Fetching ${dni}...`
    );
    const data = enrichCandidato(dni, pos);
    if (data) enriched.push(data);
    await sleep(randomDelay());
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  const output = {
    fetchedAt: new Date().toISOString(),
    idProcesoElectoral: ID_PROCESO_ELECTORAL,
    count: enriched.length,
    data: enriched,
  };
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`\n  Saved ${enriched.length} → ${path.relative(DATA_DIR, outputFile)}`);
}

async function processDirectory(inputDir, outputDir) {
  const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".json"));
  fs.mkdirSync(outputDir, { recursive: true });
  for (const file of files) {
    await processFile(
      path.join(inputDir, file),
      path.join(outputDir, file)
    );
  }
}

async function main() {
  const args = process.argv.slice(2);
  const type = args[0] || "all";
  const region = args[1] || null;

  console.log("=== JNE Candidate Data Enrichment ===");
  console.log(`Type: ${type}${region ? `, Region: ${region}` : ""}\n`);

  if (type === "presidenciales" || type === "all") {
    await processFile(
      path.join(DATA_DIR, "presidenciales", "candidatos.json"),
      path.join(DATA_DIR, "presidenciales-enriched", "candidatos.json")
    );
  }

  if (type === "parlamenAndino" || type === "all") {
    await processFile(
      path.join(DATA_DIR, "parlamento-andino", "candidatos.json"),
      path.join(DATA_DIR, "parlamento-andino-enriched", "candidatos.json")
    );
  }

  if (type === "senadoresNacional" || type === "all") {
    await processFile(
      path.join(DATA_DIR, "senadores-nacional", "candidatos.json"),
      path.join(DATA_DIR, "senadores-nacional-enriched", "candidatos.json")
    );
  }

  if (type === "senadoresRegional" || type === "all") {
    if (region) {
      await processFile(
        path.join(DATA_DIR, "senadores-regional", `${region}.json`),
        path.join(DATA_DIR, "senadores-regional-enriched", `${region}.json`)
      );
    } else {
      await processDirectory(
        path.join(DATA_DIR, "senadores-regional"),
        path.join(DATA_DIR, "senadores-regional-enriched")
      );
    }
  }

  if (type === "diputados" || type === "all") {
    if (region) {
      await processFile(
        path.join(DATA_DIR, "diputados", `${region}.json`),
        path.join(DATA_DIR, "diputados-enriched", `${region}.json`)
      );
    } else {
      await processDirectory(
        path.join(DATA_DIR, "diputados"),
        path.join(DATA_DIR, "diputados-enriched")
      );
    }
  }

  console.log("\n=== Done ===");
}

main().catch(console.error);
