// Regenera utils/supabase/database.types.ts a partir del schema public del
// proyecto en Supabase. Uso: npm run types:supabase
//
// Escribimos el archivo solo si la CLI terminó bien: una falla (p. ej. sin
// SUPABASE_ACCESS_TOKEN) no debe dejar el archivo vacío, como ocurriría con
// la redirección de shell `> archivo.ts` en Windows.
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const target = join(root, "utils", "supabase", "database.types.ts");
const cli = join(root, "node_modules", "supabase", "dist", "supabase.js");

const result = spawnSync(
  process.execPath,
  [
    cli,
    "gen",
    "types",
    "typescript",
    "--project-id",
    "ytbnpptjvpyusmfsccet",
    "--schema",
    "public",
  ],
  { cwd: root, encoding: "utf8" },
);

if (result.stderr) process.stderr.write(result.stderr);

const types = result.stdout ?? "";
if (result.status !== 0 || !types.includes("export type Database")) {
  console.error(`gen types falló (status ${result.status}); ${target} no se modificó.`);
  console.error("¿Existe SUPABASE_ACCESS_TOKEN en .env o hiciste `npx supabase login`?");
  process.exit(result.status ?? 1);
}

writeFileSync(target, types, "utf8");
console.log(`Tipos regenerados en ${target}`);
