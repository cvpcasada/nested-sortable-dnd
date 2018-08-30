import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const externalizeDependencies = pkg => {
  const external = [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
  ];

  if (external.length === 0) {
    return () => false;
  }

  const pattern = new RegExp(`^(${external.join('|')})($|/)`);
  return id => pattern.test(id);
};

export default {
  input: 'src/index.js',
  external: externalizeDependencies(pkg),
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      runtimeHelpers: true,
      presets: ['react-app'],
      plugins: [
        [
          'transform-runtime',
          { helpers: true, polyfill: false, regenerator: true },
        ],
      ],
    }),
  ],
  output: [
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.main,
      format: 'cjs',
    },
  ],
  watch: {
    include: 'src/**',
  },
};
