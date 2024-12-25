const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
require('dotenv').config();

// Logger setup
const log = {
  info: (msg) => console.log(chalk.blue('ℹ ') + chalk.white(msg)),
  success: (msg) => console.log(chalk.green('✓ ') + chalk.white(msg)),
  error: (msg, err) => console.error(chalk.red('✖ ') + chalk.white(msg), err || '')
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// Load commands
function loadCommands() {
  const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
  
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder))
      .filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      client.commands.set(command.name, command);
    }
  }
}

// Register slash commands
async function registerCommands() {
  try {
    const commands = [
      {
        name: 'verify',
        description: 'Verification system commands',
        options: Array.from(client.commands.values()).map(cmd => ({
          name: cmd.name,
          type: 1, // SUB_COMMAND
          description: cmd.description,
          options: cmd.options || []
        }))
      }
    ];

    await client.application.commands.set(commands);
    log.success('Slash commands registered');
  } catch (error) {
    log.error('Failed to register commands:', error);
  }
}

client.once('ready', () => {
  log.success(`Bot logged in as ${client.user.tag}`);
  loadCommands();
  registerCommands();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options, member } = interaction;

  if (!member.roles.cache.has(process.env.ADMIN_ROLE_ID)) {
    return interaction.reply({ 
      content: '❌ You do not have permission to use this command!', 
      ephemeral: true 
    });
  }

  if (commandName === 'verify') {
    const subcommand = options.getSubcommand();
    const command = client.commands.get(subcommand);

    if (!command) return;

    try {
      await command.execute(interaction, log);
    } catch (error) {
      log.error(`Command error (${subcommand}):`, error);
      await interaction.reply({ 
        content: '❌ An error occurred while executing the command!', 
        ephemeral: true 
      });
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = client; 