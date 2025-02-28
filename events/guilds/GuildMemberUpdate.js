const { logEvent } = require("../../util/logHandler");
const { AuditLogEvent } = require("discord.js");
const discord = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",
  async execute(client, oldMember, newMember) {
    if (!oldMember) return;

    const fetchedLogs = await oldMember.guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.GuildMemberUpdate,
      })
      .catch(() => null);

    if (!fetchedLogs) return;

    const memberlog = fetchedLogs.entries.first();
    if (!memberlog) return;

    const { executor, target } = memberlog;
    const timestamp = Math.floor(Date.now() / 1000);

    if (memberlog.available && target.id != oldMember.id) return;

    let embed;
    if (oldMember.nickname !== newMember.nickname) {
      embed = new discord.EmbedBuilder()
        .setAuthor({
          name: oldMember.user.tag + ` (${oldMember.id})`,
          iconURL: oldMember.user.displayAvatarURL({
            dynamic: true,
            size: 2048,
          }),
        })
        .setTitle("📝 Member Nickname Updated!")
        .setDescription(
          `\`${oldMember.nickname || oldMember.user.tag}\` **➜** \`${newMember.nickname || newMember.user.tag}\`\n\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`
        )
        .setColor("#2F3136")
        .setFooter({
          text: oldMember.guild.name,
          iconURL: oldMember.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();
    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
      let role = newMember.roles.cache.find((r) => !oldMember.roles.cache.has(r.id));
      embed = new discord.EmbedBuilder()
        .setTitle("📝 Member Role Added!")
        .setAuthor({
          name: oldMember.user.tag,
          iconURL: oldMember.user.displayAvatarURL({ dynamic: true, size: 2048 }),
        })
        .setColor("#2F3136")
        .setDescription(
          `<:Humans:853495153280155668> **Member:** ${oldMember.user.tag} (\`${oldMember.id}\`)\n<a:Mod:853496185443319809> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>\n\n<a:Up:853495519455215627> **Role:** \`\`\`${role.name}\`\`\``
        )
        .setFooter({
          text: oldMember.guild.name,
          iconURL: oldMember.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();
    } else if (oldMember.roles.cache.size > newMember.roles.cache.size) {
      let role = oldMember.roles.cache.find((r) => !newMember.roles.cache.has(r.id));
      embed = new discord.EmbedBuilder()
        .setTitle("📝 Member Role Removed!")
        .setAuthor({
          name: oldMember.user.tag,
          iconURL: oldMember.user.displayAvatarURL({ dynamic: true, size: 2048 }),
        })
        .setColor("#2F3136")
        .setDescription(
          `<:Humans:853495153280155668> **Member:** ${oldMember.user.tag} (\`${oldMember.id}\`)\n<a:Mod:853496185443319809> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>\n\n<a:Down:853495989796470815> **Role:** \`\`\`${role.name}\`\`\``
        )
        .setFooter({
          text: oldMember.guild.name,
          iconURL: oldMember.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();
    }

    if (embed) logEvent(client, oldMember.guild, "guildMemberUpdate", embed);
  },
};
