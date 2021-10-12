const mongoose = require('mongoose')

const StoreSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    latitude: Number,
    longitude: Number,
    shopper: { type: mongoose.Schema.ObjectId, ref: "User" },
    items: [
        {
            text: String,
            createdAt: { type: Date, default: Date.now},
            shopper: { type: mongoose.Schema.ObjectId, ref: "User" }
        }
    ]

}, { timestamps: true })

module.exports = mongoose.model("Store", StoreSchema)