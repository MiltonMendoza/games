var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var messages = [];
var game = {
    id: 1,
    turn: 0,
    players: [
        {
            id: 0,
            slug: [
                {
                    color: "yellow",
                    position: 0
                },
                {
                    color: "yellow",
                    position: 0
                },
                {
                    color: "yellow",
                    position: 0
                },
                {
                    color: "yellow",
                    position: 0
                }
            ]
        },
        {
            id: 1,
            slug: [
                {
                    color: "blue",
                    position: 0
                },
                {
                    color: "blue",
                    position: 0
                },
                {
                    color: "blue",
                    position: 0
                },
                {
                    color: "blue",
                    position: 0
                }
            ]
        }
    ]
}
app.use(express.static('public'));
app.get('/', function(req, res){
    res.status(200).send('Hi world');
});

io.on('connection', function(socket,){
    console.log('Somebody has been connected!');
    socket.emit('messages', messages);
    socket.emit('start-game', game);

    socket.on('new-message', function(data){
        messages.push(data);
        io.sockets.emit('messages', messages);
    });
    socket.on('throw-dice', function(){
        var dice = Math.floor(Math.random() * 6) + 1;
        io.sockets.emit('display-dice', dice);
    });
});

server.listen('7878', function(){
    console.log("Server init test...");
});