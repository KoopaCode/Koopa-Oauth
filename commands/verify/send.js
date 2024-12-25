const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { colors, branding } = require('../../config/embedConfig');

module.exports = {
  name: 'send',
  description: 'Send the verification embed to a channel',
  type: 1, // SUB_COMMAND
  options: [
    {
      name: 'channel',
      type: 7, // CHANNEL
      description: 'Channel to send verification embed',
      required: true,
      channel_types: [0] // TEXT channels only
    }
  ],
  async execute(interaction, log) {
    const channel = interaction.options.getChannel('channel');
    
    const embed = new EmbedBuilder()
      .setTitle(`${branding.serverName} Verification`)
      .setDescription('Please verify your account to access our server!')
      .setColor(colors.primary)
      .addFields([
        {
          name: '🔒 Secure Verification',
          value: 'Click the button below to verify through Discord OAuth2'
        },
        {
          name: '⚠️ Important Notice',
          value: 'By verifying, you grant server administrators permission to:\n• View your Discord profile\n• Add you to server channels\n• Assign roles based on verification'
        }
      ])
      .setTimestamp()
      .setFooter({ 
        text: `${branding.serverName} • Secure Verification System`, 
        iconURL: branding.footerIcon 
      });
    
    const button = new ButtonBuilder()
      .setLabel('Verify Account')
      .setStyle(ButtonStyle.Link)
      .setURL(`http://localhost:3000/auth/discord`)
      .setEmoji('🔐');
    
    const row = new ActionRowBuilder().addComponents(button);
    
    await channel.send({ 
      embeds: [embed], 
      components: [row] 
    });

    log.success(`Verification embed sent to #${channel.name}`);
    
    const successEmbed = new EmbedBuilder()
      .setDescription('✅ Verification embed has been sent successfully!')
      .setColor(colors.success);
    
    await interaction.reply({ 
      embeds: [successEmbed], 
      ephemeral: true 
    });
  }
}; 