const express = require('express')
const app = express()
const { cors, corsOptions, corsMiddleware } = require('./cors');
const socket = require('./socket')

const port = process.env.PORT || 9000

app.use(express.json())

app.use(cors(corsOptions(['http://localhost:3000'])), corsMiddleware);

app.use('/io', socket.router)

const server = app.listen(port, () => console.log(`Server running on port ${port}`))

const io = require('socket.io')(server)

socket.initialize(io)

module.exports = app
