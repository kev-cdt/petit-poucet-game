const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position :{
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

const draggle = new Monster(monsters.Draggle)
const emby = new Monster(monsters.Emby)

const renderedSprites = [draggle, emby]

emby.attacks.forEach(attack => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
})

let battleAnimationId

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

animateBattle()

const queue = []
//our event listeners for our buttons attack
document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        emby.attack({ 
            attack: selectedAttack,
            recipient: draggle,
            renderedSprites
        })

        if (draggle.health <= 0) {
            queue.push(() => {
                draggle.faint()
            })
            queue.push(() => {
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    onComplete: () => {
                        cancelAnimationFrame(battleAnimationId)
                        animate()
                        gsap.to('#overlappingDiv', {
                            opacity: 0
                        })
                    }
                })
            })
        }

        queue.push(() => {
            draggle.attack({ 
                attack: attacks.Fireball,
                recipient: emby,
                renderedSprites
            })
        })

        if (emby.health <= 0) {
            queue.push(() => {
                emby.faint()
            })
        }
    })
})

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})