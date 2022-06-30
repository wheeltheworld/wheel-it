import resolve from "@rollup/plugin-node-resolve";
import tsb from "rollup-plugin-ts";

import pkg from "./package.json";

const buildDir = "dist";

const bundle = ({ name, path }) => ({
  input: `./src/${path}`,
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
  ],
  output: [
    {
      file: `./${buildDir}/${name}.esm.js`,
      format: "esm",
      sourcemap: true,
    },
    {
      file: `./${buildDir}/${name}.cjs.js`,
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    tsb(),
    resolve(),
  ],
});

export default [
  bundle({ path: "client/index.ts", name: "client" }),
  bundle({ path: "server/index.ts", name: "server" }),
];
