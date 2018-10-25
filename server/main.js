var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = [];
var messages = [];
var game = {
    id: 1,
    turn: 0,
    players: [{
            id: 0,
            slug: [{
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
            slug: [{
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
app.get('/', function(req, res) {
    res.status(200).send('Hi world');
});

io.on('connection', function(socket, ) {
    console.log('Somebody has been connected!');
    socket.emit('messages', messages);
    socket.emit('start-game', game);

    socket.on('move-player', function(data) {
        for (i in players) {
            if (players[i].nickname == data.nickname) {
                players[i] = data;
                break;
            }
        }
        io.sockets.emit('move-players', data);
    });
    socket.on('init-player', function(data) {
        console.log(data);
        players.push(data);
        io.sockets.emit('draw-players', players);
    });
});

server.listen('8080', function() {
    console.log("Server init test...");
});