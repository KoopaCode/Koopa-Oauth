const { EmbedBuilder } = require('discord.js');
const { colors, branding } = require('../../config/embedConfig');

module.exports = {
  name: 'role',
  description: 'Set the verification role',
  type: 1, // SUB_COMMAND
  options: [
    {
      name: 'role',
      type: 8, // ROLE
      description: 'Role to give verified users',
      required: true
    }
  ],
  async execute(interaction, log) {
    const role = interaction.options.getRole('role');
    
    // Add role handling logic here
    
    const successEmbed = new EmbedBuilder()
      .setTitle('Role Updated')
      .setDescription(`✅ Verification role has been set to ${role}`)
      .setColor(colors.success)
      .setTimestamp()
      .setFooter({ 
        text: branding.serverName, 
        iconURL: branding.footerIcon 
      });
    
    await interaction.reply({ 
      embeds: [successEmbed], 
      ephemeral: true 
    });
  }
}; 