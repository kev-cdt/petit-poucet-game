class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 }, sprites }) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            console.log(this.width)
            console.log(this.height)
        }
        this.moving = false
        this.sprites = sprites
    }

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )

        if (!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % 8 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

class Boundary {
    static width = 42
    static height = 42
    constructor({position}) {
        this.position = position
        this.width = 42
        this.height = 42
    }

    draw() {
        c.fillStyle = 'rgba(0, 0, 0, 0) '
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}