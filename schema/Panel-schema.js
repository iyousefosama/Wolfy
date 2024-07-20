const { Schema, model } = require("mongoose");

const panelSchema = new Schema({
    Guild: { type: String, required: true },
    Category: { type: String, required: true },
    Admin: { type: String, required: false },
    panelUID: { type: String, required: false },
    Enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = model("Panel", panelSchema)