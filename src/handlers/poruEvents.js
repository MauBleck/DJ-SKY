module.exports = (client) => {
  client.poru.on('nodeConnect', node => {
    console.log(`🟢 Conectado ao node: ${node.name}`);
  });

  client.poru.on('nodeError', (node, error) => {
    console.error(`❌ Erro no node ${node.name}:`, error);
  });

  client.poru.on('trackStart', (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) channel.send(`🎶 Tocando agora: **${track.info.title}**`);
  });

  // Outros eventos que quiser adicionar...
};
