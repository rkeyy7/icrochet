import { execSync } from "node:child_process";

function ejecutar(comando) {
  execSync(comando, { stdio: "inherit" });
}

console.log("🧶 Publicando iCrochet…");

ejecutar("git add -A");

const hayCambios = (() => {
  try {
    execSync("git diff --cached --quiet", { stdio: "ignore" });
    return false;
  } catch {
    return true;
  }
})();

if (!hayCambios) {
  console.log("No hay cambios nuevos en el catálogo. Nada que publicar.");
  process.exit(0);
}

const fecha = new Date().toLocaleString("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
});

ejecutar(`git commit -m "Actualiza catalogo (${fecha})"`);
ejecutar("git push");

console.log("");
console.log("✅ Cambios enviados a GitHub.");
console.log("   Vercel detectará el push y publicará la tienda en ~1-2 minutos.");
console.log("   Revisa el avance en https://vercel.com/dashboard");
