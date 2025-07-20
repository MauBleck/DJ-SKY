// src/slash/help.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comandos')
    .setDescription('Mostra a lista de todos os comandos disponíveis'),

  run: async (client, interaction) => {
    // No seu index.js você fez: client.slash = new Collection();
    const commands = client.slash;

    if (!commands || commands.size === 0) {
      return interaction.reply({ content: '❌ Nenhum comando encontrado.', ephemeral: true });
    }

    // Monta uma linha para cada comando: "/nome — descrição"
    const list = commands.map(cmd => 
      `**/${cmd.data.name}** — ${cmd.data.description}`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('📜 Lista de Comandos')
      .setDescription(list)
      .setColor('Blue');

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
