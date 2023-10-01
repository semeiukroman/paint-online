import Tool from "./Tool";

export default class Line extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id)
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false

        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'line',
                startX: this.startX,
                startY: this.startY,
                currentX: e.pageX-e.target.offsetLeft,
                currentY: e.pageY-e.target.offsetTop,
                strokeStyle: this.ctx.strokeStyle,
                strokeWidth: this.ctx.lineWidth,      
            }
        }))
    }
    mouseDownHandler(e) {
        this.mouseDown = true
        this.startX = e.pageX - e.target.offsetLeft
        this.startY = e.pageY - e.target.offsetTop
        this.ctx.beginPath()
        this.ctx.moveTo(this.startX, this.startY)
        this.saved = this.canvas.toDataURL()
    }
    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.draw(e.pageX-e.target.offsetLeft, e.pageY-e.target.offsetTop)
        }
    }

    draw(x, y) {
        const img = new Image()
        img.src = this.saved
        img.onload = async function(){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.startX, this.startY)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }.bind(this)
    }

    static staticDraw(ctx, startX, startY, currentX, currentY, strokeStyle, strokeWidth) {
        ctx.lineWidth = strokeWidth
        ctx.strokeStyle = strokeStyle
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(currentX, currentY)
        ctx.stroke()
    }
}