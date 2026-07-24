const discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const text = require('../../util/string');
const { colors } = require('../../util/constants/constants');

module.exports = {
  data: {
    name: "help",
    description: "Shows all available commands",
    dmOnly: false,
    guildOnly: false,
    cooldown: 5,
    group: "Bot",
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    clientPermissions: ["EmbedLinks"],
    permissions: [],
    options: [
      {
        type: 3, // STRING
        name: 'type',
        description: 'Type of commands to show',
        required: false,
        choices: [
          { name: 'all', value: 'all' },
          { name: 'info', value: 'info' },
          { name: 'search', value: 'search' },
          { name: 'util', value: 'util' },
          { name: 'mod', value: 'mod' },
          { name: 'fun', value: 'fun' },
          { name: 'setup', value: 'setup' },
          { name: 'bot', value: 'bot' },
          { name: 'level', value: 'level' },
          { name: 'eco', value: 'eco' }
        ]
      }
    ]
  },
  async execute(client, interaction) {
    const { options, user } = interaction;
    const type = options.getString('type');

    // Define button data
    const buttonData = [
      { label: 'Info', customId: '1', style: 'Primary', emoji: 'ℹ️' },
      { label: 'Search', customId: '2', style: 'Primary', emoji: '🔍' },
      { label: 'Utilities', customId: '3', style: 'Primary', emoji: '🛠️' },
      { label: 'Moderator', customId: '4', style: 'Danger', emoji: '🛡️' },
      { label: 'Fun', customId: '5', style: 'Success', emoji: '🎮' },
      { label: 'Setup', customId: '6', style: 'Primary', emoji: '⚙️' },
      { label: 'Bot', customId: '7', style: 'Primary', emoji: '🤖' },
      { label: 'Levels', customId: '8', style: 'Primary', emoji: '⬆️' },
      { label: 'Economy', customId: '9', style: 'Primary', emoji: '💰' },
    ];

    // Create buttons
    const buttons = buttonData.map(data => (
      new ButtonBuilder()
        .setLabel(data.label)
        .setCustomId(data.customId)
        .setStyle(data.style)
        .setEmoji(data.emoji)
    ));

    // Create action rows
    const rows = [
      new ActionRowBuilder().addComponents(...buttons.slice(0, 5)),
      new ActionRowBuilder().addComponents(...buttons.slice(5)),
    ];

    // Add invite button
    const linkButton = new ButtonBuilder()
      .setStyle('Link')
      .setEmoji('➕')
      .setURL(client.config.websites["invite"])
      .setLabel('Add me');
    rows[1].addComponents(linkButton);

    // Common embed settings
    const commonEmbedSettings = {
      color: colors.BOT,
      url: client.config.websites["website"],
      author: {
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      },
      thumbnail: {
        url: client.user.displayAvatarURL(),
      },
      footer: {
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      },
      timestamp: new Date(),
    };

    // Function to create command list embeds
    function createCommandListEmbed(title, fields, desc) {
      const embed = new EmbedBuilder()
        .setColor(commonEmbedSettings.color)
        .setDescription(desc ?? null)
        .setURL(commonEmbedSettings.url)
        .setAuthor(commonEmbedSettings.author)
        .setThumbnail(commonEmbedSettings.thumbnail.url)
        .setFooter(commonEmbedSettings.footer)
        .setTimestamp()
        .setTitle(title);

      fields.forEach(field => {
        embed.addFields({ name: field.name, value: `\`\`\`${field.value}\`\`\``, inline: field.inline });
      });

      return embed;
    }

    // Create all embeds
    const help = createCommandListEmbed(
      `Hi ${interaction.user.username}, how can I help you?`,
      [
        { name: "ℹ️ Information Commands", value: `${client.config.prefix}help info`, inline: true },
        { name: "🔍 Search Commands", value: `${client.config.prefix}help search`, inline: true },
        { name: "🛠️ Utility Commands", value: `${client.config.prefix}help Util`, inline: true },
        { name: "🛡️ Moderator Commands", value: `${client.config.prefix}help mod`, inline: true },
        { name: "🎮 Fun Commands", value: `${client.config.prefix}help fun`, inline: true },
        { name: "⚙️ Setup Commands", value: `${client.config.prefix}help setup`, inline: true },
        { name: "🤖 Bot Commands", value: `${client.config.prefix}help bot`, inline: true },
        { name: "⬆️ Level Commands", value: `${client.config.prefix}help level`, inline: true },
        { name: "💰 Economy Commands", value: `${client.config.prefix}help eco`, inline: true }
      ],
      [
        "✨ Type `/feedback` to report a bug",
        "For a full list of commands use: `/help type: all`"
      ].join("\n")
    );

    const info = createCommandListEmbed("ℹ️ Information Commands", [
      { name: `${client.config.prefix}server`, value: "Shows information about a server" },
      { name: `${client.config.prefix}user`, value: "Shows information about a user" },
      { name: `${client.config.prefix}mcuser`, value: "To get Minecraft user information" },
      { name: `${client.config.prefix}avatar`, value: "Get a user's avatar" },
      { name: `${client.config.prefix}savatar`, value: "Get a user's server avatar" }
    ]);

    const search = createCommandListEmbed("🔍 Search Commands", [
      { name: `${client.config.prefix}steam`, value: "To search for any game information in Steam" },
      { name: `${client.config.prefix}weather`, value: "Shows the weather status in any country" },
      { name: `${client.config.prefix}lyrics`, value: "The bot will show you the lyrics for the music you are searching for" }
    ]);

    const Utl = createCommandListEmbed("🛠️ Utility Commands", [
      { name: `${client.config.prefix}suggestion`, value: "Send your suggestion for the server" },
      { name: `${client.config.prefix}remind`, value: "The bot will remind you for anything" },
      { name: `${client.config.prefix}report`, value: "Report a user to server moderators" },
      { name: `${client.config.prefix}bin`, value: "To upload a code to sourcebin" },
      { name: `${client.config.prefix}ticket`, value: "Open new ticket in the server" },
      { name: `${client.config.prefix}rename`, value: "Change ticket name" },
      { name: `${client.config.prefix}delete`, value: "Delete your ticket in the server" },
      { name: `${client.config.prefix}calc`, value: "Calculates an equation by wolfy" }
    ]);

    const moderator = createCommandListEmbed("🛡️ Moderator Commands", [
      { name: `${client.config.prefix}ban`, value: "Bans a member from the server" },
      { name: `${client.config.prefix}hackban`, value: "Bans a member not in the server" },
      { name: `${client.config.prefix}softban`, value: "Kicks a user and deletes all their messages in the past 7 days" },
      { name: `${client.config.prefix}unban`, value: "Unbans a member from the server" },
      { name: `${client.config.prefix}kick`, value: "Kick a member from the server" },
      { name: `${client.config.prefix}dm`, value: "DMs someone in the server with message" },
      { name: `${client.config.prefix}warn`, value: "Warn a user in the server" },
      { name: `${client.config.prefix}warnings`, value: "Display the mentioned user warns list and ids" },
      { name: `${client.config.prefix}removewarn`, value: "Remove a user warn from the warns list by the id" },
      { name: `${client.config.prefix}say`, value: "The bot will repeat what you say" },
      { name: `${client.config.prefix}embed`, value: "The bot will repeat what you say with embed" },
      { name: `${client.config.prefix}embedsetup`, value: "Display the setup embed message" },
      { name: `${client.config.prefix}respond`, value: "Respond to a user suggestion in the server" },
      { name: `${client.config.prefix}nick`, value: "Changes the nickname of a member" },
      { name: `${client.config.prefix}slowmo`, value: "Adding slowmotion chat to a channel" },
      { name: `${client.config.prefix}nuke`, value: "Nuke any channel (this will delete all the channel and create new one)" },
      { name: `${client.config.prefix}mute/unmute`, value: "Mute/Unmute someone from texting" },
      { name: `${client.config.prefix}timeout`, value: "Timeout the user for temporarily time to not chat or react or connect to voice channels" },
      { name: `${client.config.prefix}lock`, value: "Lock the permissions for @everyone from talking in the channel" },
      { name: `${client.config.prefix}unlock`, value: "Unlock the permissions for @everyone from talking in the channel" },
      { name: `${client.config.prefix}voicekick`, value: "Kick all users that are connected to the current channel" },
      { name: `${client.config.prefix}clear`, value: "Clear/Delete message with quantity you want (from 2 to 100)" },
      { name: `${client.config.prefix}purge`, value: "Clear messages of the user with quantity you want (from 2 to 100)" },
      { name: `${client.config.prefix}infraction`, value: "To enable/disable/Edit infraction point protection system" }
    ]);

    const Fun = createCommandListEmbed("🎮 Fun Commands", [
      { name: `${client.config.prefix}8ball`, value: "Ask the 8ball anything and it will answer" },
      { name: `${client.config.prefix}clyde`, value: "Send your message as Clyde text message" },
      { name: `${client.config.prefix}fast`, value: "Start playing fast typer game" },
      { name: `${client.config.prefix}meme`, value: "Gives random memes" },
      { name: `${client.config.prefix}rps`, value: "Playing rock/paper/scissors vs the bot" },
      { name: `${client.config.prefix}tweet`, value: "Send your message as tweet message" },
      { name: `${client.config.prefix}guess`, value: "Start playing new guess the number game" }
    ]);

    const setup = createCommandListEmbed("⚙️ Setup Commands", [
      { name: `${client.config.prefix}setLogsch`, value: "Setup the logs channel bot will send logs there" },
      { name: `${client.config.prefix}setReportch`, value: "Setup the report channel for user reports" },
      { name: `${client.config.prefix}setSuggch`, value: "Setup the suggestion channel for user suggestions" },
      { name: `${client.config.prefix}setwelcomech`, value: "Setup the welcome channel bot will send message when user join there" },
      { name: `${client.config.prefix}setleaverch`, value: "Setup the leaver channel bot will send message when user leave there" },
      { name: `${client.config.prefix}setTicketch`, value: "Setup the ticket category bot will create tickets channels from users there" },
      { name: `${client.config.prefix}setwelcomemsg`, value: "To set the welcome (msg/embed)" },
      { name: `${client.config.prefix}setleavermsg`, value: "To set the leaver (msg/embed)" },
      { name: `${client.config.prefix}smRole`, value: "Setup the select menu role list" },
      { name: `${client.config.prefix}badwords`, value: "Add/remove/show blacklisted words for the current guild" },
      { name: `${client.config.prefix}[cmd]toggle`, value: "To toggle a cmd <off/on> from setup cmds" },
      { name: `${client.config.prefix}antilinktoggle`, value: "To enable/disable Anti-Links protection" },
      { name: `${client.config.prefix}setprefix`, value: "Set custom command prefix" }
    ]);

    const bot = createCommandListEmbed("🤖 Bot Commands", [
      { name: `${client.config.prefix}stats`, value: "Show bot stats and information" },
      { name: `${client.config.prefix}links`, value: "Shows all bot special link vote/invite" },
      { name: `${client.config.prefix}feedback`, value: "To give a feedback about bot or to report bug" },
      { name: `${client.config.prefix}help`, value: "Display main bot help list embed" },
      { name: `${client.config.prefix}ping`, value: "Shows the bot ping" },
      { name: `${client.config.prefix}uptime`, value: "Show the bot uptime" }
    ]);

    const level = createCommandListEmbed("⬆️ Level Commands", [
      { name: `${client.config.prefix}leveltoggle`, value: "To enable/disable levelRoles cmd" },
      { name: `${client.config.prefix}rank`, value: "Show your level & rank and your current and next xp" },
      { name: `${client.config.prefix}level-roles`, value: "To show you all level roles in the guild" },
      { name: `${client.config.prefix}add-role`, value: "Add a level role as a prize for users when they be active" },
      { name: `${client.config.prefix}edit-level-role`, value: "Edit the guild level role to another one" },
      { name: `${client.config.prefix}clearxp`, value: "Clear the xp for a user in the server" },
      { name: `${client.config.prefix}remove-role`, value: "Remove a level role from the list" }
    ]);

    const Eco = createCommandListEmbed("💰 Economy Commands", [
      { name: `${client.config.prefix}profile`, value: "Shows your profile card" },
      { name: `${client.config.prefix}setbio`, value: "Sets your profile card bio" },
      { name: `${client.config.prefix}setbirthday`, value: "Sets your profile card birthday" },
      { name: `${client.config.prefix}quest`, value: "Refresh/Show current quests and the current progress" },
      { name: `${client.config.prefix}credits`, value: "To check your credits balance in wallet" },
      { name: `${client.config.prefix}tip`, value: "Send a tip for your friend" },
      { name: `${client.config.prefix}cookie`, value: "To send cookie for a friend as a gift" },
      { name: `${client.config.prefix}beg`, value: "Want to earn money some more? Why don't you try begging, maybe someone will give you" },
      { name: `${client.config.prefix}daily`, value: "To get your daily reward" },
      { name: `${client.config.prefix}fish`, value: "Take your fishingpole and start fishing" },
      { name: `${client.config.prefix}mine`, value: "What you know about mining down in the deep" },
      { name: `${client.config.prefix}register`, value: "To register a bank account" },
      { name: `${client.config.prefix}bank`, value: "To check your credits balance in bank" },
      { name: `${client.config.prefix}deposit`, value: "Deposit credits from your wallet to safeguard" },
      { name: `${client.config.prefix}withdraw`, value: "Withdraw credits from your bank to your wallet" },
      { name: `${client.config.prefix}inv`, value: "Show your inventory items (currently support mining only)" },
      { name: `${client.config.prefix}sell`, value: "Sell item from your inventory and get some credits" },
      { name: `${client.config.prefix}market`, value: "Open the economy market" },
      { name: `${client.config.prefix}buy`, value: "To buy items from the market" },
      { name: `${client.config.prefix}use`, value: "Equips an item from your inventory" },
      { name: `${client.config.prefix}previewitem`, value: "Check what you can buy from the shop" },
      { name: `${client.config.prefix}leaderboard`, value: "Get a list for the 10 richest users that using wolfy" }
    ]);

    // Handle "all" command type
    if (type && type === "all") {
      const fields = [];
      const groups = [];

      for (let cmd of client.commands) {
        cmd = cmd[1];
        if (cmd.group) {
          groups.push(cmd.group);
        }
      }

      const uniqueArr = [...new Set(groups)];

      for (let group of uniqueArr.filter(g => g.toLowerCase() !== 'unspecified' && g.toLowerCase() !== "developer")) {
        fields.push({
          name: group.charAt(0).toUpperCase() + group.slice(1).toLowerCase(),
          inline: true,
          value: text.joinArray(client.commands.filter(x => x.group === group).map(x => `\`${x.name}\``))
        });
      }

      const allCmds = new EmbedBuilder()
        .setColor(colors.BOT)
        .setTitle("🏷️ Wolfy's Full Commands List!")
        .addFields(fields.sort((A, B) => B.value.length - A.value.length))
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()
        .setDescription([
          `⭐ You can get full details of each command by typing \`${client.prefix}cmd <command name>\``
        ].join('\n'));

      return await interaction.reply({ embeds: [allCmds] });
    }

    // Handle specific command types from option choice
    if (type) {
      const responses = {
        "info": { embeds: [info], ephemeral: true },
        "search": { embeds: [search], ephemeral: true },
        "util": { embeds: [Utl], ephemeral: true },
        "mod": { embeds: [moderator], ephemeral: true },
        "fun": { embeds: [Fun], ephemeral: true },
        "setup": { embeds: [setup], ephemeral: true },
        "bot": { embeds: [bot], ephemeral: true },
        "level": { embeds: [level], ephemeral: true },
        "eco": { embeds: [Eco], ephemeral: true }
      };

      if (responses[type]) {
        return await interaction.reply(responses[type]);
      }
    }

    // Default help menu with buttons
    const msg = await interaction.reply({ 
      embeds: [help], 
      components: rows,
      fetchReply: true 
    });

    // Create message component collector
    const collector = msg.createMessageComponentCollector({ 
      time: 1800000, // 30 minutes
      filter: i => i.user.id === interaction.user.id
    });

    collector.on('collect', async i => {
      const responses = {
        "1": { embeds: [info], ephemeral: true },
        "2": { embeds: [search], ephemeral: true },
        "3": { embeds: [Utl], ephemeral: true },
        "4": { embeds: [moderator], ephemeral: true },
        "5": { embeds: [Fun], ephemeral: true },
        "6": { embeds: [setup], ephemeral: true },
        "7": { embeds: [bot], ephemeral: true },
        "8": { embeds: [level], ephemeral: true },
        "9": { embeds: [Eco], ephemeral: true },
      };

      if (responses[i.customId]) {
        await i.reply(responses[i.customId]);
      }
    });

    collector.on("end", () => {
      // Safely disable all components across all action rows
      const disabledRows = rows.map(row => {
        const newRow = ActionRowBuilder.from(row);
        newRow.components.forEach(component => component.setDisabled(true));
        return newRow;
      });

      msg.edit({ 
        embeds: [help], 
        components: disabledRows 
      }).catch(() => null);
    });
  },
};