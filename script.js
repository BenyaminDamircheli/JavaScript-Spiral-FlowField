const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// settings for flowfield appearance
const strokeColors = ['blue', 'orange', '#f7526e', 'purple', 'green', 'red', 'white'];
context.strokeStyle = strokeColors[Math.floor(Math.random() * 7)];
context.lineWidth = 1.5;

class Particle{
    constructor(effect){
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.dx;
        this.dy;
        this.speedModifier = Math.floor(Math.random() * 5 + 1);
        this.maxLineLength =  Math.floor(Math.random() * 200 + 10);
        this.prevPos = [{x: this.x, y: this.y}];
        this.angle = 0;
        this.timer = 2 * this.maxLineLength; // condition that determines when the line should be removed from the scene
    }

    draw(context){
        context.beginPath();
        context.moveTo(this.prevPos[0].x, this.prevPos[0].y);
        for(let i = 0; i < this.prevPos.length; i++){
            context.lineTo(this.prevPos[i].x, this.prevPos[i].y);
        }
        context.stroke()
    }

    update(){
        this.timer--;
        if(this.timer >= 1){
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            let i = y * this.effect.cols + x;
            this.angle = this.effect.flowField[i];

            this.dx = Math.sin(this.angle) * this.speedModifier;
            this.dy = Math.cos(this.angle) * this.speedModifier;

            this.x += this.dx;
            this.y += this.dy;
            
            this.prevPos.push({x: this.x, y: this.y});
            
            if(this.prevPos.length > this.maxLineLength){
            this.prevPos.shift();
            }
        } else if(this.prevPos.length > 1){
            this.prevPos.shift();
        } else{
            this.reset()
        }   
    }

    reset(){
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.prevPos = [{x: this.x, y: this.y}]
        this.timer = this.maxLineLength * 2; 
    }
}

class Effect{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.numberOfParticles = 3800; // this changes the number of particles on screen.
        this.particles = [];
        this.cellSize = 5;
        this.cols;
        this.rows; 
        this.flowField = [];
        this.curve = Math.random() * 15 + 5;
        this.zoom = Math.random() * 0.11 - 0.008
        this.init();
    }

    init(){
        // create rows, columns, flowfield, etc.
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);
        this.flowField = [];

        // building the flowField Vectors

        for(let y = 0; y < this.rows; y++){
            for(let x = 0; x < this.cols; x++){
                let angle = Math.sin(x * this.zoom) * Math.sin(y * this.zoom) * this.curve;
                this.flowField.push(angle);
            }
        }

        for(let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this));
        }
    }

    render(context){
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }
}

const effect = new Effect(canvas.width, canvas.height);

function animate(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(context);
    requestAnimationFrame(animate);
}

animate();
