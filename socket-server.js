var server = require('ws').Server;
var wss = new server({port:5032});

var app = {};
var messages = [];

wss.on('connection',function(ws){
  console.log(`client connected: ${wss.clients.size}`)

  ws.on('message', function(message){
    console.log("Received: " + message);
    const data = JSON.parse(message);
    console.log(data);

    messages.push(data);
    console.log(messages.length);

    // そのまま配信
    wss.clients.forEach(ws => {
      ws.send(message);
    })
  });

  ws.on('close',function(){
    console.log('connection closed');
  });

  ws.send(JSON.stringify({
    is_reload: true,
    data: messages.slice(messages.length - 1000),
  }))
});
