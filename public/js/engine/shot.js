function Shot(x, y){
    this.size = 6;
    this.x = x - this.size / 2;
    this.y = y - this.size / 2;    
    this.color = 'black';
    this.limit = {};
    this.data = {};
    this.angle = 0;
    this.element = document.createElement('div');
    this.rect = [
        {x: this.x , y: this.y},
        {x: this.x + this.size, y: this.y},
        {x: this.x + this.size, y: this.y + this.size},
        {x: this.x, y: this.y + this.size}
    ];
    this.right = function(vel){
        this.x += vel; 
        this.element.style.left = this.x + 'px';
        this.reloadRect();
    }
    this.left = function(vel){
        this.x -= vel; 
        this.element.style.left = this.x + 'px';
        this.reloadRect();           
    }
    this.up = function(vel){
        this.y -= vel; 
        this.element.style.top = this.y + 'px';
        this.reloadRect();            
    }
    this.down = function(vel){      
        this.y += vel; 
        this.element.style.top = this.y + 'px';
        this.reloadRect();
    }  
    this.draw = function(){
        this.element.style.position = 'absolute';
        this.element.style.height = this.size + 'px';
        this.element.style.width = this.size + 'px';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.backgroundColor = this.color;
        this.element.style.borderRadius = '50%';
        document.getElementById('game-board').appendChild(this.element);    
    }
    this.reloadRect = function(){
        this.rect = [
            {x: this.x, y: this.y},
            {x: this.x + this.size, y: this.y},
            {x: this.x + this.size, y: this.y + this.size},
            {x: this.x, y: this.y + this.size}
        ];
    }
}