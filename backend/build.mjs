import { build } from "esbuild";
import { cpSync } from 'fs';

cpSync('../frontend/dist', './dist', { recursive: true });

await build({
  entryPoints: ["server.js"],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: "dist/server.js",
  sourcemap: true,
});

console.log("Backend build OK -> dist/server.js");
