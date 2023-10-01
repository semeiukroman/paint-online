import Tool from "./Tool";

export default class Circle extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id)
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler() {
        this.mouseDown = false

        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'circle',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                fillColor: this.ctx.fillStyle,
                strokeStyle: this.ctx.strokeStyle,
                strokeWidth: this.ctx.lineWidth,       
            }
        }))
    }
    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft
        this.startY = e.pageY - e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }
    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft
            let currentY = e.pageY - e.target.offsetTop
            this.width = Math.abs(currentX - this.startX)
            this.height = Math.abs(currentY - this.startY)
            // let r = Math.sqrt(width**2 + height**2)
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }

    draw(x, y, w, h) {
        const img = new Image()
        img.src = this.saved
        img.onload = async function () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.ellipse(x, y, w, h, 0, 0, 2*Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }.bind(this)
    }

    static staticDraw(ctx, x, y, w, h, fillColor,  strokeStyle, strokeWidth) {
        ctx.lineWidth = strokeWidth
        ctx.strokeStyle = strokeStyle
        ctx.fillStyle = fillColor
        ctx.beginPath()
        ctx.ellipse(x, y, w, h, 0, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}