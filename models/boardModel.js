const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    cards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card",
        },
    ],

    active: {
        type: Boolean,
        default: true,
    },
},

    { timestamps: true }

);

const BoardModel = mongoose.model("Board", Schema);

module.exports = BoardModel;
