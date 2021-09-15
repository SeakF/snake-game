const express = require('express')
const Score = require('../models/LeaderBoardModel')

const router = express.Router()

router.get('/', (req, res) => {
    Score.find({})
        .sort({ points: -1 })
        .limit(10)
        .then(results => res.send({results}))
})

router.post('/', (req, res) => {
    const newScore = new Score({
        nickname: req.body.nickname,
        points: req.body.points
    }) 
    newScore.save()
            .then(() => res.sendStatus(200))
            .catch(() => es.sendStatus(500))
})

module.exports = router