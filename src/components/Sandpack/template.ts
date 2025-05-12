export const template = {
  '/src/index.js': {
    hidden: true,
    code: `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";


const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  },
  '/package.json': {
    hidden: true,
    code: JSON.stringify(
      {
        name: 'reactacademy.live',
        version: '0.0.0',
        main: '/src/index.js',
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test --env=jsdom',
          eject: 'react-scripts eject',
        },
        dependencies: {
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          'react-scripts': '^5.0.0',
        },
      },
      null,
      2
    ),
  },
  '/public/index.html': {
    hidden: true,
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
  },
};

export const templateV18 = {
  ...template,
  '/package.json': {
    hidden: true,
    code: JSON.stringify(
      {
        name: 'reactacademy.live',
        version: '0.0.0',
        main: '/src/index.js',
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test --env=jsdom',
          eject: 'react-scripts eject',
        },
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0',
          'react-scripts': 'latest',
        },
      },
      null,
      2
    ),
  },
};

export const templateV19 = {
  ...template,
  '/package.json': {
    hidden: true,
    code: JSON.stringify(
      {
        name: 'reactacademy.live',
        version: '0.0.0',
        main: '/src/index.js',
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test --env=jsdom',
          eject: 'react-scripts eject',
        },
        dependencies: {
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          'react-scripts': 'latest',
        },
      },
      null,
      2
    ),
  },
};

export const templateVExperimental = {
  ...template,
  '/package.json': {
    hidden: true,
    code: JSON.stringify(
      {
        name: 'reactacademy.live',
        version: '0.0.0',
        main: '/src/index.js',
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test --env=jsdom',
          eject: 'react-scripts eject',
        },
        dependencies: {
          react: 'experimental',
          'react-dom': 'experimental',
          'react-scripts': 'latest',
        },
      },
      null,
      2
    ),
  },
};

export const templateHtml = {
  ...template,
  '/src/index.js': {
    hidden: true,
    code: `
import "./styles.css";
import "./App.js";
`,
  },
  '/src/display.js': {
    hidden: true,
    code: `
const pre = document.createElement('pre');
root.appendChild(pre);
pre.setAttribute('style', 'font-size: 1.2em');

export default function display(txt) {
  const txtNode = document.createTextNode(txt + '\\n');
  pre.appendChild(txtNode);
}

export function displayJson(obj, indent) {
  const txtNode = document.createTextNode(JSON.stringify(obj, null, indent) + '\\n');
  pre.appendChild(txtNode);
}

`,
  },
};
