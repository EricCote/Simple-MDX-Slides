/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import type { SandpackFile } from '@codesandbox/sandpack-react/unstyled';

export const AppJSPath = `/src/App.js`;
export const StylesCSSPath = `/src/styles.css`;

export const createFileMap = (codeSnippets: any) => {
  const myres = codeSnippets.reduce(
    (result: Record<string, SandpackFile>, codeSnippet: React.ReactElement) => {
      if (codeSnippet.type !== 'pre') {
        return result;
      }

      const { props } = codeSnippet.props.children;
      let filePath; // path in the folder structure
      let fileHidden = false; // if the file is available as a tab
      let fileActive = false; // if the file tab is shown by default

      if (props.meta) {
        const [name, ...params] = props.meta.split(' ');
        filePath = '/' + name;
        if (params.includes('hidden')) {
          fileHidden = true;
        }
        if (params.includes('active')) {
          fileActive = true;
        }
      } else {
        if (props.className === 'language-js') {
          filePath = AppJSPath;
        } else if (props.className === 'language-css') {
          filePath = StylesCSSPath;
        } else {
          throw new Error(
            `Code block is missing a filename: ${props.children}`
          );
        }
      }
      if (result[filePath]) {
        throw new Error(
          `File ${filePath} was defined multiple times. Each file snippet should have a unique path name`
        );
      }
      result[filePath] = {
        code: (props.children || '') as string,
        hidden: fileHidden,
        active: fileActive,
      };

      return result;
    },
    {}
  );
  return myres;
};

// function myReduce(items: any) {
//   if (typeof items === 'string') {
//     return items;
//   }

//   if (items?.props?.children) {
//     return myReduce(items.props.children);
//   }

//   if (items.reduce)
//     return items.reduce((res: string, item: any) => {
//       if (typeof item === 'string') {
//         return res + item;
//       }
//       if (typeof item === 'object') {
//         return res + myReduce(item.props.children);
//       }

//       return res;
//     }, '');
// }
