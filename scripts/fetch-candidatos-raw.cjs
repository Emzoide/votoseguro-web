#!/usr/bin/env node
/**
 * Descarga TODOS los candidatos del JNE (proceso EG 2026) y los guarda
 * particionados por cargo y región en src/data/.
 *
 * Ejecutar:  node scripts/fetch-candidatos-raw.cjs
 *
 * No requiere .env — tira directo de la API pública del JNE.
 * Genera los JSONs que candidatos-service.ts importa estáticamente.
 *
 * Estructura de salida:
 *   src/data/presidenciales/candidatos.json
 *   src/data/senadores-nacional/candidatos.json
 *   src/data/senadores-regional/{region}.json   (×27)
 *   src/data/diputados/{region}.json             (×27)
 *   src/data/parlamento-andino/candidatos.json
 */
const fs = require("fs");
const path = require("path");

const JNE_API =
  "https://web.jne.gob.pe/serviciovotoinformado/api/votoinf/listarCanditatos";
const ID_PROCESO = 124;
const DATA_DIR = path.join(__dirname, "..", "src", "data");

// Partidos excluidos por el JNE (no aparecen en cédula)
const EXCLUIDOS = new Set([2968]);

// Cargo IDs del JNE
const CARGO = {
  PRESIDENTE: 1,
  VP1: 2,
  VP2: 3,
  PARLAMENTO_ANDINO: 5,
  DIPUTADO: 15,
  SENADOR: 16,
};

/**
 * Mapa: strDepartamento UPPERCASE → slug para nombre de archivo.
 * Debe coincidir con los ids de src/data/regiones.ts.
 */
const DEP_TO_SLUG = {
  AMAZONAS: "amazonas",
  ANCASH: "ancash",
  APURIMAC: "apurimac",
  AREQUIPA: "arequipa",
  AYACUCHO: "ayacucho",
  CAJAMARCA: "cajamarca",
  CALLAO: "callao",
  CUSCO: "cusco",
  HUANCAVELICA: "huancavelica",
  HUANUCO: "huanuco",
  ICA: "ica",
  JUNIN: "junin",
  "LA LIBERTAD": "la-libertad",
  LAMBAYEQUE: "lambayeque",
  LIMA: "lima",
  "LIMA PROVINCIAS": "lima-provincias",
  LORETO: "loreto",
  "MADRE DE DIOS": "madre-de-dios",
  MOQUEGUA: "moquegua",
  PASCO: "pasco",
  PIURA: "piura",
  PUNO: "puno",
  "SAN MARTIN": "san-martin",
  TACNA: "tacna",
  TUMBES: "tumbes",
  UCAYALI: "ucayali",
  "PERUANOS RESIDENTES EN EL EXTRANJERO": "peruanos-extranjero",
};

function slugFromDep(dep) {
  if (!dep) return null;
  const norm = dep
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return DEP_TO_SLUG[norm] ?? null;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  const kb = Math.round(fs.statSync(filePath).size / 1024);
  console.log(`  ${path.relative(DATA_DIR, filePath)} (${kb} KB, ${data.data.length} candidatos)`);
}

/**
 * Normaliza un registro crudo del JNE al formato estándar de los JSONs.
 */
function normalizar(r) {
  return {
    idProcesoElectoral: ID_PROCESO,
    idOrganizacionPolitica: r.idOrganizacionPolitica,
    strOrganizacionPolitica: r.strOrganizacionPolitica ?? null,
    intPosicion: r.intPosicion ?? null,
    idCargo: r.idCargo,
    strCargo: r.strCargo ?? null,
    strNombres: r.strNombres ?? null,
    strApellidoPaterno: r.strApellidoPaterno ?? null,
    strApellidoMaterno: r.strApellidoMaterno ?? null,
    strEstadoCandidato: r.strEstadoCandidato ?? "INSCRITO",
    strGuidFoto: r.strGuidFoto ?? null,
    strNombre: r.strNombre ?? null,
    strUbigeo: r.strUbigeo ?? "000000",
    strDepartamento: r.strDepartamento ?? null,
    strDocumentoIdentidad: String(r.strDocumentoIdentidad ?? ""),
  };
}

