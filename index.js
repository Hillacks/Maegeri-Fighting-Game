const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 550

ctx.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7

class Haenedan {
    constructor({position, velocity, color='purple', offSet}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
            x: this.position.x,
            y: this.position.y //follows position of player object
            },
            offSet,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
    }

    draw() {            //draws an object player
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    
        //player attackBox
        if (this.isAttacking){
        ctx.fillStyle = "green"
        ctx.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height)
    }
    }

    update() {            //enables motion for the player object
        this.draw()   
        this.attackBox.position.x = this.position.x + this.attackBox.offSet.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        }else
            this.velocity.y += gravity
            }  //pulls player down to the canvas
    attack() {
        this.isAttacking = true
        setTimeout(() =>{
            this.isAttacking = false

        }, 100)
    }
}
const player = new Haenedan({ 
    position: {
        x:0,
        y:0
}, 
    velocity: {
       x: 0,
       y:0
    },
    offSet: {
        x: 0,
        y: 0
    }
})
    const enemy = new Haenedan({  //create enemy and default position and velocity of movement
        position: {
            x: 500,
            y: 200
}, 
    velocity: {
        x: 0,
        y:0
},
   offSet: {
        x: -50,
        y: 0
    },
    color: 'red'
})
console.log(player)
const keys = {     //keyboards control
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    '': { 
        pressed: false
    },
    m: {
        pressed: false
    }
}
let lastKey   //improve functionality of key when both of them are pressed

function rectangularCollision({rectangle1, rectangle2}) {
    return (
         rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x +rectangle2.width
        && rectangle1.attackBox.position.y + rectangle2.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
    
}
function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Draw'
    }else if (player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = "Player 1 wins"

    }
    else if (enemy.health > player.health){
        document.querySelector('#displayText').innerHTML = "Enemy wins"
    }
}

let timer = 60
let timerId
function decreaseTimer() {
    timerId = setTimeout(decreaseTimer, 1000)
    if (timer > 0) {
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer == 0){
        determineWinner({player, enemy, timerId})
    }
}
decreaseTimer()

function animate() {  //enable movement of object without remaining on the same position
    window.requestAnimationFrame(animate) //infinite loop 
    ctx.fillStyle = "black"
    ctx.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0 //default value so it stops when we lift up key   
    enemy.velocity.x = 0 //default value so it stops when we lift up key   

      //player movement
    if (keys.a.pressed && player.lastKey === 'a'){ //monitors key pressed and last key to be pressed
        player.velocity.x = -5
    }else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
    }else if(keys.w.pressed && player.lastKey === 'w'){
        player.velocity.y = -5
    }
       
       //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){ //monitors key pressed and last key to be pressed
        enemy.velocity.x = -5
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
    }else if(keys.ArrowUp.pressed && enemy.lastKey != 'ArrowUp'){
        enemy.velocity.y = -5
    }

    //detect for collisions
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
        ){
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }
      if (
         rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })&& 
         enemy.isAttacking
        ){
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0){
         determineWinner({player, enemy, timerId})
    }
    }

animate()
window.addEventListener('keydown', (event) => {  //listen on keys being pressed on the keyboard
    switch (event.key){
        case 'd':
            keys.d.pressed =true
            player.lastKey = 'd'
        break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
        break
        case 'w':
            keys.w.pressed = true
            player.lastKey = 'w'
        break
        case ' ':
            player.isAttacking = true
        break
         case 'ArrowRight':
            keys.ArrowRight.pressed =true
            enemy.lastKey = 'ArrowRight'
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
        break
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            enemy.lastKey = 'ArrowUP'
        break
        case 'm':
            enemy.isAttacking = true
        break
    }
})
window.addEventListener('keyup', (event) =>{
    switch (event.key){
        case 'd':   //player keys
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
        case 'w':
            keys.w.pressed = false
        break
        case 'ArrowRight':   //enemy key
            keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            
        break
    }
})

 