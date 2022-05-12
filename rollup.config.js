import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import tsb from "rollup-plugin-ts";

const buildDir = "dist";

const bundle = ({ name, path }) => ({
  input: `./src/${path}`,
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
  ],
  output: [
    {
      file: `./${buildDir}/${name}.js`,
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    tsb(),
    resolve(),
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
              module,
              main,
              types,
              ...keep
            } = JSON.parse(content.toString());
            return JSON.stringify(keep, null, 2);
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
