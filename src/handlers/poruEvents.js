module.exports = (client) => {

  client.poru.on('nodeError', (node, error) => {
    console.error(`❌ Erro no node ${node.name}:`, error);
  });


  // Outros eventos que quiser adicionar...
};
