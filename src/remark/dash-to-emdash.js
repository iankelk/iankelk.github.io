import visit from 'unist-util-visit';

const dashToEmdash = () => {
  const transformer = (ast) => {
    visit(ast, 'text', (node) => {
      if (node.value) {
        node.value = node.value.replace(/--/g, '—');
      }
    });
  };
  return transformer;
};

export default dashToEmdash;
