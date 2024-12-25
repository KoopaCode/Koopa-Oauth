const { EmbedBuilder } = require('discord.js');
const { colors, branding } = require('../../config/embedConfig');
const User = require('../../models/User');

module.exports = {
  name: 'list',
  description: 'List all verified users',
  type: 1, // SUB_COMMAND
  async execute(interaction, log) {
    try {
      const users = await User.find().sort('-verifiedAt').limit(10);
      
      if (!users?.length) {
        const noUsersEmbed = new EmbedBuilder()
          .setDescription('❌ No verified users found!')
          .setColor(colors.error);
        
        return interaction.reply({ 
          embeds: [noUsersEmbed], 
          ephemeral: true 
        });
      }

      const listEmbed = new EmbedBuilder()
        .setTitle(`${branding.serverName} Verified Users`)
        .setDescription(users.map(user => 
          `\`${user.username}${user.discriminator ? `#${user.discriminator}` : ''}\` • <t:${Math.floor(user.verifiedAt.getTime() / 1000)}:R>`
        ).join('\n'))
        .setColor(colors.primary)
        .setTimestamp()
        .setFooter({ 
          text: `Total Verified Users: ${users.length}`, 
          iconURL: branding.footerIcon 
        });
      
      await interaction.reply({ 
        embeds: [listEmbed], 
        ephemeral: true 
      });
    } catch (error) {
      log.error('Failed to fetch verified users:', error);
      const errorEmbed = new EmbedBuilder()
        .setDescription('❌ Failed to fetch verified users!')
        .setColor(colors.error);
      
      await interaction.reply({ 
        embeds: [errorEmbed], 
        ephemeral: true 
      });
    }
  }
}; 