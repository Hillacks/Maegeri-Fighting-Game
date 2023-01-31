const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")

canvas.width = 930
canvas.height = 645

ctx.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7


const background = new Sprite({
    position: {
        x: 0,
        y:0
    },
    imageSrc: './img/grounds.png'
    
    })
    

const player = new Fighter({ 
    position: {
        x:0,
        y:0
}, 
    velocity: {
       x: 0,
       y:0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './Huntress/Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset: {
        x: 100,
        y: 85
    },
    sprites: {
    idle: {
        imageSrc: './Huntress/Idle.png',
        framesMax: 8
            
        },
    run: {
       imageSrc: './Huntress/Run.png',
       framesMax: 8
    },
    Jump: {
        imageSrc: './Huntress/Jump.png',
        framesMax: 2,
    },
    fall: {
        imageSrc: './Huntress/Jump.png',
        framesMax: 2                               
    },
    attack1: {
        imageSrc: './Huntress/Attack1.png',
        framesMax: 5                              
    }, 
    takeHit: {
        imageSrc: './Huntress/Take hit.png',
        framesMax: 3                            
    }
   },
   attackBox: {
    offset: {
        x: 20,
        y: 50
    },
    width: 190,
    height: 20
    
}

})
    const enemy = new Fighter({  //create enemy and default position and velocity of movement
        position: {
            x: 500,
            y: 200
}, 
    velocity: {
        x: 0,
        y:0
},
   offset: {
        x: -500,
        y: 0
    },
    imageSrc: './Hero Knight/Idle.png',
    scale: 2.5,
    framesMax: 11,
    offset: {
        x: 200,
        y: 130
    },
    sprites: {
        idle: {
            imageSrc: './Hero Knight/Idle.png',
            framesMax: 11
        },
        run: {
        imageSrc: './Hero Knight/Run.png',
        framesMax: 8
    },
        Jump: {
            imageSrc: './Hero Knight/Jump.png',
            framesMax: 2
    },
    fall: {
        imageSrc: './Hero Knight/Jump.png',
        framesMax: 2                               
    },
     attack1: {
        imageSrc: './Hero Knight/Attack1.png',
        framesMax: 7                            
    },
    takeHit: {
        imageSrc: './Hero Knight/Take Hit.png',
        framesMax: 4                          
    }
    },
    attackBox: {
        offset: {
            x: -10,
            y: 50
        },
        width: 50,
        height: 250
        
    }

})

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

decreaseTimer()

function animate() {  //enable movement of object without remaining on the same position
    window.requestAnimationFrame(animate) //infinite loop 
    ctx.fillStyle = "black"
    ctx.fillRect(0,0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0 //default value so it stops when we lift up key   
    enemy.velocity.x = 0 //default value so it stops when we lift up key   

      //player movement
    
    if (keys.a.pressed && player.lastKey === 'a'){ //monitors key pressed and last key to be pressed
        player.velocity.x = -5
       player.switchSprite('run')
    }else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    //jumping
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    }else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }
       
       //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){ //monitors key pressed and last key to be pressed
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }
    else {
        enemy.switchSprite('idle')
    }
    //jumping
    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //detect for collisions && enemy is hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.frameCurrent === 2
        ){
            enemy.takeHit()
            player.isAttacking = false
        
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    // if player missses
     if (player.isAttacking && player.frameCurrent ===2) {
        player.isAttacking = false
     }

      if (
         rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })&& 
         enemy.isAttacking && enemy.frameCurrent === 2
        ){
            player.takeHit()
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if (enemy.isAttacking && enemy.frameCurrent ===2) {
        enemy.isAttacking = false
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
            player.velocity.y = -20
        break
        case ' ':
            player.attack()
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
          enemy.velocity.y = -20
        break
        case 'm':
            enemy.attack()
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
    }
        //enemy's key
        switch (event.key){
        case 'ArrowRight':   //enemy key
            keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break
        }
})

 