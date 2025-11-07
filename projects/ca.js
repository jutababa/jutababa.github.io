const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rows = 100;
const cols = 150;
const cellWidth = canvas.width/cols;
const cellHeight = canvas.height/rows;

let grid = [];
let running = false;
let speed = 20;

// Initialize grid
function initGrid(random=false){
    grid = [];
    for(let y=0;y<rows;y++){
        let row=[];
        for(let x=0;x<cols;x++){
            row.push(random ? Math.random()<0.2 : false);
        }
        grid.push(row);
    }
}

// Draw grid
function drawGrid(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
            if(grid[y][x]){
                ctx.fillStyle = "#0ff";
                ctx.fillRect(x*cellWidth, y*cellHeight, cellWidth-1, cellHeight-1);
            }
        }
    }
}

// Count neighbors
function countNeighbors(x,y){
    let sum=0;
    for(let i=-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
            if(i===0 && j===0) continue;
            const ny = y+i;
            const nx = x+j;
            if(nx>=0 && nx<cols && ny>=0 && ny<rows){
                if(grid[ny][nx]) sum++;
            }
        }
    }
    return sum;
}

// Step simulation
function step(){
    const next = [];
    for(let y=0;y<rows;y++){
        let row=[];
        for(let x=0;x<cols;x++){
            const neighbors = countNeighbors(x,y);
            if(grid[y][x]){
                row.push(neighbors===2 || neighbors===3);
            } else {
                row.push(neighbors===3);
            }
        }
        next.push(row);
    }
    grid = next;
    drawGrid();
}

// Animation
function animate(){
    if(running){
        for(let i=0;i<speed;i++) step();
    }
    requestAnimationFrame(animate);
}

// Mouse interaction
canvas.addEventListener("click", (e)=>{
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX-rect.left)/cellWidth);
    const y = Math.floor((e.clientY-rect.top)/cellHeight);
    grid[y][x] = !grid[y][x];
    drawGrid();
});

// Controls
document.getElementById("startBtn").addEventListener("click",()=>{ running=true; });
document.getElementById("stopBtn").addEventListener("click",()=>{ running=false; });
document.getElementById("clearBtn").addEventListener("click",()=>{ initGrid(); drawGrid(); });
document.getElementById("randomBtn").addEventListener("click",()=>{ initGrid(true); drawGrid(); });
document.getElementById("speed").addEventListener("input",(e)=>{ speed=parseInt(e.target.value); });

window.addEventListener("resize",()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
});

initGrid();
drawGrid();
animate();
