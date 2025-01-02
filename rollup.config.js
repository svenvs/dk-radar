import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import * as path from 'path';

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.js',
		format: 'iife'
	},
    plugins: [
        postcss({
          extract: true,
            // Or with custom file name
          extract: path.resolve('dist/styles.css'),
          plugins: []
        }),
        image(),
        nodeResolve()
      ]
};