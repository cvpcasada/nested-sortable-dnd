import babel from "rollup-plugin-babel";
import pkg from "./package.json";
import babelPresetReact from "babel-preset-react-app";

const modifiedPreset = (api, opts) => {
  const preset = babelPresetReact(api, opts);

  preset.presets[0][1].targets = {
    browsers: [">0.2%", "not dead", "not ie <= 11", "not op_mini all"]
  };

  preset.plugins[5][1] = {
    corejs: false,
    helpers: true,
    regenerator: true
  };

  return preset;
};

const externalizeDependencies = pkg => {
  const external = [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {})
  ];

  if (external.length === 0) {
    return () => false;
  }

  const pattern = new RegExp(`^(${external.join("|")})($|/)`);
  return id => pattern.test(id);
};

export default {
  input: "src/index.js",
  external: externalizeDependencies(pkg),
  plugins: [
    babel({
      exclude: "node_modules/**",
      babelrc: false,
      runtimeHelpers: true,
      presets: [modifiedPreset]
    })
  ],
  output: [
    {
      file: pkg.module,
      format: "es"
    },
    {
      file: pkg.main,
      format: "cjs"
    }
  ],
  watch: {
    include: "src/**"
  }
};
