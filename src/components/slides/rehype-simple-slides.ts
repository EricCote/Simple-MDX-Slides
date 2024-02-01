// Inspired by https://github.com/marko-knoebl/rehype-slides
// this version is different.
// These slides only go right-left, there are no special "drill-down" slides that go down-up
// I added a slideType, so one could wrap a slide using <div>, <section>, <article>, <figure> or whatever

import { Node, Element, Literal, Root } from 'hast';

interface Options {
  slideSeparators: string[];
  slideType: string;
  slideClass: string;
}

export type NodeWithChildren = Node & { children: Node[] };

function elementsToSimpleSlides(rootNode: Root, options: Options) {
  //if no content, do nothing
  if (rootNode.children.length === 0) {
    return rootNode;
  }

  const { slideSeparators, slideType, slideClass } = options;
  const slides: Element[] = [];

  //is the first child a separator?
  if (
    !options.slideSeparators.includes(
      (rootNode.children[0] as Element)?.tagName
    )
  ) {
    let firstSlide = '';
    if (rootNode.children.filter((elem) => (elem as Element).tagName === 'h1'))
      firstSlide = 'first-slide';
    // if not, lets add the initial slide
    slides.push({
      type: 'element',
      tagName: slideType,
      properties: { className: `${slideClass ?? ''} ${firstSlide}` },
      children: [],
    });
  }

  //Let's keep here the list of nested mdx components that are imported,
  let mdxImports: string[] = [];

  //Let's go through each child of our root
  for (let node of rootNode.children as Element[]) {
    //if this is a separator, let's add a slide
    if (slideSeparators.includes(node?.tagName)) {
      slides.push({
        type: 'element',
        tagName: slideType,
        properties: {
          className: slideClass,
        },
        children: [],
      });
      // if the separating node has some content (e.g. h1)
      // put the separating node content in the next slide
      if (node.children.length !== 0) {
        slides[slides.length - 1].children.push(node);
      }
    } else {
      //if this isn't a separator, let's add this content to the slide children.
      //But first, let's detect if this is an mdx import with more slides
      if (node.type.toString().includes('mdxjsEsm')) {
        const rg = new RegExp(/import (?<name>.*) from .*\.mdx/);
        const result = rg.exec((node as unknown as Literal).value);
        if (result?.groups) {
          mdxImports.push(result.groups.name);
        }
      }
      //let's compare the node name with the mdx imports
      //if its the case, then lets add those slides to the top level.
      if (mdxImports.includes((node as any).name)) {
        let temp = slides[slides.length - 1].children;
        slides.pop();
        temp.forEach((child) => {
          node.children.push(child);
        });
        slides.push(node);
      }
      //Add the node as content to the current slide
      else {
        slides[slides.length - 1].children.push(node);
      }
    }
  }
  return { type: 'root', children: slides } as Node;
}

const defaultOptions = {
  slideSeparators: ['hr'],
  slideType: 'div',
  slideClass: 'slide',
};

export default function generateSlides(rootNode: Root, options: Options) {
  options = { ...defaultOptions, ...options };
  return elementsToSimpleSlides(rootNode, options);
}

export function rehypeSimpleSlides(options: Options) {
  return (rootNode: Root, file: any /* vfile */) => {
    return generateSlides(rootNode, options);
  };
}
