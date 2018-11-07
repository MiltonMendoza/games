var socket = io.connect('http://172.16.0.134:8080', { 'forceNew': true });
var boardSize;
var keyboard = {};
var intv;
var background;
var player;
var manager;
var walls;
var prevPosition;
var joystickStatus = false;
var joystickDirection;
var players = [];
var avatars = [
    { src: "/img/avatars/000-robot.png" },
    { src: "/img/avatars/001-robot.png" },
    { src: "/img/avatars/002-robot.png" },
    { src: "/img/avatars/003-robot.png" },
    { src: "/img/avatars/004-robot.png" },
    { src: "/img/avatars/005-robot.png" },
    { src: "/img/avatars/006-robot.png" },
    { src: "/img/avatars/007-robot.png" },
    { src: "/img/avatars/008-robot.png" },
    { src: "/img/avatars/009-robot.png" }
]
var indexAvatar = 0;
socket.on('draw-players', function(data) {
    console.log(data);
    for (k in data) {
        if (data[k].nickname != player.nickname) {
            _player = new Hero(data[k].x, data[k].y, data[k].width, data[k].height);
            _player.avatar = data[k].avatar;
            _player.team = data[k].team;
            _player.nickname = data[k].nickname;
            _player.limit = data[k].limit;
            players.push(_player);
            //_player.draw();
        }
    }
    for (k in players) {
        if (players[k].nickname != player.nickname) {
            players[k].draw();
        }
    }
});
socket.on('move-players', function(data) {
    for (k in players) {
        if (players[k].nickname == data.nickname) {
            players[k].x = data.x;
            players[k].y = data.y;
            players[k].angle = data.angle;
            players[k].redraw();
        }
    }
});
$('#select-avatar').attr('src', avatars[indexAvatar].src);

$('#avatar-prev').click(function() {
    indexAvatar--;
    if (indexAvatar < 0)
        indexAvatar = avatars.length - 1;
    $('#select-avatar').attr('src', avatars[indexAvatar].src);
});
$('#avatar-next').click(function() {
    indexAvatar++;
    if (indexAvatar > avatars.length)
        indexAvatar = 0;
    $('#select-avatar').attr('src', avatars[indexAvatar].src);
});
$('#play-game').click(function() {
    console.log($('#select-team-a')[0]);
    if ($('#select-team-a')[0].checked) {
        player.team = 'A';
    }

    if ($('#select-team-b')[0].checked) {
        player.team = 'B';
    }

    player.nickname = Math.floor((Math.random() * 100) + 1);
    player.avatar = avatars[indexAvatar].src;
    player.draw();
    $('#register-player').modal('hide');
    socket.emit('init-player', player);
})


function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        return true;
    return false;
}

function drawBoardGame() {
    if (isMobile()) {
        boardSize = window.innerWidth;
        document.getElementById('control-board').style.height = '300px';
    } else {
        boardSize = window.innerHeight - 100;
        document.getElementById('control-board').style.height = '1px';
    }
    document.getElementById("game-board").style.height = boardSize + "px";
    document.getElementById("game-board").style.width = boardSize + "px";
    document.getElementById("card-content-game").style.width = boardSize + "px";

}

function levelOne() {
    player = new Hero(Math.floor((Math.random() * 100) / 2 + 1), boardSize - boardSize / 20, boardSize / 30, boardSize / 30);
    prevPosition = { x: player.x, y: player.y };
    player.limit = {
        right: boardSize - player.width,
        down: boardSize - player.height
    };
    walls = [
        new Platform(-1, boardSize / 1.16, boardSize / 12, boardSize / 60, 0, 'green'),
        new Platform(boardSize / 11.5, boardSize / 1.053, boardSize / 12, boardSize / 60, 90, 'green'),
        new Platform(boardSize / 1.4, boardSize / 1.09, boardSize / 7, boardSize / 50, 90, 'green'),
        new Platform(boardSize / 3, boardSize / 3, boardSize / 6, boardSize / 50, 135, 'green')
    ];
    for (i in walls)
        walls[i].draw();
    if (!isMobile())
        $('#joystick').css('display', 'none');
    if (!(player.team && player.avatar)) {
        $('#register-player').modal('show');
    }
}

function addKeyboardEvents() {
    addEvent(document, "keydown", function(e) {
        keyboard[e.keyCode] = true;
        if (e.keyCode == 84) {
            player.shot();
        }
        movePlayer();
    });
    addEvent(document, "keyup", function(e) {
        keyboard[e.keyCode] = false;
    });
    addEvent(document.getElementById('shot-player'), 'touchstart', function() {
        player.shot();
    });

    function addEvent(element, eventName, func) {
        if (element.addEventListener) {
            element.addEventListener(eventName, func, false)
        } else {
            if (element.attachEvent()) {
                element.attachEvent(eventName, func);
            }
        }
    }
}

function checkCollision() {
    for (i in walls) {
        try {
            if (intersect(walls[i].rect, player.rect).length != 0) {

                player.x = prevPosition.x;
                player.y = prevPosition.y;
                player.reloadRect();
            }
        } catch (error) {
            alert('error');
        }
    }
}
addKeyboardEvents();

intv = setInterval(function() {
    if (isMobile())
        movePlayer();
    moveShots();
}, 30);

