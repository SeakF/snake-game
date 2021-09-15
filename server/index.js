const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const path = require('path')
const points = require('./routes/points.js')

dotenv.config()

const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({
    origin: process.env.CORS || '*'
}))

mongoose.connect(process.env.MONGODB)
    .then(() => console.log('DB connected'))
    .catch((err) => console.log(err))

app.use(express.static('../client'))
app.use('/routes/points', points)
    
app.get('*', (req, res) => { 
    res.sendFile(path.resolve(__dirname, '../client', 'index.html'))
})

app.listen(port, () => console.log(`app listen at ${port}`))