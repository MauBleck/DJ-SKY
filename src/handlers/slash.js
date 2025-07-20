// src/handlers/slash.js
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

module.exports = async (client) => {
  const commands = [];
  const slashPath = path.join(__dirname, '..', 'slash'); // pasta correta
  const slashFiles = fs.readdirSync(slashPath).filter(file => file.endsWith('.js'));

  for (const file of slashFiles) {
    const filePath = path.join(slashPath, file);
    const command = require(filePath);

    // só registra arquivos que exportam data.toJSON()
    if (!command.data || typeof command.data.toJSON !== 'function') {
      console.warn(`⚠️ Ignorando ${file} pois não tem data.toJSON()`);
      continue;
    }

    client.slash.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }

  // Deploy de comandos de guilda
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands },
  );
  console.log(`✅ Registrados ${commands.length} comandos de slash.`);
};
