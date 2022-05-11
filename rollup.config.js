// import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import ts from "typescript";
import tsb from "rollup-plugin-ts";

const buildDir = "dist";

const bundle = ({ name, path }) => ({
  input: `./src/${path}`,
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  output: [
    {
      file: `./${buildDir}/lib/${name}.js`,
      format: "esm",
      sourcemap: true,
    },
    {
      file: `./${buildDir}/lib/${name}.cjs.js`,
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    tsb({
      typescript: ts,
      tsconfig: "tsconfig.json",
    }),
    terser({
      output: {
        comments: false,
      },
    }),
    copy({
      targets: [
        { src: "README.md", dest: buildDir },
        {
          src: "package.json",
          dest: buildDir,
          transform: (content) => {
            const {
              scripts,
              devDependencies,
              husky,
              release,
              engines,
              ...keep
            } = JSON.parse(content.toString());
            return JSON.stringify(
              {
                ...keep,
                module: `lib/${keep.module}`,
                main: `lib/${keep.main}`,
                types: `lib/${keep.types}`,
              },
              null,
              2
            );
          },
        },
      ],
    }),
  ],
});

export default [
  bundle({ path: "client/index.ts", name: "client" }),
  bundle({ path: "server/index.ts", name: "server" }),
];
