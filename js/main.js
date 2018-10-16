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
        document.getElementById('control-board').style.height = '200px';
    } else{
        boardSize = window.innerHeight - 100;
        document.getElementById('control-board').style.height = '1px';
    }
    document.getElementById("game-board").style.height = boardSize + "px";
    document.getElementById("game-board").style.width = boardSize + "px";
}
function levelOne(){
    /*background = new Kinetic.Layer();
    player = new Hero();
    player.setX(0);
    player.setY(stage.getHeight() - player.getHeight());
    player.limitRight = stage.getWidth() - player.getWidth();
    player.limit = {
        right: stage.getWidth() - player.getWidth(),
        left: 0,
        top: 0,
        botton: stage.getHeight() - player.getHeight()
    }
    walls.add(new Platform(0, 300, 100, 50));
    walls.add(new Platform(55, 500, 50, 300));

    background.add(player);
    background.add(walls);
    stage.add(background); */ 
    player = new Hero(0, boardSize-boardSize/20, boardSize/20, boardSize/20);
    player.limit = {
        right: boardSize - player.width,
        down: boardSize - player.height
    }    
    player.draw();

    walls = [
        new Platform(boardSize/8, boardSize/4, boardSize/25, boardSize/3, 45, 'blue'),
        new Platform(boardSize/8, boardSize/4, boardSize/25, boardSize/3, 1, 'blue'),
        new Platform(boardSize/3, boardSize/3, boardSize/3, boardSize/25, 45, 'blue'),
        new Platform(boardSize/7, boardSize/5, boardSize/3, boardSize/25, 1, 'blue')        
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
/*
function hit(a, b){
    var hit = false;
    if (b.getX() + b.getWidth() >= a.getX() && b.getX() < a.getX() + a.getWidth())
        if (b.getY() + b.getHeight() >= a.getY() && b.getY() < a.getY() + a.getHeight())
            hit = true;
    if (b.getX() <= a.getX() && b.getX() + b.getWidth >= a.getX() + a.getWidth())
        if (b.getY() <= a.getY() && b.getY() + b.getHeight() >= a.getY() + a.getHeight())
            hit = true;
    if (a.getX() <= b.getX() && a.getX() + a.getWidth() >= b.getX() + b.getWidth())
        if (a.getY() <= b.getY() && a.getY() + a.getHeight() >= b.getY() + b.getHeight())
            hit = true;
    return hit;    
}*/
function hit_(a, b){
    var hit = false;
    if (b.x + b.width >= a.x && b.x < a.x + a.width)
        if (b.y + b.height >= a.y && b.y < a.y + a.height)
            hit = true;
    if (b.x <= a.x && b.x + b.width >= a.x + a.width)
        if (b.y <= a.y && b.y + b.height >= a.y + a.height)
            hit = true;
    if (a.x <= b.x && a.x + a.width >= b.x + b.width)
        if (a.y <= b.y && a.y + a.height >= b.y + b.height)
            hit = true;
    return hit;    
}
function hit__(a, b){   
    var x11 = a.x,
    y11 = a.y,
    x12 = a.x + a.width,
    y12 = a.y + a.height,
    x21 = b.x,
    y21 = b.y,
    x22 = b.x + b.width,
    y22 = b.y + b.height;
    x_overlap = Math.max(0, Math.min(x12,x22) - Math.max(x11,x21));
    y_overlap = Math.max(0, Math.min(y12,y22) - Math.max(y11,y21));
    $('#test').html(x_overlap * y_overlap);
    console.log(x_overlap * y_overlap);
    return (x_overlap * y_overlap) > 0
}
function hit(a, b){
    pol_a = [
        { x: a.x, y: a.y},
        { x: a.x + a.width, y: a.y},
        { x: a.x, y: a.y + a.height},
        { x: a.x + a.width, y: a.y + a.height}
    ]
    pol_b = [
        { x: b.x, y: b.y},
        { x: b.x + b.width, y: b.y},
        { x: b.x, y: b.y + b.height},
        { x: b.x + b.width, y: b.y + b.height}
    ]
    
    return intersect(pol_a, pol_b).length > 0;
}
addKeyboardEvents();

intv = setInterval(frameLoop, 1000/20);
function frameLoop(){    
    //stage.draw();
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
