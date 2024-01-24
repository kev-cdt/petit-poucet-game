const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
console.log(exitZonesData)

canvas.width = 1024
canvas.height = 576

let toggle = document.querySelector("#toggle");
let main = document.querySelector(".main-start");

toggle.onclick = function(){
        main.classList.add("fade-out");
        document.getElementById("toggle").style.pointerEvents = "none";
    }

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 120) {
    collisionsMap.push(collisions.slice(i, 120 + i))
}
const exitZonesMap = []
for (let i = 0; i < exitZonesData.length; i += 120) {
    exitZonesMap.push(exitZonesData.slice(i, 120 + i))
}

console.log(exitZonesMap)

const boundaries = []
const offset = {
    x: -1885,
    y: -700
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        boundaries.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
    })
})

const exitZones = []

exitZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        exitZones.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
    })
})

console.log(exitZones)

const image = new Image()
image.src = './img/map-finale.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObject.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 20,
        y: canvas.height / 2 - playerDownImage.height / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    z: {
        pressed: false
    },
    q: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries, foreground, ...exitZones]

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const exit = {
    initiated: false
}

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    exitZones.forEach(exitZones => {
        exitZones.draw()
    })
    player.draw()
    foreground.draw()

    if (keys.z.pressed || keys.q.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < exitZones.length; i++) {
            const exitZone = exitZones[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: exitZone
                })
            ) {
                exit.initiated = true
                gsap.to('#main-exit', {
                    opacity: 1,
                    duration: 0.4
                })
            }
        }
    }

    let moving = true
    player.moving = false

    if (exit.initiated) return

    if (keys.z.pressed && lastKey === 'z') {
        player.moving = true
        player.image = player.sprites.up

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 4
                    }}
                })
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.y += 4
        })
    } else if (keys.q.pressed && lastKey === 'q') {
        player.moving = true
        player.image = player.sprites.left

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 4,
                        y: boundary.position.y
                    }}
                })
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.x += 4
        })
    } else if (keys.s.pressed && lastKey === 's') {
        player.moving = true
        player.image = player.sprites.down

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 4
                    }}
                })
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.y -= 4
        })
    } else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true
        player.image = player.sprites.right

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 4,
                        y: boundary.position.y
                    }}
                })
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
        movable.position.x -= 4
        })
    }
}
animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'z':
            keys.z.pressed = true
            lastKey = 'z'
            break

        case 'q':
            keys.q.pressed = true
            lastKey = 'q'
            break

        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'z':
            keys.z.pressed = false
            break

        case 'q':
            keys.q.pressed = false
            break

        case 's':
            keys.s.pressed = false
            break
            
        case 'd':
            keys.d.pressed = false
            break
    }
})