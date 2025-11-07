const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rows = 25;
const cols = 50;
const cellWidth = canvas.width/cols;
const cellHeight = canvas.height/rows;

let grid = [];
let openSet = [];
let closedSet = [];
let path = [];
let start, end;
let running=false;
let speed=20;

// Tools
const toolSelect = document.getElementById("tool");
let currentTool = "wall";
let mouseDown=false;
let dragStart = null;

class Node{
    constructor(x,y){
        this.x=x; this.y=y;
        this.f=0; this.g=0; this.h=0;
        this.neighbors=[];
        this.previous=null;
        this.wall=false;
    }
    show(color){
        ctx.fillStyle=color;
        ctx.fillRect(this.x*cellWidth,this.y*cellHeight,cellWidth-1,cellHeight-1);
    }
    addNeighbors(grid){
        const {x,y} = this;
        if(x>0) this.neighbors.push(grid[y][x-1]);
        if(x<cols-1) this.neighbors.push(grid[y][x+1]);
        if(y>0) this.neighbors.push(grid[y-1][x]);
        if(y<rows-1) this.neighbors.push(grid[y+1][x]);
    }
}

function heuristic(a,b){ return Math.abs(a.x-b.x)+Math.abs(a.y-b.y); }

function initGrid(){
    grid=[];
    for(let y=0;y<rows;y++){
        let row=[];
        for(let x=0;x<cols;x++){
            row.push(new Node(x,y));
        }
        grid.push(row);
    }
    for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) grid[y][x].addNeighbors(grid);
    start=grid[0][0]; end=grid[rows-1][cols-1];
    start.wall=false; end.wall=false;
    openSet=[start]; closedSet=[]; path=[];
}

function drawGrid(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let row of grid){
        for(let node of row){
            if(node.wall) node.show("#333");
            else node.show("#111");
        }
    }
    closedSet.forEach(n=>n.show("#ff0044"));
    openSet.forEach(n=>n.show("#00d4ff"));
    path.forEach(n=>n.show("#0ff"));
    start.show("#0f0");
    end.show("#f00");
}

function step(){
    if(openSet.length>0){
        let winner=0;
        for(let i=1;i<openSet.length;i++) if(openSet[i].f<openSet[winner].f) winner=i;
        let current=openSet[winner];
        if(current===end){
            path=[];
            let temp=current;
            while(temp){ path.push(temp); temp=temp.previous; }
            running=false; return;
        }
        openSet.splice(winner,1); closedSet.push(current);
        for(let neighbor of current.neighbors){
            if(!closedSet.includes(neighbor)&&!neighbor.wall){
                let tempG=current.g+1;
                let newPath=false;
                if(openSet.includes(neighbor)){
                    if(tempG<neighbor.g){ neighbor.g=tempG; newPath=true; }
                } else { neighbor.g=tempG; newPath=true; openSet.push(neighbor); }
                if(newPath){ neighbor.h=heuristic(neighbor,end); neighbor.f=neighbor.g+neighbor.h; neighbor.previous=current;}
            }
        }
    } else { running=false; return; }
}

// Mouse interaction for tools
canvas.addEventListener("mousedown",(e)=>{ mouseDown=true; dragStart=getMouseCell(e); applyTool(dragStart); });
canvas.addEventListener("mouseup",(e)=>{ mouseDown=false; dragStart=null; });
canvas.addEventListener("mousemove",(e)=>{ if(mouseDown){ applyTool(getMouseCell(e)); }});

function getMouseCell(e){
    const rect=canvas.getBoundingClientRect();
    const x=Math.floor((e.clientX-rect.left)/cellWidth);
    const y=Math.floor((e.clientY-rect.top)/cellHeight);
    return {x,y};
}

function applyTool(cell){
    const node = grid[cell.y][cell.x];
    if(!node) return;
    if(currentTool==="wall") node.wall=true;
    else if(currentTool==="erase") node.wall=false;
    else if(currentTool==="start"){
        start=node; start.wall=false;
    } else if(currentTool==="end"){
        end=node; end.wall=false;
    } else if(currentTool==="line" && dragStart){
        drawLine(dragStart, cell, true);
    } else if(currentTool==="square" && dragStart){
        drawSquare(dragStart, cell, true);
    }
}

function drawLine(a,b,fill=true){
    let x0=a.x, y0=a.y, x1=b.x, y1=b.y;
    const dx=Math.abs(x1-x0), dy=Math.abs(y1-y0);
    const sx=x0<x1?1:-1, sy=y0<y1?1:-1;
    let err=dx-dy;
    while(true){
        if(fill) grid[y0][x0].wall=true; else grid[y0][x0].wall=false;
        if(x0===x1 && y0===y1) break;
        let e2=2*err;
        if(e2> -dy){ err-=dy; x0+=sx; }
        if(e2<dx){ err+=dx; y0+=sy; }
    }
}

function drawSquare(a,b,fill=true){
    const xStart=Math.min(a.x,b.x), xEnd=Math.max(a.x,b.x);
    const yStart=Math.min(a.y,b.y), yEnd=Math.max(a.y,b.y);
    for(let y=yStart;y<=yEnd;y++) for(let x=xStart;x<=xEnd;x++) grid[y][x].wall=fill;
}

// Event listeners
toolSelect.addEventListener("change",(e)=>{ currentTool=e.target.value; });
document.getElementById("startBtn").addEventListener("click",()=>{ running=true; });
document.getElementById("resetBtn").addEventListener("click",()=>{ initGrid(); drawGrid(); });
document.getElementById("speed").addEventListener("input",(e)=>{ speed=parseInt(e.target.value); });
window.addEventListener("resize",()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; });

initGrid();
function animate(){ if(running) for(let s=0;s<speed;s++) step(); drawGrid(); requestAnimationFrame(animate); }
animate();
