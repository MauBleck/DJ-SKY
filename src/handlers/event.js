module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.slash.get(interaction.commandName); // CORREÇÃO AQUI
    if (!cmd) return;

    try {
      await cmd.run(client, interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({ content: '❌ Ocorreu um erro ao executar o comando!', ephemeral: true });
    }
  });

  // Eventos do Poru
  client.poru.on('nodeConnect', node => {
    console.log(`✅ Node conectado: ${node.name}`);
  });

  client.poru.on('nodeError', (node, error) => {
    console.error(`❌ Erro no node ${node.name}:`, error);
  });

  client.poru.on('trackStart', (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) {
      channel.send(`🎵 Tocando agora: **${track.info.title}**`);
    }
  });

  client.poru.on('queueEnd', (player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) {
      channel.send('📛 Fim da fila!');
    }
    player.disconnect();
  });
};
