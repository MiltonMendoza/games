function Hero(x, y, w, h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = 'gray';
    this.v = 1;
    this.vShot = 5;
    this.limit = {};
    this.data = {};
    this.angle = 0;
    this.element = document.createElement('div');
    this.shots = [];
    this.rect = [
        {x: this.x, y: this.y},
        {x: this.x + this.width, y: this.y},
        {x: this.x + this.width, y: this.y + this.height},
        {x: this.x, y: this.y + this.height}
    ];
    this.right = function(){
        if (this.x < this.limit.right){
            this.x += this.v; 
            this.element.style.left = this.x + 'px';
            this.reloadRect();            
        } 
    }
    this.left = function(){
        if (this.x > 0){
            this.x -= this.v; 
            this.element.style.left = this.x + 'px';
            this.reloadRect();           
        } 
    }
    this.up = function(){
        if (this.y > 0){
            this.y -= this.v; 
            this.element.style.top = this.y + 'px';
            this.reloadRect();            
        } 
    }
    this.down = function(){      
        if (this.y < this.limit.down){
            this.y += this.v; 
            this.element.style.top = this.y + 'px';
            this.reloadRect();
        } 
    }  
    this.draw = function(){
        this.element.style.position = 'absolute';
        this.element.style.height = this.height + 'px';
        this.element.style.width = this.width + 'px';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        //this.element.style.backgroundColor = this.color;
        
        this.element.style.backgroundImage = 'url("/img/robot.png")';
        this.element.style.backgroundSize = '100% 100%';
        //this.element.style.borderRadius = '30%';
        document.getElementById('game-board').appendChild(this.element); 
        this.element.style.transform = 'rotate(' + this.angle + 'deg)';   
        axis = { x: this.x + this.width / 2, y: this.y + this.height / 2} 
        angleTemp = this.angle * Math.PI/180;        
        tempRect = [];
        for (i in this.rect){
            tempRect.push({
                x: (this.rect[i].x - axis.x) * Math.cos(angleTemp) - (this.rect[i].y - axis.y) * Math.sin(angleTemp) + axis.x,
                y: (this.rect[i].x - axis.x) * Math.sin(angleTemp) + (this.rect[i].y - axis.y) * Math.cos(angleTemp) + axis.y
            });            
        }
        this.rect = tempRect;
    }
    this.reloadRect = function(){
        this.rect = [
            {x: this.x, y: this.y},
            {x: this.x + this.width, y: this.y},
            {x: this.x + this.width, y: this.y + this.height},
            {x: this.x, y: this.y + this.height}
        ];

        /*axis = { x: this.x + this.width / 2, y: this.y + this.height / 2} 
        angleTemp = this.angle * Math.PI/180;        
        tempRect = [];
        for (i in this.rect){
            tempRect.push({
                x: (this.rect[i].x - axis.x) * Math.cos(angleTemp) - (this.rect[i].y - axis.y) * Math.sin(angleTemp) + axis.x,
                y: (this.rect[i].x - axis.x) * Math.sin(angleTemp) + (this.rect[i].y - axis.y) * Math.cos(angleTemp) + axis.y
            });            
        }
        this.rect = tempRect;*/
        /*for(i in this.rect){
            $('#game-board').append('<div style="position: absolute; width:3px; height:3px; left: ' + this.rect[i].x + 'px; top: ' + this.rect[i].y + 'px; background-color: black"> </div>')           
        }*/
        //axis = { x: this.x + this.width / 2, y: this.y + this.height / 2} 
        //$('#game-board').append('<div style="position: absolute; width:3px; height:3px; left: ' + axis.x + 'px; top: ' + axis.y + 'px; background-color: black"> </div>')           
        this.element.style.transform = 'rotate(' + this.angle + 'deg)';   
    }
    this.shot = function(){
        axis = { x: this.x + this.width / 2, y: this.y + this.height / 2};
        shot = document.createElement('div');
        shot.style.position = 'absolute';
        shot.style.height = 5 + 'px';
        shot.style.width = 5 + 'px';
        shot.style.left = axis.x + 'px';
        shot.style.top = axis.y + 'px';
        shot.style.backgroundColor = 'black';
        shot.style.borderRadius = '30%';
        document.getElementById('game-board').appendChild(shot); 
        shot.angle = this.angle;
        this.shots.push(shot);        
    }
}

