const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        cards: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Card",
            },
        ],
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }

    },
    { timestamps: true }
);

const ListModel = mongoose.model("List", Schema);

module.exports = CategoryModel;
