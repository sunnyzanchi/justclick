var ws;

if(window.location.protocol === 'http:')
  ws = new WebSocket(`ws://${window.location.host}`);
if(window.location.protocol === 'https:')
  ws = new WebSocket(`wss://${window.location.host}`);

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const drawCircle = function drawCircle(x, y){
  const r = 4;

  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
  ctx.fill();
}

var heldDown = false;

canvas.addEventListener('mousedown', function({x, y}){
  heldDown = true;
});

canvas.addEventListener('mouseup', function({x, y}){
  heldDown = false;
});

canvas.addEventListener('mousemove', function({x, y}){
  if(heldDown){
    ws.send(`${x},${y}`);
    drawCircle(x, y);
  }
})

ws.onmessage = function({data}){
  const [x, y] = data.split(',');

  drawCircle(x, y);
}
