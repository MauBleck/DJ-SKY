import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fg from 'fast-glob';

config();

const commands = [];

const commandFiles = await fg('./src/commands/*.js');

for (const file of commandFiles) {
  const command = await import(file);
  if ('data' in command.default && 'execute' in command.default) {
    commands.push(command.default.data.toJSON());
  } else {
    console.warn(`[AVISO] O comando em ${file} está faltando "data" ou "execute".`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`📤 Iniciando deploy de ${commands.length} comandos (/)...`);

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
})();
