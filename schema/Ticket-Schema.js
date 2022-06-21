const mongoose = require('mongoose')


const TicketSchema = mongoose.Schema({

    guildId: { type: String, required: true },

    ChannelId: { type: String, default: null },

    UserId: { type: String, default: null },

    IsClosed: { type: Boolean, default: false }
})


module.exports = mongoose.model('Ticket-channels', TicketSchema)