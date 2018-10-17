var boardSize;
var keyboard = {};
var intv;
var background;
var player;
var manager;
var walls;
var oldPosition = [0, 0];
var joystickStatus = false;
var joystickDirection;
function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
        return true;    
    return false;
}
function drawBoardGame(){
    if (isMobile()){
        boardSize = window.innerWidth;
        document.getElementById('control-board').style.height = '300px';
    } else{
        boardSize = window.innerHeight - 100;
        document.getElementById('control-board').style.height = '1px';
    }
    document.getElementById("game-board").style.height = boardSize + "px";
    document.getElementById("game-board").style.width = boardSize + "px";
}
function levelOne(){
    player = new Hero(-1, boardSize-boardSize/20, boardSize/30, boardSize/30);
    player.limit = {
        right: boardSize - player.width,
        down: boardSize - player.height
    }    
    player.draw();

    walls = [        
        new Platform(0, boardSize/1.25, boardSize/7, boardSize/50, 0, 'blue'),
        new Platform(boardSize/8.5, boardSize/1.09, boardSize/7, boardSize/50, 90, 'blue'),
        new Platform(boardSize/1.4, boardSize/1.09, boardSize/7, boardSize/50, 90, 'blue'),
        new Platform(boardSize/3, boardSize/3, boardSize/6, boardSize/50, 135, 'blue'),
            
    ];
    for (i in walls){
        walls[i].draw();
    }
    if(!isMobile())
        $('#joystick').css('display', 'none');
}
function addKeyboardEvents(){  
    addEvent(document, "keydown", function(e){
        keyboard[e.keyCode] = true;
    });
    addEvent(document, "keyup", function(e){
        keyboard[e.keyCode] = false;
    });
    function addEvent(element, eventName, func){
        if(element.addEventListener){
            element.addEventListener(eventName, func, false)
        } else{
            if(element.attachEvent()){
                element.attachEvent(eventName, func);
            }
        }
    }
}
function checkCollision(){
    var _walls = walls;    
    for (i in _walls){
        var wall = _walls[i];
        try{
            if (hit(wall, player)){                
                //$('#test').html('Made collision...');
                player.x = oldPosition[0];
                player.y = oldPosition[1];
            } else{
                //$('#test').html('Not made collision...');
            }
        } catch(error){}         
    }
}
function hit(a, b){
    console.log(intersect(a.rect, b.rect).length);
    return intersect(a.rect, b.rect).length > 0;
}
addKeyboardEvents();

intv = setInterval(frameLoop, 1000/20);
function frameLoop(){    
    checkCollision();
    movePlayer();
}
drawBoardGame();
levelOne();
manager = nipplejs.create({
    zone: document.getElementById('joystick'),                  // active zone
    color: 'blue',
    multitouch: true,
    mode: 'semi',                   // 'dynamic', 'static' or 'semi'
    size: 100
});
manager.on('start', function(evt, data){
    joystickStatus = true;
});
manager.on('end', function(evt, data){
    joystickStatus = false;
});

manager.on('move', function(evt, data){    
    if (data.angle){
        if (data.angle.degree < 22.5 || data.angle.degree > 337.5)
            joystickDirection = 'right';
        if (data.angle.degree > 22.5 && data.angle.degree < 67.5)
            joystickDirection = 'right-up';        
        if (data.angle.degree > 67.5 && data.angle.degree < 112.5)
            joystickDirection = 'up';
        if (data.angle.degree > 112.5 && data.angle.degree < 157.5)
            joystickDirection = 'up-left';
        if (data.angle.degree > 157.5 && data.angle.degree < 202.5)
            joystickDirection = 'left'; 
        if (data.angle.degree > 202.5 && data.angle.degree < 247.5)
            joystickDirection = 'left-down';    
        if (data.angle.degree > 247.5 && data.angle.degree < 292.5)
            joystickDirection = 'down';
        if (data.angle.degree > 292.5 && data.angle.degree < 337.5)
            joystickDirection = 'down-right';
    }
});

function movePlayer(){
    oldPosition = [player.x, player.y];
    if (isMobile()){
        if (joystickStatus){
            switch(joystickDirection){
                case 'right': player.right(); break;
                case 'right-up': player.right(); player.up(); break;
                case 'up': player.up(); break;
                case 'up-left': player.up(); player.left(); break;
                case 'left': player.left(); break;
                case 'left-down': player.left(); player.down(); break;
                case 'down': player.down(); break;
                case 'down-right': player.down(); player.right(); break;
            }
            console.log(joystickDirection);
        }
    } else{
        if(keyboard[65]) player.left();
        if(keyboard[68]) player.right();  
        if(keyboard[87]) player.up(); 
        if(keyboard[83]) player.down();     
    }    
}
