

export default class Tool {
    constructor(canvas, socket, id) {
        this.canvas = canvas
        this.socket = socket
        this.id = id
        this.ctx = canvas.getContext('2d')
        this.destroyEvents()
        this.ctx.strokeStyle = document.getElementById('stroke-color').value
        this.ctx.lineWidth = document.getElementById('line-width').value
        this.ctx.fillColor = document.getElementById('fill-color').value
    }

    destroyEvents() {
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
    }

    set fillColor(color) {
        this.ctx.fillStyle = color
    }

    set strokeStyle(color) {
        this.ctx.strokeStyle = color
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width
    }
}