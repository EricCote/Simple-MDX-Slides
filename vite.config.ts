import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import path from 'path';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypePrism from './src/components/Codeblock-prism/rehype-prism';
import { rehypeSimpleSlides } from './src/components/slides/rehype-simple-slides';
import { read } from 'to-vfile';
import { matter } from 'vfile-matter';
import { readdir, writeFile } from 'node:fs/promises';

interface FileName {
  filename: string;
}

const files = await readdir('src/decks', {
  recursive: false,
  withFileTypes: true,
});

let results = [];
for (const file of files.filter((f) => f.isDirectory() === false)) {
  const f = await read('src/decks/' + file.name);
  matter(f);

  (f.data.matter as FileName).filename = file.name;
  results.push(f.data.matter);
}

writeFile('src/slidedecks.json', JSON.stringify(results, null, 2));

//console.log(file.data.matter);

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
            rehypePrism,
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
    server: {
      headers: {
        // 'Content-Security-Policy': `object-src * ; img-src *`,
      },
    },
    resolve: {
      preserveSymlinks: true,
      alias: {
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        '~prism-themes': path.resolve(__dirname, 'node_modules/prism-themes'),
      },
    },
  }
);
