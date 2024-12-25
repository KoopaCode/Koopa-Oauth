const website = require('./website');
const bot = require('./bot');
const chalk = require('chalk');

// Logger setup
const log = {
  info: (msg) => console.log(chalk.blue('ℹ ') + chalk.white(msg)),
  success: (msg) => console.log(chalk.green('✓ ') + chalk.white(msg))
};

// Start the website
const PORT = process.env.PORT || 3000;
website.listen(PORT, () => {
  log.success(`Website running on port ${PORT}`);
});

// Bot is started automatically when required
log.info('Starting verification system...'); 