drawBoardGame();
levelOne();
manager = nipplejs.create({
    zone: document.getElementById('joystick'), // active zone
    color: 'blue',
    multitouch: false,
    mode: 'semi', // 'dynamic', 'static' or 'semi'
    size: 100
});
manager.on('start', function(evt, data) {
    joystickStatus = true;
});
manager.on('end', function(evt, data) {
    joystickStatus = false;
});

manager.on('move', function(evt, data) {
    if (data.angle) {
        if (data.angle.degree < 22.5 || data.angle.degree > 337.5) {
            joystickDirection = 'right';
            player.angle = 90;
        }
        if (data.angle.degree > 22.5 && data.angle.degree < 67.5) {
            joystickDirection = 'right-up';
            player.angle = 45;
        }
        if (data.angle.degree > 67.5 && data.angle.degree < 112.5) {
            joystickDirection = 'up';
            player.angle = 0;
        }
        if (data.angle.degree > 112.5 && data.angle.degree < 157.5) {
            joystickDirection = 'up-left';
            player.angle = 315;
        }
        if (data.angle.degree > 157.5 && data.angle.degree < 202.5) {
            joystickDirection = 'left';
            player.angle = 270;
        }
        if (data.angle.degree > 202.5 && data.angle.degree < 247.5) {
            joystickDirection = 'left-down';
            player.angle = 225;
        }
        if (data.angle.degree > 247.5 && data.angle.degree < 292.5) {
            joystickDirection = 'down';
            player.angle = 180;
        }
        if (data.angle.degree > 292.5 && data.angle.degree < 337.5) {
            joystickDirection = 'down-right';
            player.angle = 135;
        }
    }
});

function checkCollisionShot(shot) {
    if (
        (shot.rect[1].x > boardSize - player.vShot) ||
        (shot.rect[2].y > boardSize - player.vShot) ||
        (shot.rect[0].y < 0) ||
        (shot.rect[0].x < 0)
    ) {
        shot.element.remove();
        return true;
    }
    for (j in walls) {
        if (intersect(walls[j].rect, shot.rect).length != 0) {
            shot.element.remove();
            return true;
        }
    }

    return false;
}

function moveShots() {
    for (i in player.shots) {
        if (!checkCollisionShot(player.shots[i])) {
            if (player.shots[i].angle == 90) {
                player.shots[i].right(player.vShot);
            }
            if (player.shots[i].angle == 45) {
                player.shots[i].right(player.vShot);
                player.shots[i].up(player.vShot);
            }
            if (player.shots[i].angle == 0) {
                player.shots[i].up(player.vShot);
            }
            if (player.shots[i].angle == 315) {
                player.shots[i].left(player.vShot);
                player.shots[i].up(player.vShot);
            }
            if (player.shots[i].angle == 270) {
                player.shots[i].left(player.vShot);
            }
            if (player.shots[i].angle == 225) {
                player.shots[i].left(player.vShot);
                player.shots[i].down(player.vShot);
            }
            if (player.shots[i].angle == 180) {
                player.shots[i].down(player.vShot);
            }
            if (player.shots[i].angle == 135) {
                player.shots[i].right(player.vShot);
                player.shots[i].down(player.vShot);
            }
        } else {
            player.shots.splice(i, 1);
        }
    }
}

function movePlayer() {
    prevPosition = { x: player.x, y: player.y };

    if (isMobile()) {
        if (joystickStatus) {
            switch (joystickDirection) {
                case 'right':
                    player.right();
                    break;
                case 'right-up':
                    player.right();
                    checkCollision();
                    prevPosition = { x: player.x, y: player.y };
                    player.up();
                    break;
                case 'up':
                    player.up();
                    break;
                case 'up-left':
                    player.up();
                    checkCollision();
                    prevPosition = { x: player.x, y: player.y };
                    player.left();
                    break;
                case 'left':
                    player.left();
                    break;
                case 'left-down':
                    player.left();
                    checkCollision();
                    prevPosition = { x: player.x, y: player.y };
                    player.down();
                    break;
                case 'down':right
                    player.down();
                    break;
                case 'down-right':
                    player.down();
                    checkCollision();
                    prevPosition = { x: player.x, y: player.y };
                    player.right();
                    break;
            }
            checkCollision();
        }
    } else {       
        if (keyboard[68] && !keyboard[87] && !keyboard[83]) {
            player.angle = 90;
            player.right();
        }
        if (keyboard[68] && keyboard[87]){
            player.angle = 45;
            player.right();
            player.up();
        }
        if (keyboard[87] && !keyboard[68] && !keyboard[65]) {
            player.angle = 0;
            player.up();
        }
        if (keyboard[65] && keyboard[87]){
            player.angle = 315;
            player.left();
            player.up();
        }
        if (keyboard[65] && !keyboard[87] && !keyboard[83]) {
            player.angle = 270;
            player.left();
        }
        if (keyboard[65] && keyboard[83]){
            player.angle = 225;
            player.left();
            player.down();
        }
        if (keyboard[83] && !keyboard[65] && !keyboard[68]) {
            player.angle = 180;
            player.down();
        }
        if (keyboard[68] && keyboard[83]){
            player.angle = 135;
            player.right();
            player.down();
        }
    }
    socket.emit('move-player', player);
}