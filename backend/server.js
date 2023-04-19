const express = require('express')
const cors = require('cors')
const connectDB = require('./connection')
const mongoose = require('mongoose')
const dotenv = require('dotenv')


const userRoutes = require('./routes/userRoutes')
const Message = require('./models/Message')
const User = require('./models/User')

const PORT = process.env.PORT || 5050
const rooms = ['general','tech','marketing', 'business']

const app = express()
dotenv.config()
connectDB()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())


// Routes
app.use('/api/users', userRoutes)

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET','POST'],
    }
})

const getLastMessageFromRoom = async (room) => {
    let roomMessages = await Message.aggregate([
        {$match: {to: room}},
        {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
    ])
    return roomMessages
}

const sortRoomMessageByDate = (messages) => {
    return messages.sort(function(a,b) {
        let date1 = a._id.split('/')
        let date2 = b._id.split('/')

        date1 = date1[2] + date1[0] + date1[1]
        date2 = date2[2] + date2[0] + date2[1]

        return date1 < date2 ? -1 : 1
    })
}


// socket connection
io.on('connection', (socket) => {

    socket.on('new-user', async() => {
        const members = await User.find()
        io.emit('new-user', members)
    })

    socket.on('join-room', async(newRoom, previousRoom) => {
        socket.join(newRoom)
        socket.leave(previousRoom)
        let roomMessages = await getLastMessageFromRoom(newRoom)
        roomMessages = sortRoomMessageByDate(roomMessages)
        socket.emit('room-messages', roomMessages)
    })

    socket.on('message-room', async (room, content, sender, time, date) => {
        const newMessage = await Message.create({content, from: sender, time, date, to: room})
        let roomMessages = await getLastMessageFromRoom(room)
        roomMessages = sortRoomMessageByDate(roomMessages)
        // sending message to room
        io.to(room).emit("room-messages", roomMessages)
        socket.broadcast.emit("notifications", room)
    })

    app.delete('/logout', async(req,res) => {
        try {
            const {_id, newMessages} = req.body
            const user = await User.findById(_id)
            user.status = "offline"
            user.newMessages = newMessages
            await user.save()
            const members = await User.find()
            socket.broadcast.emit('new-user', members)
            res.status(200).send()
        } catch (error) {
            res.status(400).send()
        }
    })
})

app.get('/rooms', (req,res) => {
    res.json(rooms)
})

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}; Press Ctrl + C to stop `)
})


