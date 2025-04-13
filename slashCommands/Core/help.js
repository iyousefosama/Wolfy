const discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const text = require('../../util/string');

module.exports = {
  data: {
    name: "help",
    description: "Shows all available commands",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    group: "Bot",
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
    const { options, guild, user } = interaction;
    const type = options.getString('type');

    // Define button data
    const buttonData = [
      { label: 'Info', customId: '1', style: 'Primary', emoji: '776670895371714570' },
      { label: 'Search', customId: '2', style: 'Primary', emoji: '845681277922967572' },
      { label: 'Utilities', customId: '3', style: 'Primary', emoji: '836168684379701279' },
      { label: 'Moderator', customId: '4', style: 'Danger', emoji: '853496185443319809' },
      { label: 'Fun', customId: '5', style: 'Success', emoji: '768867196302524426' },
      { label: 'Setup', customId: '6', style: 'Primary', emoji: '836168687891382312' },
      { label: 'Bot', customId: '7', style: 'Primary', emoji: '888265210350166087' },
      { label: 'Levels', customId: '8', style: 'Primary', emoji: '853495519455215627' },
      { label: 'Economy', customId: '9', style: 'Primary', emoji: '877975108038324224' },
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
      .setEmoji('853495912775942154')
      .setURL(client.config.websites["invite"])
      .setLabel('Add me');
    rows[1].addComponents(linkButton);

    // Common embed settings
    const commonEmbedSettings = {
      color: "738ADB",
      url: client.config.websites["website"],
      author: {
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      },
      thumbnail: {
        url: client.user.displayAvatarURL(),
      },
      footer: {
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
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
      client.language.getString("HELP_TITLE", interaction.guild.id, { username: interaction.user.username }), 
      [
        {
          name: client.language.getString("HELP_INFO_TITLE", interaction.guild.id),
          value: `${client.config.prefix}help info`,
          inline: true,
        },
        {
          name: client.language.getString("HELP_SEARCH_TITLE", interaction.guild.id),
          value: `${client.config.prefix}help search`,
          inline: true,
        },
        {
          name: client.language.getString("HELP_UTILITY_TITLE", interaction.guild.id),
          value: `${client.config.prefix}help Util`,
          inline: true,
        },
        {
          name: client.language.getString("HELP_MOD_TITLE", interaction.guild.id),
          value: `${client.config.prefix}help mod`,
          inline: true,
        },
        {
          name: client.language.getString("HELP_FUN_TITLE", interaction.guild.id),
          value: `${client.config.prefix}help fun`,
          inline: true,
        },
        {
          name: client.language.getString("HELP_SETUP_TITLE", interaction.guild.id),
          value: `${client.config.prefix}help setup`,
          inline: true,
        },
        {
          name: client.language.getString("HELP_BOT_TITLE", interaction.guild.id),
          value: `${client.config.prefix}help bot`,
          inline: true,
        },
        {
          name: client.language.getString("HELP_LEVEL_TITLE", interaction.guild.id),
          value: `${client.config.prefix}help level`,
          inline: true,
        },
        {
          name: client.language.getString("HELP_ECONOMY_TITLE", interaction.guild.id),
          value: `${client.config.prefix}help eco`,
          inline: true,
        }
      ], 
      [
        client.language.getString("HELP_FEEDBACK_TIP", interaction.guild.id),
        client.language.getString("HELP_FULL_LIST_TIP", interaction.guild.id)
      ].join("\n")
    );

    const info = createCommandListEmbed(client.language.getString("HELP_INFO_TITLE", interaction.guild.id), [
      {
        name: `${client.config.prefix}server`,
        value: client.language.getString("CMD_SERVER_STATS_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}user`,
        value: client.language.getString("CMD_WHOIS_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}mcuser`,
        value: client.language.getString("CMD_MCUSER_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}avatar`,
        value: client.language.getString("CMD_AVATAR_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}savatar`,
        value: client.language.getString("CMD_AVATAR_DESC", interaction.guild.id),
      }
    ]);

    const search = createCommandListEmbed(client.language.getString("HELP_SEARCH_TITLE", interaction.guild.id), [
      {
        name: `${client.config.prefix}steam`,
        value: client.language.getString("CMD_STEAM_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}weather`,
        value: client.language.getString("CMD_WEATHER_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}lyrics`,
        value: client.language.getString("CMD_LYRICS_DESC", interaction.guild.id),
      }
    ]);

    const Utl = createCommandListEmbed(client.language.getString("HELP_UTILITY_TITLE", interaction.guild.id), [
      {
        name: `${client.config.prefix}suggestion`,
        value: client.language.getString("CMD_SUGGESTION_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}remind`,
        value: client.language.getString("CMD_REMINDME_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}report`,
        value: client.language.getString("CMD_REPORT_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}bin`,
        value: client.language.getString("CMD_BIN_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}ticket`,
        value: client.language.getString("CMD_TICKET_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}rename`,
        value: client.language.getString("CMD_RENAME_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}delete`,
        value: client.language.getString("CMD_DELETE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}calc`,
        value: client.language.getString("CMD_CALC_DESC", interaction.guild.id),
      }
    ]);

    const moderator = createCommandListEmbed(client.language.getString("HELP_MOD_TITLE", interaction.guild.id), [
      {
        name: `${client.config.prefix}ban`,
        value: client.language.getString("CMD_BAN_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}hackban`,
        value: client.language.getString("CMD_HACKBAN_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}softban`,
        value: client.language.getString("CMD_SOFTBAN_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}unban`,
        value: client.language.getString("CMD_UNBAN_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}kick`,
        value: client.language.getString("CMD_KICK_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}dm`,
        value: client.language.getString("CMD_DM_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}warn`,
        value: client.language.getString("CMD_WARN_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}warnings`,
        value: client.language.getString("CMD_WARNINGS_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}removewarn`,
        value: client.language.getString("CMD_REMOVE_WARN_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}say`,
        value: client.language.getString("CMD_SAY_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}embed`,
        value: client.language.getString("CMD_EMBED_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}embedsetup`,
        value: client.language.getString("CMD_EMBED_SETUP_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}respond`,
        value: client.language.getString("CMD_RESPOND_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}nick`,
        value: client.language.getString("CMD_NICKNAME_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}slowmo`,
        value: client.language.getString("CMD_SLOWMO_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}nuke`,
        value: client.language.getString("CMD_NUKE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}mute/unmute`,
        value: client.language.getString("CMD_MUTE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}timeout`,
        value: client.language.getString("CMD_TIMEOUT_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}lock`,
        value: client.language.getString("CMD_LOCK_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}unlock`,
        value: client.language.getString("CMD_UNLOCK_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}voicekick`,
        value: client.language.getString("CMD_VOICE_KICK_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}clear`,
        value: client.language.getString("CMD_CLEAR_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}purge`,
        value: client.language.getString("CMD_PURGE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}infraction`,
        value: client.language.getString("CMD_INFRACTION_DESC", interaction.guild.id),
      }
    ]);

    const Fun = createCommandListEmbed(client.language.getString("HELP_FUN_TITLE", interaction.guild.id), [
      {
        name: `${client.config.prefix}8ball`,
        value: client.language.getString("CMD_8BALL_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}clyde`,
        value: client.language.getString("CMD_CLYDE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}fast`,
        value: client.language.getString("CMD_FAST_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}meme`,
        value: client.language.getString("CMD_MEME_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}rps`,
        value: client.language.getString("CMD_RPS_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}tweet`,
        value: client.language.getString("CMD_TWEET_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}guess`,
        value: client.language.getString("CMD_GUESS_DESC", interaction.guild.id),
      }
    ]);

    const setup = createCommandListEmbed(client.language.getString("HELP_SETUP_TITLE", interaction.guild.id), [
      {
        name: `${client.config.prefix}setLogsch`,
        value: client.language.getString("CMD_LOGS_CHANNEL_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}setReportch`,
        value: client.language.getString("CMD_REPORT_CHANNEL_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}setSuggch`,
        value: client.language.getString("CMD_SUGGESTION_CHANNEL_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}setwelcomech`,
        value: client.language.getString("CMD_WELCOME_CHANNEL_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}setleaverch`,
        value: client.language.getString("CMD_LEAVER_CHANNEL_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}setTicketch`,
        value: client.language.getString("CMD_TICKET_CHANNEL_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}setwelcomemsg`,
        value: client.language.getString("CMD_WELCOME_MSG_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}setleavermsg`,
        value: client.language.getString("CMD_LEAVER_MSG_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}smRole`,
        value: client.language.getString("CMD_SELECT_MENU_ROLE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}badwords`,
        value: client.language.getString("CMD_BAD_WORDS_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}[cmd]toggle`,
        value: client.language.getString("CMD_TOGGLE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}antilinktoggle`,
        value: client.language.getString("CMD_ANTILINK_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}setprefix`,
        value: client.language.getString("CMD_SET_PREFIX_DESC", interaction.guild.id),
      }
    ]);

    const bot = createCommandListEmbed(client.language.getString("HELP_BOT_TITLE", interaction.guild.id), [
      {
        name: `${client.config.prefix}stats`,
        value: client.language.getString("CMD_STATS_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}links`,
        value: client.language.getString("CMD_LINKS_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}feedback`,
        value: client.language.getString("CMD_FEEDBACK_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}help`,
        value: client.language.getString("CMD_HELP_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}ping`,
        value: client.language.getString("CMD_PING_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}uptime`,
        value: client.language.getString("CMD_UPTIME_DESC", interaction.guild.id),
      }
    ]);

    const level = createCommandListEmbed(client.language.getString("HELP_LEVEL_TITLE", interaction.guild.id), [
      {
        name: `${client.config.prefix}leveltoggle`,
        value: client.language.getString("CMD_LEVEL_TOGGLE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}rank`,
        value: client.language.getString("CMD_RANK_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}level-roles`,
        value: client.language.getString("CMD_LEVEL_ROLES_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}add-role`,
        value: client.language.getString("CMD_ADD_ROLE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}edit-level-role`,
        value: client.language.getString("CMD_EDIT_LEVEL_ROLE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}clearxp`,
        value: client.language.getString("CMD_CLEAR_XP_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}remove-role`,
        value: client.language.getString("CMD_REMOVE_ROLE_DESC", interaction.guild.id),
      }
    ]);

    const Eco = createCommandListEmbed(client.language.getString("HELP_ECONOMY_TITLE", interaction.guild.id), [
      {
        name: `${client.config.prefix}profile`,
        value: client.language.getString("CMD_PROFILE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}setbio`,
        value: client.language.getString("CMD_SETBIO_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}setbirthday`,
        value: client.language.getString("CMD_SETBIRTHDAY_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}quest`,
        value: client.language.getString("CMD_QUEST_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}credits`,
        value: client.language.getString("CMD_CREDITS_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}tip`,
        value: client.language.getString("CMD_TIP_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}cookie`,
        value: client.language.getString("CMD_COOKIE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}beg`,
        value: client.language.getString("CMD_BEG_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}daily`,
        value: client.language.getString("CMD_DAILY_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}fish`,
        value: client.language.getString("CMD_FISH_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}mine`,
        value: client.language.getString("CMD_MINE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}register`,
        value: client.language.getString("CMD_REGISTER_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}bank`,
        value: client.language.getString("CMD_BANK_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}deposit`,
        value: client.language.getString("CMD_DEPOSIT_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}withdraw`,
        value: client.language.getString("CMD_WITHDRAW_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}inv`,
        value: client.language.getString("CMD_INVENTORY_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}sell`,
        value: client.language.getString("CMD_SELL_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}market`,
        value: client.language.getString("CMD_MARKET_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}buy`,
        value: client.language.getString("CMD_BUY_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}use`,
        value: client.language.getString("CMD_USE_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}previewitem`,
        value: client.language.getString("CMD_PREVIEW_ITEM_DESC", interaction.guild.id),
      },
      {
        name: `${client.config.prefix}leaderboard`,
        value: client.language.getString("CMD_LEADERBOARD_DESC", interaction.guild.id),
      }
    ]);

    // Handle "all" command type
    if (type && type == "all") {
      const fields = [];
      const groups = [];

      for (let cmd of client.commands) {
        cmd = cmd[1]
        if (cmd.group) {
          groups.push(cmd.group);
        }
      };

      var uniqueArr = [...new Set(groups)]

      for (let group of uniqueArr.filter(g => g.toLowerCase() !== 'unspecified' && g.toLowerCase() !== "developer")) {
        fields.push({
          name: group.charAt(0).toUpperCase() + group.slice(1).toLowerCase(), inline: true,
          value: text.joinArray(client.commands.filter(x => x.group == group).map(x => `\`${x.name}\``))
        });
      };
      const allCmds = new discord.EmbedBuilder()
        .setColor('738ADB')
        .setTitle(client.language.getString("HELP_ALL_COMMANDS_TITLE", interaction.guild.id))
        .addFields(fields.sort((A, B) => B.value.length - A.value.length))
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setFooter({ text: `Full Commands List | \©️${new Date().getFullYear()} wolfy`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setDescription([
          client.language.getString("HELP_ALL_COMMANDS_TIP", interaction.guild.id, { prefix: client.prefix })
        ].join('\n'))

      return await interaction.reply({ embeds: [allCmds], ephemeral: false });
    }

    // Handle specific command types
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

      return await interaction.reply(responses[type]);
    }

    // Default help with buttons
    const msg = await interaction.reply({ 
      embeds: [help], 
      components: rows,
      fetchReply: true 
    });

    // Create button collector
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
        await i.deferUpdate();
        await i.editReply(responses[i.customId]);
      }
    });

    collector.on("end", () => {
      buttons.forEach(button => button.setDisabled(true));
      const newrow = new ActionRowBuilder().addComponents(...buttons.slice(0, 5));
      const newrow2 = new ActionRowBuilder().addComponents(...buttons.slice(5));
      
      msg.edit({ 
        embeds: [help], 
        components: [newrow, newrow2] 
      }).catch(() => null);
    });
  },
};