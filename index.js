var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
var userNum = 0;
var newUsers = [];
io.on('connection', function(socket){
  newUsers.push(socket);
  console.log('A user has connected');
  userNum++;

  if (userNum > 1) {
    socket.broadcast.emit('get-canvas');
      socket.on('send-canvas', function(imgUrl){
        for(var i = 0; i < newUsers.length; i++){
          var thisSocket = newUsers[i];
          thisSocket.emit('receive-canvas', imgUrl);
        }
        newUsers = [];
      });
      console.log(userNum);
  }

  socket.on('disconnect', function(){
    console.log('A user has disconnected');
    userNum--;
  });
  socket.on('first-draw', function(drawObject){
    socket.broadcast.emit('first-draw', drawObject);
  });
});



http.listen(3000, function(){
  console.log('Listening on port 3000');
});
