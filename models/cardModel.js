const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,

        },
        list: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "List",
            required: true,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        board: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true,
        },
        assignedTo: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            default: [],
        },
        label: {
            type: String,
        },
        comments: {
            type: [{ type: String }],
            default: [],
        },
        active: {
            type: Boolean,
            default: true,
        },
        fileUrl: {
            type: [{ type: String, }],
            default: [],
        },
        coverUrl: {
            type: String,
        },
        imgUrl: {
            type: String,
        },
    },
    { timestamps: true }
);

const CardModel = mongoose.model("Card", Schema);

module.exports = CardModel;
