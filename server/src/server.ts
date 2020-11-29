import * as express from "express";
import * as io from 'socket.io'
import * as http from 'http'
const app = express()
const server = http.createServer(app)
const socket = require('./socket')
const { cors, corsOptions, corsMiddleware } = require('./cors')

const port = process.env.PORT || 9000

app.use(express.json())

app.use(cors(corsOptions(['http://localhost:3000'])), corsMiddleware)

app.use('/io', socket.router)

server.listen(port, () => console.log(`Server running on port ${port}`))

socket.initialize(io(server, { path: '/socket', serveClient: false }))

module.exports = app
