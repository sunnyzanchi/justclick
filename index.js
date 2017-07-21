const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);

app.use(express.static('public'));

const connections = new Set;

expressWs.getWss().on('connection', function addConnection(ws){
  connections.add(ws);
});

app.ws('/', function handler(ws, req){

  ws.on('message', function broadcast(e){
    for(let conn of connections){
      if(conn !== ws){
        conn.send(e);
      }
    }
  });

  ws.on('close', function close(e){
    connections.delete(ws);
  });

});

app.listen(3000);
