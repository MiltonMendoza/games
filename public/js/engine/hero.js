function Hero(x, y, w, h){
    this.team;
    this.nickname;
    this.avatar;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.v = 1;
    this.vShot = 3;
    this.maxShots = 5;
    this.limit = {};
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
        this.element.style.backgroundImage = 'url("' + this.avatar + '")';
        this.element.style.backgroundSize = '100% 100%';
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
        $('#display-nickname').html(this.nickname);
        $('#display-team').html(this.team);
        this.rect = tempRect;
    }
    this.reloadRect = function(){
        this.rect = [
            {x: this.x, y: this.y},
            {x: this.x + this.width, y: this.y},
            {x: this.x + this.width, y: this.y + this.height},
            {x: this.x, y: this.y + this.height}
        ];
        this.element.style.transform = 'rotate(' + this.angle + 'deg)';   
    }
    this.redraw = function(){
        this.element.style.transform = 'rotate(' + this.angle + 'deg)'; 
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px'; 
    }
    this.shot = function(){
        if (this.shots.length < this.maxShots){
            var _shot = new Shot(this.x + this.width / 2, this.y + this.height / 2);
            _shot.draw();
            _shot.angle = this.angle;
            player.shots.push(_shot); 
        }          
    }
}

