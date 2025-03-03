const logTypes = {
    messageDelete: { key: "messageDelete", name: "Message Delete Logs", description: "A channel to send message delete logs to" },
    messageUpdate: { key: "messageUpdate", name: "Message Update Logs", description: "A channel to send message update logs to" },
    memberJoin: { key: "memberJoin", name: "Member Join Logs", description: "A channel to send member join logs to" },
    memberLeave: { key: "memberLeave", name: "Member Leave Logs", description: "A channel to send member leave logs to" },
    channelCreate: { key: "channelCreate", name: "Channel Create Logs", description: "A channel to send channel create logs to" },
    channelDelete: { key: "channelDelete", name: "Channel Delete Logs", description: "A channel to send channel delete logs to" },
    channelUpdate: { key: "channelUpdate", name: "Channel Update Logs", description: "A channel to send channel update logs to" },
    roleCreate: { key: "roleCreate", name: "Role Create Logs", description: "A channel to send role create logs to" },
    roleDelete: { key: "roleDelete", name: "Role Delete Logs", description: "A channel to send role delete logs to" },
    roleUpdate: { key: "roleUpdate", name: "Role Update Logs", description: "A channel to send role update logs to" },
};
module.exports = {logTypes};