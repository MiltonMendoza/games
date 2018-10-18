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
    player = new Hero(0, boardSize-boardSize/20, boardSize/30, boardSize/30);
    prevPosition = {x: player.x, y: player.y};
    player.limit = {
        right: boardSize - player.width,
        down: boardSize - player.height
    }    
    player.draw();

    walls = [        
        new Platform(0, boardSize/1.16, boardSize/12, boardSize/60, 0, 'gray'),
        new Platform(boardSize/11.5, boardSize/1.053, boardSize/12, boardSize/60, 90, 'gray'),
        new Platform(boardSize/1.4, boardSize/1.09, boardSize/7, boardSize/50, 90, 'gray'),
        new Platform(boardSize/3, boardSize/3, boardSize/6, boardSize/50, 135, 'gray')            
    ];
    for (i in walls)
        walls[i].draw();    
    if(!isMobile())
        $('#joystick').css('display', 'none');
}
function addKeyboardEvents(){  
    addEvent(document, "keydown", function(e){
        keyboard[e.keyCode] = true;
        if (e.keyCode == 84){
            player.shot();
        }
        movePlayer();
    });
    addEvent(document, "keyup", function(e){
        keyboard[e.keyCode] = false;
    });
    addEvent(document.getElementById('shot-player'), 'touchstart', function(){
        //alert('touch');
        player.shot();
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
    for (i in walls){
        try{
            if (intersect(walls[i].rect, player.rect).length != 0){                
                
                player.x = prevPosition.x;
                player.y = prevPosition.y;
                player.reloadRect();
            } else{
                //$('#test').html(intersect(walls[i].rect, player.rect).length);
            }
        } catch(error){
            alert('error');
        }         
    }
}
addKeyboardEvents();

intv = setInterval(function (){    
    if(isMobile())
        movePlayer();
    moveShots();
}, 50);

drawBoardGame();
levelOne();
manager = nipplejs.create({
    zone: document.getElementById('joystick'),                  // active zone
    color: 'blue',
    multitouch: false,
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
        if (data.angle.degree < 22.5 || data.angle.degree > 337.5){
            joystickDirection = 'right';
            player.angle = 180;
        }            
        if (data.angle.degree > 22.5 && data.angle.degree < 67.5){
            joystickDirection = 'right-up';   
            player.angle = 135;
        }                 
        if (data.angle.degree > 67.5 && data.angle.degree < 112.5){
            joystickDirection = 'up';
            player.angle = 90;
        }            
        if (data.angle.degree > 112.5 && data.angle.degree < 157.5){
            joystickDirection = 'up-left';
            player.angle = 45;
        }            
        if (data.angle.degree > 157.5 && data.angle.degree < 202.5){
            joystickDirection = 'left'; 
            player.angle = 0;
        }            
        if (data.angle.degree > 202.5 && data.angle.degree < 247.5){
            joystickDirection = 'left-down';    
            player.angle = 315;
        }            
        if (data.angle.degree > 247.5 && data.angle.degree < 292.5){
            joystickDirection = 'down';
            player.angle = 270;
        }            
        if (data.angle.degree > 292.5 && data.angle.degree < 337.5){
            joystickDirection = 'down-right';
            player.angle = 225;
        }            
    }
});
function checkCollisionShot(shot){
    if(
        (parseInt(shot.style.left.replace('px', '')) + parseInt(shot.style.width.replace('px', '')) > boardSize - player.vShot) ||
        (parseInt(shot.style.top.replace('px', '')) + parseInt(shot.style.height.replace('px', '')) > boardSize - player.vShot) ||
        (parseInt(shot.style.top.replace('px', '')) < 0) ||
        (parseInt(shot.style.left.replace('px', '')) < 0)
    ){
        shot.remove();
        return true;
    }
        
    return false;
}
function moveShots(){
    for (i in player.shots){
        if (!checkCollisionShot(player.shots[i])){
            if (player.shots[i].angle == 180){
                player.shots[i].style.left = (parseInt(player.shots[i].style.left.replace('px', '')) + player.vShot) + 'px';
            }
            if (player.shots[i].angle == 0){
                player.shots[i].style.left = (parseInt(player.shots[i].style.left.replace('px', '')) - player.vShot) + 'px';
            }
            if (player.shots[i].angle == 90){
                player.shots[i].style.top = (parseInt(player.shots[i].style.top.replace('px', '')) - player.vShot) + 'px';
            }
            if (player.shots[i].angle == 270){
                player.shots[i].style.top = (parseInt(player.shots[i].style.top.replace('px', '')) + player.vShot) + 'px';
            }
        } else{
            player.shots.splice(i, 1);            
        }
        
    }
}
function movePlayer(){
    prevPosition = {x: player.x, y: player.y};
    
    if (isMobile()){
        if (joystickStatus){
            switch(joystickDirection){
                case 'right': 
                    player.right(); 
                    break;
                case 'right-up': 
                    player.right();
                    checkCollision();
                    prevPosition = {x: player.x, y: player.y}; 
                    player.up(); 
                    break;
                case 'up': 
                    player.up(); 
                    break;
                case 'up-left': 
                    player.up(); 
                    checkCollision(); 
                    prevPosition = {x: player.x, y: player.y}; 
                    player.left(); 
                    break;
                case 'left': 
                    player.left(); 
                    break;
                case 'left-down': 
                    player.left(); 
                    checkCollision(); 
                    prevPosition = {x: player.x, y: player.y}; 
                    player.down(); 
                    break;
                case 'down': 
                    player.down(); 
                    break;
                case 'down-right': 
                    player.down();
                    checkCollision(); 
                    prevPosition = {x: player.x, y: player.y}; 
                    player.right();                      
                    break;
            }
            checkCollision();
        }
    } else{
        if(keyboard[65]){
            player.left();
            player.angle = 0;
        } 
        if(keyboard[68]) {
            player.right(); 
            player.angle = 180;
        }
             
        if(keyboard[87]) player.up(); 
        if(keyboard[83]) player.down();     
    }
        
}
