import { visit } from 'unist-util-visit';

const dashToEmdash = (options) => {
  console.log('dashToEmdash plugin loaded');
  const transformer = (ast) => {
    // console.log(JSON.stringify(ast, null, 2));
    visit(ast, 'text', (node) => {
      if (node.value && node.value.includes('--')) {
        // console.log('Before:', node.value);
        node.value = node.value.replace(/--/g, '—');
        // console.log('After:', node.value);
      }
    });
  };
  return transformer;
};

export default dashToEmdash;
