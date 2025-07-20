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
    .setName('skip')
    .setDescription('Pula a música atual'),
  run: async (client, interaction) => {
    const member = interaction.member;
    const guildId = interaction.guildId;
    const player = client.poru.players.get(guildId);

    if (!player) return interaction.reply({ content: 'Não estou tocando nada neste servidor.', ephemeral: true });

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      player.skip();
      return interaction.reply({ content: '⏭️ Música pulada!', ephemeral: true });
    }

    const votesCount = handleVote('skip', guildId, interaction.user.id);
    const requiredVotes = 3;

    if (votesCount >= requiredVotes) {
      player.skip();
      votes.delete(`skip-${guildId}`);
      return interaction.reply('⏭️ Votos suficientes! Música pulada.');
    }

    return interaction.reply(`🗳️ Voto registrado para pular! (${votesCount}/${requiredVotes} votos)`);
  }
};
