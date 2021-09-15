const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LeaderBoardModel = new Schema ({
    nickname: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
})

module.exports = Score = mongoose.model('Score', LeaderBoardModel, "snek")