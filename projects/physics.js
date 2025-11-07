// module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

// create engine
const engine = Engine.create();
const world = engine.world;

// create renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#0a0a0a'
    }
});

Render.run(render);

// create runner
const runner = Runner.create();
Runner.run(runner, engine);

// Add floor and walls
const floor = Bodies.rectangle(window.innerWidth/2, window.innerHeight+50, window.innerWidth, 100, { isStatic:true, render:{fillStyle:'#555'} });
const leftWall = Bodies.rectangle(-50, window.innerHeight/2, 100, window.innerHeight, { isStatic:true });
const rightWall = Bodies.rectangle(window.innerWidth+50, window.innerHeight/2, 100, window.innerHeight, { isStatic:true });
Composite.add(world, [floor, leftWall, rightWall]);

// Mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse, constraint: { stiffness: 0.2, render:{visible:false} }});
Composite.add(world, mouseConstraint);
render.mouse = mouse;

// interactive functions
function addCircle() {
    const radius = Math.random()*30 + 15;
    const circle = Bodies.circle(Math.random()*window.innerWidth, 0, radius, { 
        restitution: 0.8, 
        render: { fillStyle: `hsl(${Math.random()*360},100%,50%)` }
    });
    Composite.add(world, circle);
}

function addBox() {
    const size = Math.random()*40 + 20;
    const box = Bodies.rectangle(Math.random()*window.innerWidth, 0, size, size, {
        restitution: 0.6,
        render: { fillStyle: `hsl(${Math.random()*360},100%,50%)` }
    });
    Composite.add(world, box);
}

// Controls
document.getElementById('addCircle').addEventListener('click', addCircle);
document.getElementById('addBox').addEventListener('click', addBox);
document.getElementById('gravity').addEventListener('input', (e)=>{
    engine.world.gravity.y = parseFloat(e.target.value);
});

// spawn random shapes continuously
setInterval(()=>{
    if(Math.random()<0.5) addCircle(); else addBox();
}, 500);

// responsive
window.addEventListener('resize', ()=>{
    Render.lookAt(render, {min:{x:0,y:0}, max:{x:window.innerWidth, y:window.innerHeight}});
});
