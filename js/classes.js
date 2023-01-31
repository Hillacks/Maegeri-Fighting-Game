class Sprite {
    constructor({position, imageSrc, scale=1, framesMax = 1, offset = {x:0, y:0} }) {
        this.position = position
        this.height = 150
        this.width = 100
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    draw() {
        ctx.drawImage(
            this.image, 
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,  
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax ) * this.scale,
            this.image.height  * this.scale
            ) 
    }            
animateFrames(){
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0){
        if (this.frameCurrent < this.framesMax - 1){
        this.frameCurrent++
}else {
        this.frameCurrent = 0
    }
}
}
    update() {            //enables motion for the player object
        this.draw()   
         this.animateFrames()
        
    }
}
class Fighter extends Sprite{
    constructor({
        position,
        velocity,
        color = 'purple ',
        imageSrc,
        scale = 1, 
        framesMax = 1,
        offset = {x:0, y:0},
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
            super({
            position,
            imageSrc,
            scale, 
            framesMax,
            offset
            })
             
        this.velocity = velocity
        this.height = 150
        this.width = 100
        this.lastKey
        this.attackBox = {
            position: {
            x: this.position.x,
            y: this.position.y //follows position of player object
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites

       for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
       }
    }

    update() {            //enables motion for the player object
        this.draw()   
        this.animateFrames()
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
            

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 16){
            this.velocity.y = 0 

        }else
            this.velocity.y += gravity
            this.position.y = 479
            }  //pulls player down to the canvas

            
        
    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true 
    }

    takeHit(){
        this.switchSprite('takeHit')
        this.health -= 20
    }

        switchSprite(sprite) {
            //overides all animation with attack animation
            if (this.image === this.sprites.attack1.image && 
                this.frameCurrent < this.sprites.attack1.framesMax -1) 
                return
            //overides when fighter gets hit    
            if (this.image === this.sprites.takeHit && 
                this.frameCurrent < this.sprites.takeHit) 
                return  


            switch (sprite) {
                case "idle":
                    if (this.image !== this.sprites.idle.image){
                    this.image =  this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.frameCurrent = 0
                    }
                    break;
                case "run":
                    if (this.image !== this.sprites.run.image){
                    this.image =  this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.frameCurrent = 0
                    }
                    break;
                case "jump":
                    if (this.image !== this.sprite.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0
                    }
                    break;
                case "attack1":
                    if (this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.frameCurrent = 0
                }
                    break;    
                case "takeHit":
                    if (this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.frameCurrent = 0
                }
                    break;        
            }
 
        }
    }
