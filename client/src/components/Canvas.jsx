import { useEffect, useRef, useState } from 'react'
import '../styles/canvas.scss'
import { observer } from 'mobx-react-lite'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import Brush from '../tools/Brush'
import Rect from '../tools/Rect'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Circle from '../tools/Circle'
import Eraser from '../tools/Eraser'
import Line from '../tools/Line'

const Canvas = observer(() => {
    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams()
    const socket = useRef()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)

        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
          .then(res => {
            const img = new Image()
            img.src = res.data
            img.onload = () => {
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
              ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
            }
          })
    }, )
    
    useEffect(() => {
      if(canvasState.username) {
        socket.current = new WebSocket('ws://localhost:5000/')
        canvasState.setSocket(socket.current)
        canvasState.setSessionId(params.id)
        toolState.setTool(new Brush(canvasRef.current, socket.current, params.id))
        
        socket.current.onopen = () => {
          console.log('connected')
          socket.current.send(JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: 'connection'
          }))
        }

        socket.current.onmessage = (event) => {
          let msg = JSON.parse(event.data)
          switch (msg.method) {
            case 'connection':
              console.log(`User ${msg.username} connected`)
              break
            // case 'disconnection':
            //   console.log(`User ${msg.username} disconnected`)
            //   break
            case 'draw':
              drawHandler(msg)
              break
          }
        }

        // socket.current.onclose = () => {
        //   console.log('connection closed')
        //   socket.current.send(JSON.stringify({
        //     id: params.id,
        //     username: canvasState.username,
        //     method: 'disconnection'
        //   }))
        // }

        socket.current.onerror = () => {
          console.log('connection error')
        }
      }
    }, )


    const drawHandler = (msg) => {
      const figure = msg.figure
      const ctx = canvasRef.current.getContext('2d')
      switch (figure.type) {
        case 'brush':
          Brush.staticDraw(ctx, figure.x, figure.y, figure.color, figure.width)
          setSettingsBack()
          break
        case 'eraser':
          Eraser.staticDraw(ctx, figure.x, figure.y, figure.width)
          toolState.setLineWidth(document.getElementById('line-width').value)
          break
        case 'rect':
          Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.fillColor, figure.strokeStyle, figure.strokeWidth)
          setSettingsBack()
          ctx.beginPath()
          break
        case 'circle':
          Circle.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.fillColor, figure.strokeStyle, figure.strokeWidth)
          setSettingsBack()
          ctx.beginPath()
          break
        case 'line':
          Line.staticDraw(ctx, figure.startX, figure.startY, figure.currentX, figure.currentY, figure.strokeStyle, figure.strokeWidth)
          setSettingsBack()
          ctx.beginPath()
          break
        case 'finish':
          ctx.beginPath()
          break
      }
    }

    const setSettingsBack = () => {
      toolState.setStrokeStyle(document.getElementById('stroke-color').value)
      toolState.setLineWidth(document.getElementById('line-width').value)
      toolState.setFillColor(document.getElementById('fill-color').value)
    }

    const mouseDownHandler = () => {
      canvasState.pushToUndo(canvasRef.current.toDataURL())
    }

    const mouseUpHandler = () => {
    
      // socket.current.send(JSON.stringify({
      //   id: params.id,
      //   method: 'undo',
      //   data: canvasRef.current.toDataURL()
      // }))

      axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
        .then(res => console.log(res.data))
    }

    const connectionHandler = () => {
        canvasState.setUserName(usernameRef.current.value)
        setModal(false)
    }

  return (
    <div className='canvas'>

      <Modal show={modal} onHide={() => {}}>
        <Modal.Header >
          <Modal.Title>Enter your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef}/>
        </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => connectionHandler()}>
              Enter
            </Button>
          </Modal.Footer>
        </Modal>
        <canvas onMouseDown={() => mouseDownHandler()} onMouseUp={() => mouseUpHandler()} ref={canvasRef} width={'1200vw'} height={'800'} />
    </div>
  )
})

export default Canvas