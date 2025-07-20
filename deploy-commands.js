require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const rest = new REST().setToken(DISCORD_TOKEN);

async function clearGuildCommands() {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: [] },
  );
  console.log('🧹 Comandos de guilda apagados');
}

async function clearGlobalCommands() {
  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: [] },
  );
  console.log('🧹 Comandos globais apagados');
}

async function deployGuildCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, 'src', 'slash');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
  }

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands },
  );
  console.log('✅ Comandos de guilda atualizados');
}

(async () => {
  try {
    await clearGlobalCommands();  // Limpa comandos globais (importante para evitar duplicidade)
    await clearGuildCommands();   // Limpa comandos de guilda
    await deployGuildCommands();  // Sobe comandos atualizados só para guilda
  } catch (error) {
    console.error(error);
  }
})();