async function main() {
  console.log(`Descargando candidatos EG ${ID_PROCESO} desde JNE...`);
  console.log("(Puede tardar 1-2 minutos)\n");

  const body = JSON.stringify({ idProceso: ID_PROCESO, tipoCandidato: 1 });
  const res = await fetch(JNE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) {
    console.error(`ERROR HTTP ${res.status}`);
    process.exit(1);
  }

  const json = await res.json();
  const raw = (json.data || json || []).filter(
    (r) =>
      r.idProcesoElectoral === ID_PROCESO &&
      !EXCLUIDOS.has(r.idOrganizacionPolitica)
  );
  console.log(`Total candidatos: ${raw.length}\n`);

  const all = raw.map(normalizar);

  // ── Presidenciales (cargo 1, 2, 3) ──────────────────────────────────────────
  const presidenciales = all.filter(
    (r) =>
      r.idCargo === CARGO.PRESIDENTE ||
      r.idCargo === CARGO.VP1 ||
      r.idCargo === CARGO.VP2
  );
  writeJson(path.join(DATA_DIR, "presidenciales", "candidatos.json"), {
    data: presidenciales,
  });

  // ── Senadores (cargo 16) ────────────────────────────────────────────────────
  const senadores = all.filter((r) => r.idCargo === CARGO.SENADOR);
  const senNac = senadores.filter((r) => r.strUbigeo === "000000");
  const senReg = senadores.filter((r) => r.strUbigeo !== "000000");

  writeJson(path.join(DATA_DIR, "senadores-nacional", "candidatos.json"), {
    data: senNac,
  });

  // Senadores regionales — particionar por departamento
  const senRegByDep = {};
  for (const r of senReg) {
    const slug = slugFromDep(r.strDepartamento);
    if (!slug) {
      console.warn(`  WARN: departamento desconocido "${r.strDepartamento}" (senador)`);
      continue;
    }
    (senRegByDep[slug] ??= []).push(r);
  }
  console.log(`  senadores-regional/: ${Object.keys(senRegByDep).length} regiones`);
  for (const [slug, rows] of Object.entries(senRegByDep).sort()) {
    writeJson(path.join(DATA_DIR, "senadores-regional", `${slug}.json`), {
      data: rows,
    });
  }

  // ── Diputados (cargo 15) ────────────────────────────────────────────────────
  const diputados = all.filter((r) => r.idCargo === CARGO.DIPUTADO);
  const dipByDep = {};
  for (const r of diputados) {
    const slug = slugFromDep(r.strDepartamento);
    if (!slug) {
      console.warn(`  WARN: departamento desconocido "${r.strDepartamento}" (diputado)`);
      continue;
    }
    (dipByDep[slug] ??= []).push(r);
  }
  console.log(`  diputados/: ${Object.keys(dipByDep).length} regiones`);
  for (const [slug, rows] of Object.entries(dipByDep).sort()) {
    writeJson(path.join(DATA_DIR, "diputados", `${slug}.json`), {
      data: rows,
    });
  }

  // ── Parlamento Andino (cargo 5) ─────────────────────────────────────────────
  const parlamen = all.filter((r) => r.idCargo === CARGO.PARLAMENTO_ANDINO);
  writeJson(path.join(DATA_DIR, "parlamento-andino", "candidatos.json"), {
    data: parlamen,
  });

  // ── Resumen ─────────────────────────────────────────────────────────────────
  console.log("\nResumen:");
  console.log(`  Presidenciales:      ${presidenciales.length}`);
  console.log(`  Senadores nacionales:${senNac.length}`);
  console.log(`  Senadores regionales:${senReg.length}`);
  console.log(`  Diputados:           ${diputados.length}`);
  console.log(`  Parlamento Andino:   ${parlamen.length}`);
  console.log(`  TOTAL:               ${all.length}`);
  console.log("\nListo. Los JSONs se guardaron en src/data/.");
  console.log("Ejecuta 'npm run build' para verificar.");
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
