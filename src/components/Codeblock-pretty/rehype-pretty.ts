'use strict';

import { Root } from 'hast';
import rehypePrettyCode from 'rehype-pretty-code';
import { visit } from 'unist-util-visit';

// to highlight code samples
export default function rehypePretty(options = {}) {
  const rh: any = rehypePrettyCode(options);

  return async (tree: Root) => {
    visit(tree, 'element', hideSandpackCode);
    await rh(tree);
    visit(tree, 'element', restoreSandpackCode);
  };

  function hideSandpackCode(node: any, _idx: any, parent: any) {
    if (
      (parent?.name == 'Sandpack' ||
        parent?.name == 'SandpackWithHTMLOutput') &&
      node.tagName == 'pre'
    ) {
      node.properties.parent = 'Sandpack';
      node.tagName = 'preHidden';
    }

    if (parent?.tagName == 'preHidden' && node.tagName == 'code') {
      node.tagName = 'codeHidden';
    }

    if (parent.properties?.parent === 'Sandpack') {
      if (node.data?.meta) {
        node.properties.meta = node.data?.meta;
      }
    }
  }
  function restoreSandpackCode(node: any) {
    if (node.tagName == 'preHidden') {
      node.tagName = 'pre';
      return;
    }

    if (node.tagName == 'codeHidden') {
      node.tagName = 'code';
      return;
    }
  }
}
