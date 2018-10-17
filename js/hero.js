function Hero(x, y, w, h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = 'gray';
    this.v = 3;
    this.direction = 1;
    this.limit = {}
    this.counter = 0;
    this.element = document.createElement('div');
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
        this.element.style.backgroundColor = this.color;
        //this.element.style.borderRadius = '50%';
        document.getElementById('game-board').appendChild(this.element);    
    }
    this.reloadRect = function(){
        this.rect = [
            {x: this.x, y: this.y},
            {x: this.x + this.width, y: this.y},
            {x: this.x + this.width, y: this.y + this.height},
            {x: this.x, y: this.y + this.height}
        ];
    }
}

