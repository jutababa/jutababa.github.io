const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let array = [];
const defaultSize = 50; // default number of bars
let i=0, j=0, sorted=false, running=false;

// Controls
const modeSelect = document.getElementById("mode");
const algorithmSelect = document.getElementById("algorithm");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const speedSlider = document.getElementById("speed");
const customArrayInput = document.getElementById("customArray");

// Particle effect for swaps
const particles = [];

class Particle {
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.vx = Math.random()*2-1;
        this.vy = Math.random()*-2-1;
        this.alpha = 1;
        this.color = color;
        this.size = Math.random()*4 +2;
    }
    update(){
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.02;
    }
    draw(){
        ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fill();
    }
}

// Generate array
function generateArray(){
    const input = customArrayInput.value.trim();
    if(input){
        array = input.split(",").map(Number).filter(n => !isNaN(n));
    } else {
        array = [];
        for(let k=0;k<defaultSize;k++){
            array.push(Math.floor(Math.random()*100)+1);
        }
    }
    i=0; j=0; sorted=false; running=false;
    drawArray();
}

// Draw array
function drawArray(highlight1=-1, highlight2=-1){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const barWidth = canvas.width/array.length;
    const maxVal = Math.max(...array);

    // Draw bars or numbers
    array.forEach((val,k)=>{
        const height = (val/maxVal) * canvas.height*0.8;
        if(modeSelect.value==="bars"){
            ctx.fillStyle = k===highlight1||k===highlight2 ? "#0ff" : `hsl(${val*3.6},80%,50%)`;
            ctx.fillRect(k*barWidth,canvas.height-height,barWidth-1,height);
        } else {
            ctx.fillStyle = k===highlight1||k===highlight2 ? "#0ff" : "white";
            ctx.font = "14px Georgia";
            ctx.fillText(val,k*barWidth+2,canvas.height-height);
        }
    });

    // Draw swap particles
    particles.forEach(p=>{p.update();p.draw();});
    for(let idx=particles.length-1;idx>=0;idx--){
        if(particles[idx].alpha<=0) particles.splice(idx,1);
    }
}

// Bubble Sort step
function bubbleSortStep(){
    if(!running || sorted) return;

    if(i<array.length){
        if(j<array.length-i-1){
            if(array[j]>array[j+1]){
                // Add particles
                const barWidth = canvas.width/array.length;
                const height1 = (array[j]/Math.max(...array))*canvas.height*0.8;
                const height2 = (array[j+1]/Math.max(...array))*canvas.height*0.8;
                particles.push(new Particle(j*barWidth+barWidth/2, canvas.height-height1, {r:0,g:255,b:255}));
                particles.push(new Particle((j+1)*barWidth+barWidth/2, canvas.height-height2, {r:0,g:255,b:255}));

                [array[j], array[j+1]] = [array[j+1], array[j]]; // swap
            }
            drawArray(j,j+1);
            j++;
        } else { j=0; i++; }
    } else { sorted=true; drawArray(); running=false; }
}

// Animate loop
function animate(){
    bubbleSortStep();
    requestAnimationFrame(()=>setTimeout(animate,100-speedSlider.value));
}

// Event listeners
startBtn.addEventListener("click",()=>{ running=true; });
resetBtn.addEventListener("click",generateArray);

window.addEventListener("resize",()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    drawArray();
});

// Initialize
generateArray();
animate();
