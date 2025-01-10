import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import path from 'path';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypePretty from './src/components/Codeblock-pretty/rehype-pretty';
import { rehypeSimpleSlides } from './src/components/slides/rehype-simple-slides';
import { read } from 'to-vfile';
import { matter } from 'vfile-matter';
import { readdir, writeFile } from 'node:fs/promises';

interface FileName {
  filename: string;
  date: string;
}

const files = await readdir('src/decks', {
  recursive: false,
  withFileTypes: true,
});

let results: FileName[] = [] as FileName[];
for (const file of files.filter((f) => f.isDirectory() === false)) {
  const f = await read('src/decks/' + file.name);
  matter(f);

  (f.data.matter as FileName).filename = file.name;

  results.push(f.data.matter as FileName);
}

const sortedResults = results
  .toSorted(function compareFn(a, b) {
    if (!a.date || a.date < b.date) {
      return -1;
    } else if (a.date > b.date) {
      return 1;
    }
    // a must be equal to b
    return 0;
  })
  .toReversed();

writeFile('src/slidedecks.json', JSON.stringify(sortedResults, null, 2));

// https://vitejs.dev/config
export default defineConfig(
  /* ({ command }) => ( */ {
    build: { chunkSizeWarningLimit: 700 },
    plugins: [
      {
        enforce: 'pre',
        ...mdx({
          // development: command === 'serve',
          remarkPlugins: [
            remarkGfm,
            [remarkFrontmatter],
            [remarkMdxFrontmatter],
          ],
          rehypePlugins: [
            [
              rehypePretty,
              {
                defaultLang: 'js',
                theme: {
                  dark: 'dark-plus',
                  light: 'catppuccin-latte',
                },
              },
            ],
            [
              rehypeSimpleSlides,
              {
                slideSeparators: ['hr'],
                slideType: 'section',
                slideClass: null,
              },
            ],
          ],
        }),
      },
      react(),
    ],
    // Les options de CSS permettent de compiler le SASS
    // de bootstrap sans erreurs
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: [
            'import',
            'mixed-decls',
            'legacy-js-api',
            'global-builtin',
            'color-functions',
          ],
        },
      },
    },
    server: {
      headers: {
        // 'Content-Security-Policy': `object-src * ; img-src *`,
      },
    },
    resolve: {
      preserveSymlinks: true,
      alias: {
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      },
    },
  }
);
