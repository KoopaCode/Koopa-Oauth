# 🔐 Koopa's Discord Verification System

A robust Discord verification system that uses OAuth2 to verify users through a web interface before granting them access to your server.

## ✨ Features

- 🌐 Clean web interface for verification
- 🔒 Secure OAuth2 authentication through Discord
- 💾 MongoDB integration for user data storage
- 🤖 Discord bot for role management
- ⚡ Express.js backend
- 🎨 Customizable branding and colors
- 📊 Verification tracking and statistics
- 👑 Admin commands for role management

## 🛠️ Setup Guide

### Prerequisites
- Node.js v16.9.0 or higher
- MongoDB installed and running
- A Discord application with bot user
- Discord Developer Portal access

### Step 1: Discord Application Setup
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Copy the bot token and save it for later
5. Under "OAuth2" settings:
   - Add your redirect URL (e.g. `http://localhost:3000/auth/discord/callback`)
   - Copy the Client ID and Client Secret
   - Enable the following scopes:
     - `identify`
     - `guilds`
     - `guilds.join`

### Step 2: Project Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/koopas-verification.git
   cd koopas-verification
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

### Step 3: Configuration
1. Edit the `.env` file with your settings:
   ```env
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_CLIENT_SECRET=your_client_secret_here
   DISCORD_BOT_TOKEN=your_bot_token_here
   ADMIN_ROLE_ID=your_admin_role_id_here
   SERVER_NAME="Your Server Name"
   MONGODB_URI=mongodb://127.0.0.1:27017/verification
   CALLBACK_URL=http://localhost:3000/auth/discord/callback
   SESSION_SECRET=your_random_secret_here
   PORT=3000
   ```

2. Customize branding in `config/embedConfig.js`:
   - Set your server colors
   - Update footer icons
   - Modify embed styling

### Step 4: Bot Setup
1. Invite the bot to your server using the OAuth2 URL generator:
   - Required permissions:
     - Manage Roles
     - View Channels
     - Send Messages
     - Embed Links
2. Ensure the bot role is higher than the verification role in your server's role hierarchy

### Step 5: Database Setup
1. Start MongoDB if not running:
   ```bash
   mongod
   ```
2. The application will automatically create required collections

### Step 6: Running the System
1. Start in development mode:
   ```bash
   npm run dev
   ```
2. Or production mode:
   ```bash
   npm start
   ```
3. Access the verification page at `http://localhost:3000`

### Step 7: Discord Commands
Available slash commands:
- `/verify role` - Set the verification role (Admin only)
- `/verify list` - View recently verified users (Admin only)
- `/verify send (channel)` - Send Verification Embed to a channel (Admin only)
- `/verify join (guildID)` - Make everyone join the guild (Admin only)

### Troubleshooting
- Ensure all environment variables are correctly set
- Check MongoDB connection is active
- Verify bot has proper permissions in Discord server
- Confirm OAuth2 redirect URIs match your configuration
- Review logs for any error messages

### Security Notes
- Keep your `.env` file secure and never commit it
- Regularly rotate your `SESSION_SECRET`
- Use HTTPS in production
- Regularly update dependencies
- Monitor verification logs for suspicious activity
