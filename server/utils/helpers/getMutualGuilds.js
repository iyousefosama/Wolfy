const getMutualGuilds = async (userGuilds, botGuilds) => {
    const commonGuilds = userGuilds.filter(guild =>
        botGuilds.some(botGuild => botGuild.id === guild.id) &&
        guild.permissions.includes(2251799813685247)
    );
    return commonGuilds;
};

module.exports = getMutualGuilds;