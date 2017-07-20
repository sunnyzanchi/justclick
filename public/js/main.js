const ws = window.location.protocol === 'http:' ?
      new WebSocket(`ws://${window.location.host}`) :
      new WebSocket(`wss://${window.location.host}`);

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const circles = new Set;
const colors = [
	'#FF9800',
  '#FFEB3B',
  '#4CAF50',
  '#2196F3',
  '#9C27B0',
  '#f44336'
];

const drawCircle = function drawCircle(x, y){
  circles.add({
    x,
    y,
    r: 10,
    c: randomElement(colors)
  });
}

const randomElement = function randomElement(array){
  return array[Math.floor(Math.random() * array.length)];
}

var heldDown = false;

canvas.addEventListener('mousedown', function({x, y}){
  heldDown = true;
  drawCircle(x, y);
});

canvas.addEventListener('mouseup', function({x, y}){
  heldDown = false;
});

canvas.addEventListener('mousemove', function({x, y}){
  if(heldDown){
    ws.send(`${x},${y}`);
    drawCircle(x, y);
  }
});

var count = 0;
setInterval(function(){
  console.log(count);
  count = 0;
}, 1000);

ws.onmessage = function({data}){
  count++;
  const [x, y] = data.split(',');

  if(circles.size < 300){
    drawCircle(x, y);
  }
}

const render = function render(){
  ctx.clearRect(0, 0, 600, 600);

  for(let circle of circles){
    let {x, y, r, c} = circle;

    if(r > 600){
      circles.delete(circle);
    }

    ctx.strokeStyle = c;
    ctx.lineWidth = 40 / r;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
    ctx.stroke();

    circle.r += r * .05;
  }

  requestAnimationFrame(render);
}

render();
