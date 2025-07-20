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
    .setName('pause')
    .setDescription('Pausa ou retoma a música'),
  run: async (client, interaction) => {
    const member = interaction.member;
    const guildId = interaction.guildId;
    const player = client.poru.players.get(guildId);

    if (!player) return interaction.reply({ content: 'Não estou tocando nada neste servidor.', ephemeral: true });

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      if (player.isPaused) {
        player.pause(false);
        return interaction.reply({ content: '▶️ Música retomada!', ephemeral: true });
      } else {
        player.pause(true);
        return interaction.reply({ content: '⏸️ Música pausada!', ephemeral: true });
      }
    }

    const votesCount = handleVote('pause', guildId, interaction.user.id);
    const requiredVotes = 3;

    if (votesCount >= requiredVotes) {
      if (player.isPaused) {
        player.pause(false);
        votes.delete(`pause-${guildId}`);
        return interaction.reply('▶️ Votos suficientes! Música retomada.');
      } else {
        player.pause(true);
        votes.delete(`pause-${guildId}`);
        return interaction.reply('⏸️ Votos suficientes! Música pausada.');
      }
    }

    return interaction.reply(`🗳️ Voto registrado para pausar/retomar! (${votesCount}/${requiredVotes} votos)`);
  }
};
