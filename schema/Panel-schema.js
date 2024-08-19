const { Schema, model } = require("mongoose");

const panelSchema = new Schema({
    Guild: { type: String, required: true },
    Category: { type: String, required: true },
    ModRole: { type: String, default: null },
    Message: { type: String, default: null },
    Admin: { type: String, required: false },
    logs: { type: String, default: null },
    panelUID: { type: String, required: false },
    Enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = model("Panel", panelSchema)