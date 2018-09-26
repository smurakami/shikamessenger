var server = require('ws').Server;
var wss = new server({port:5031});

var app = {};

wss.on('connection',function(ws){
  console.log(`client connected: ${wss.clients.size}`)

  ws.on('message', function(message){
    console.log("Received: " + message);
    const data = JSON.parse(message);
    console.log(data);

    // そのまま配信
    wss.clients.forEach(ws => {
      ws.send(message);
    })
  });

  ws.on('close',function(){
    console.log('connection closed');
  });
});

