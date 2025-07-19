require('dotenv').config();

const { REST }   = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs         = require('fs');
const path       = require('path');

module.exports = async (client) => {
  const commands = [];
  const slashPath = path.join(__dirname, '../slash');
  for (const file of fs.readdirSync(slashPath).filter(f => f.endsWith('.js'))) {
    const cmd = require(path.join(slashPath, file));
    commands.push(cmd.data.toJSON());
    client.slash.set(cmd.data.name, cmd);
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    console.log(`✅ Slash commands registrados: ${commands.length}`);
  } catch (error) {
    console.error('❌ Erro ao registrar slash commands:', error);
  }
};
