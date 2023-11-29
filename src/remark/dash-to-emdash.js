import { visit } from 'unist-util-visit';

const dashToEmdash = (options) => {
  const transformer = (ast) => {
    visit(ast, 'text', (node) => {
      if (node.value && node.value.includes('--')) {
        console.log('Before:', node.value);
        node.value = node.value.replace(/--/g, '—');
        console.log('After:', node.value);
      }
    });
  };
  return transformer;
};

export default dashToEmdash;
