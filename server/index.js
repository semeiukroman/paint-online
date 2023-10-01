const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const fs = require('fs')
const path = require('path')


const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({limit:'50mb'}))

app.ws('/', (ws, req) => {
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg)
                break
            // case 'disconnection':
            //     console.log(msg)
            //     //disconnectionHandler(ws, msg)
            //     break
            case 'draw':
                broadcastConnection(ws, msg)
                break
            case 'push-to-undo':
                broadcastConnection(ws, msg)
                break
            case 'push-to-redo':
                broadcastConnection(ws, msg)
                break
            case 'undo':
                broadcastConnection(ws, msg)
                break
            case 'redo':
                broadcastConnection(ws, msg)
                break
        }
    })
})

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64,', '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.png`), data, 'base64')
        return res.status(200).json({message: 'img download'})
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

app.get('/image', (req, res) => {
    try {
        const filePath = path.resolve(__dirname, 'files', `${req.query.id}.png`)
        fs.access(filePath, fs.F_OK, (err) => {
            if (err) {
                fs.writeFileSync(filePath, '', 'base64')
            } else {
                const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.png`))
                const data = 'data:image/png;base64,' + file.toString('base64')
                res.json(data)
            }
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

app.listen(PORT, () => console.log(`server started on port ${PORT}`))


const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}