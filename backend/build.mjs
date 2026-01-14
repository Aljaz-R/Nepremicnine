// backend/build.mjs :s
import { build } from "esbuild";

await build({
  entryPoints: ["server.js"],
  bundle: true,
  platform: "node",
  target: "node22",
  outfile: "dist/server.js",
  external: ["express"],
});

console.log("Backend build OK -> dist/server.js");
