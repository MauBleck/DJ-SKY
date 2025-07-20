module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.slash.get(interaction.commandName); // CORREÇÃO AQUI
    if (!cmd) return;

    try {
      await cmd.run(client, interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({ content: '❌ Ocorreu um erro ao executar o comando!', flags: 64 });
    }
  });


  client.poru.on('nodeError', (node, error) => {
    console.error(`❌ Erro no node ${node.name}:`, error);
  });

  client.poru.on('queueEnd', (player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) {
      channel.send('📛 Fim da fila!');
    }
    player.disconnect();
  });
};
