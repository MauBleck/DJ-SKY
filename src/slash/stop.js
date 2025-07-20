const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const votes = new Map();

function handleVote(command, guildId, userId) {
  const voteKey = `${command}-${guildId}`;
  if (!votes.has(voteKey)) votes.set(voteKey, new Set());
  const voters = votes.get(voteKey);
  voters.add(userId);
  return voters.size;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Para a música e limpa a fila'),
  run: async (client, interaction) => {
    const member = interaction.member;
    const guildId = interaction.guildId;
    const player = client.poru.players.get(guildId);

    if (!player) return interaction.reply({ content: 'Não estou tocando nada neste servidor.', ephemeral: true });

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      player.destroy();
      return interaction.reply({ content: '⏹️ Música parada e fila limpa!', ephemeral: true });
    }

    const votesCount = handleVote('stop', guildId, interaction.user.id);
    const requiredVotes = 3;

    if (votesCount >= requiredVotes) {
      player.destroy();
      votes.delete(`stop-${guildId}`);
      return interaction.reply('⏹️ Votos suficientes! Música parada e fila limpa.');
    }

    return interaction.reply(`🗳️ Voto registrado para parar! (${votesCount}/${requiredVotes} votos)`);
  }
};
