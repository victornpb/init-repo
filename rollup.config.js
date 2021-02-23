import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
// import { terser } from 'rollup-plugin-terser';
import banner from 'rollup-plugin-banner2';
import S from 'tiny-dedent';
import packageJson from './package.json';

const license = () => S(`
  #!/usr/bin/env node
  
  /*!
   * ${packageJson.nameFull} v${packageJson.version} (${packageJson.homepage})
   * Copyright (c) ${packageJson.author}
   * @license ${packageJson.license}
   */
   `
);

const production = !process.env.ROLLUP_WATCH;
const sourcemap = production ? true : 'inline';

export default [

  // Modern Module (No babel preset)
  {
    input: './src/index.js',
    output: [
      {
        file: packageJson.main,
        format: 'iife',
        sourcemap: sourcemap,
        // exports: 'default',
      },
    ],
    external: ['fast-glob', 'inquirer'],
    plugins: [
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
      babel({
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-private-methods'
        ],
      }),
      banner(license),
    ]
  },
];
