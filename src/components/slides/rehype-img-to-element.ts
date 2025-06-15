import { visit } from 'unist-util-visit';

export function rehypeImgToElement() {
  return (tree: any) => {
    visit(tree, 'mdxJsxFlowElement', (node, index, parent) => {
      if (node.name === 'img') {
        // Convert attributes array to properties object
        const properties: Record<string, any> = {};
        for (const attr of node.attributes) {
          if (attr.type === 'mdxJsxAttribute') {
            properties[attr.name] = attr.value ?? true;
          }
        }

        // Create new element node
        const elementNode = {
          type: 'element',
          tagName: 'img',
          properties,
          children: [],
        };

        // Replace the node in the parent
        if (parent && typeof index === 'number') {
          parent.children[index] = elementNode;
        }
      }
    });
  };
}
