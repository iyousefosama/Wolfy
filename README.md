# Wolfy Discord Bot

Wolfy is a full-featured Discord bot designed to enhance your server with moderation, fun, utility, and management features. Created with ❤️ by WOLF.

## 🌟 Features

### 🛡️ Moderation
- Ban/Kick/Timeout members
- Message management (clear, purge)
- Channel management (lock, unlock, nuke)
- Warning system with infraction points
- Anti-link and bad words protection
- Role management

### 🎮 Fun
- 8ball for fortune telling
- Meme generator
- Rock Paper Scissors
- Fast typer game
- Number guessing game
- Jokes and more!

### 📊 Level System
- XP tracking
- Level roles
- Leaderboard
- Custom level messages

### 🎫 Ticket System
- Create and manage support tickets
- Custom ticket categories
- Ticket management commands

### 🔍 Information
- User info
- Server stats
- Role information
- Bot statistics
- Weather information
- Steam game search

### 🛠️ Utility
- Reminders
- Code sharing (SourceBin)
- Translation
- Custom welcome/leave messages
- Logging system

## 🚀 Getting Started

### Prerequisites
- Node.js v16.9.0 or higher
- MongoDB database
- Discord Bot Token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wolfy.git
cd wolfy
```

2. Install dependencies:
```bash
npm install
```

3. Configure the bot:
   - Copy `.example.env` to `.env`
   - Fill in your bot token and other required values
   - Update `config.js` with your preferences

4. Build the command database:
```bash
npm run build
```

5. Start the bot:
```bash
npm start
```

### Required Bot Permissions
- Send Messages
- View Channels
- Read Message History
- Use External Emojis
- Embed Links
- Add Reactions
- Manage Messages
- Manage Channels
- Manage Roles
- Ban Members
- Kick Members

## 📁 Project Structure

```
wolfy/
├── commands/           # Text commands
├── slashCommands/      # Slash commands
├── events/            # Event handlers
├── components/        # Button and menu handlers
├── util/             # Utility functions
├── assets/           # Static assets
├── schema/           # Database schemas
└── config.js         # Bot configuration
```

## 🛠️ Development

### Building Commands
To update the command database after adding new commands:
```bash
npm run build
```

### Adding New Commands
1. Create a new file in `commands/` or `slashCommands/`
2. Follow the command template structure
3. Add required permissions
4. Run the build command

## 📝 Command Categories

### Moderation
- `ban` - Ban a member
- `kick` - Kick a member
- `timeout` - Timeout a member
- `clear` - Clear messages
- `lock` - Lock a channel
- `unlock` - Unlock a channel
- And more...

### Fun
- `8ball` - Ask the magic 8ball
- `meme` - Get random memes
- `rps` - Play rock paper scissors
- `joke` - Get random jokes
- And more...

### Information
- `user` - Get user information
- `server` - Get server information
- `weather` - Get weather information
- `steam` - Search Steam games
- And more...

### Utility
- `remind` - Set reminders
- `bin` - Share code snippets
- `translate` - Translate text
- And more...

## 🔒 Security

- Bot tokens and sensitive data are stored in environment variables
- Database connections are secured
- Permission checks are implemented for all commands
- Rate limiting and cooldowns are in place

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Contact

- Discord: `yousefosama1`
- GitHub: [iyousefosama](https://github.com/iyousefosama)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

```Hope Wolfy bot brings a big smile to your face! ^_^```
