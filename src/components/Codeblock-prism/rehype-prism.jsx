'use strict';

import { visit } from 'unist-util-visit';
//import { toString as nodeToString } from 'hast-util-to-string';
import { refractor } from 'refractor';
import jsx from 'refractor/lang/jsx';
import razor from 'refractor/lang/cshtml';
import rangeParser from 'parse-numeric-range';
import addMarkers from './addMarkers';

refractor.register(jsx);
refractor.register(razor);

// will colorize code samples
export default function rehypePrism(options) {
  options = options || {};

  if (options.alias) {
    refractor.alias(options.alias);
  }

  return (tree) => {
    visit(tree, 'element', visitor);
  };

  function visitor(node, index, parent) {
    if (parent && parent.name == 'Sandpack' && node.tagName == 'pre') {
      node.properties.parent = 'Sandpack';
      return;
    }

    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    if (parent.properties?.parent === 'Sandpack') {
      if (node.data?.meta) {
        node.properties.meta = node.data?.meta;
      }
      return;
    }

    const lang = getLanguage(node);

    if (lang === null) {
      return;
    }

    let result;
    try {
      parent.properties.className = (parent.properties.className || []).concat(
        'language-' + lang
      );
      result = refractor.highlight(node.children[0].value, lang);
    } catch (err) {
      if (options.ignoreMissing && /Unknown language/.test(err.message)) {
        return;
      }
      throw err;
    }

    const contentsInCurly = /{(.*)}/g;
    let r1 = undefined;

    const markers = contentsInCurly.exec(node.data?.meta)?.[1];
    if (markers) {
      r1 = addMarkers(result, { markers: rangeParser(markers) });
    }

    node.children = r1 ?? [result];
  }
}

//returns the programming language of a code fragment (js, jsx, css, etc)
function getLanguage(node) {
  const className = node.properties.className || [];

  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === 'language-') {
      return classListItem.slice(9).toLowerCase();
    }
  }

  return null;
}
