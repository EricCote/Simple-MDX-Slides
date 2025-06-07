//import InlineCode from './InlineCode';
import Sandpack from './index';

const prettierConfig = `
export default {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: true,
};
`;

const ShowRenderedHTML = `
import { use, Suspense } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { format } from 'prettier';
import prettierPluginHTML from 'prettier/plugins/html';
import prettierConfig from '/prettier.config.mjs';

export default function SuspenseWrapper(props){
  return <Suspense>
    <ShowRenderedHTML {...props} />
  </Suspense>
}

function ShowRenderedHTML({ children }) {
  const markup = renderToStaticMarkup(
    <html>
      <head />
      <body>{children}</body>
    </html>
  );
  const formattedHtml = use(
    format(markup, {
      parser: 'html',
      plugins: [prettierPluginHTML],
      ...prettierConfig,
    })
  );
  return (
    <>
      <h1>Rendered HTML:</h1>
      <pre>{formattedHtml}</pre>
    </>
  );
}
`;

const packageJSON = `
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "^5.0.0",
    "prettier": "^3.3.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
`;

export default function SandpackWithHTMLOutput(
  props: React.ComponentProps<typeof Sandpack>
) {
  const files = {
    'src/ShowRenderedHTML.js': { code: ShowRenderedHTML, hidden: false },
    'package.json': { code: packageJSON, hidden: true },
    'prettier.config.mjs': { code: prettierConfig, hidden: true },
  };

  return <Sandpack {...props} files={{ ...files, ...props.files }} />;
}
