const { EmbedBuilder } = require('discord.js');
const { colors, branding } = require('../../config/embedConfig');
const User = require('../../models/User');

module.exports = {
  name: 'join',
  description: 'Add verified users to a guild',
  type: 1, // SUB_COMMAND
  options: [
    {
      name: 'guild',
      type: 3, // STRING
      description: 'Guild ID to add users to',
      required: true
    }
  ],
  async execute(interaction, log) {
    const guildId = interaction.options.getString('guild');
    
    try {
      const users = await User.find();
      const guild = await interaction.client.guilds.fetch(guildId);
      
      let successCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          await guild.members.add(user.discordId, {
            accessToken: user.accessToken,
            nick: user.username
          });
          successCount++;
        } catch (err) {
          log.error(`Failed to add user ${user.username}:`, err);
          errorCount++;
        }
      }

      const resultEmbed = new EmbedBuilder()
        .setTitle('Guild Join Results')
        .setDescription(`✅ Successfully added ${successCount} users\n❌ Failed to add ${errorCount} users`)
        .setColor(successCount > errorCount ? colors.success : colors.warning)
        .setTimestamp()
        .setFooter({ 
          text: branding.serverName, 
          iconURL: branding.footerIcon 
        });

      await interaction.reply({ 
        embeds: [resultEmbed], 
        ephemeral: true 
      });
    } catch (error) {
      log.error('Failed to process guild join:', error);
      const errorEmbed = new EmbedBuilder()
        .setDescription('❌ Failed to add users to the guild!')
        .setColor(colors.error);
      
      await interaction.reply({ 
        embeds: [errorEmbed], 
        ephemeral: true 
      });
    }
  }
}; 