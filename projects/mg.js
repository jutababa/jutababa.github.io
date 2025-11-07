const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cols = 50;
let rows = 25;
let cellWidth = canvas.width / cols;
let cellHeight = canvas.height / rows;

let grid = [];
let stack = [];
let current;
let speed = 20;
let running = false;

// Cell class
class Cell {
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.visited=false;
        this.walls=[true,true,true,true]; // top,right,bottom,left
    }
    draw(){
        const x=this.x*cellWidth;
        const y=this.y*cellHeight;
        ctx.strokeStyle="white";
        ctx.lineWidth=2;
        if(this.walls[0]) drawLine(x,y,x+cellWidth,y);
        if(this.walls[1]) drawLine(x+cellWidth,y,x+cellWidth,y+cellHeight);
        if(this.walls[2]) drawLine(x+cellWidth,y+cellHeight,x,y+cellHeight);
        if(this.walls[3]) drawLine(x,y+cellHeight,x,y);
        if(this.visited){
            ctx.fillStyle="#0ff22a33";
            ctx.fillRect(x,y,cellWidth,cellHeight);
        }
    }
}

function drawLine(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}

// Initialize grid
function initGrid(){
    grid=[];
    for(let y=0;y<rows;y++){
        let row=[];
        for(let x=0;x<cols;x++){
            row.push(new Cell(x,y));
        }
        grid.push(row);
    }
    current = grid[0][0];
    stack=[];
}

// Get unvisited neighbors
function getUnvisitedNeighbors(cell){
    const neighbors=[];
    const {x,y}=cell;
    if(y>0 && !grid[y-1][x].visited) neighbors.push(grid[y-1][x]);
    if(x<cols-1 && !grid[y][x+1].visited) neighbors.push(grid[y][x+1]);
    if(y<rows-1 && !grid[y+1][x].visited) neighbors.push(grid[y+1][x]);
    if(x>0 && !grid[y][x-1].visited) neighbors.push(grid[y][x-1]);
    return neighbors;
}

// Remove walls between two cells
function removeWalls(a,b){
    let x=a.x-b.x;
    let y=a.y-b.y;
    if(x===1){ a.walls[3]=false; b.walls[1]=false; } 
    else if(x===-1){ a.walls[1]=false; b.walls[3]=false; }
    if(y===1){ a.walls[0]=false; b.walls[2]=false; } 
    else if(y===-1){ a.walls[2]=false; b.walls[0]=false; }
}

// Maze generation step
function step(){
    current.visited=true;
    const neighbors = getUnvisitedNeighbors(current);
    if(neighbors.length>0){
        const next = neighbors[Math.floor(Math.random()*neighbors.length)];
        stack.push(current);
        removeWalls(current,next);
        current = next;
    } else if(stack.length>0){
        current = stack.pop();
    } else {
        running=false;
    }
}

// Draw all cells
function drawGrid(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let row of grid) for(let cell of row) cell.draw();
}

// Animation loop
function animate(){
    if(running){
        for(let i=0;i<speed;i++) step();
    }
    drawGrid();
    requestAnimationFrame(animate);
}

// Controls
document.getElementById("startBtn").addEventListener("click",()=>{ running=true; });
document.getElementById("resetBtn").addEventListener("click",()=>{ initGrid(); drawGrid(); });
document.getElementById("speed").addEventListener("input",(e)=>{ speed=parseInt(e.target.value); });

window.addEventListener("resize",()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    cellWidth = canvas.width/cols;
    cellHeight = canvas.height/rows;
    drawGrid();
});

initGrid();
drawGrid();
animate();
