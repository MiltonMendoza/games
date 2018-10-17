function Platform(x, y, w, g, a, c){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = g;
    this.color = c;
    this.angle = a;
    this.rect = [
        {x: this.x, y: this.y},
        {x: this.x + this.width, y: this.y},
        {x: this.x + this.width, y: this.y + this.height},
        {x: this.x, y: this.y + this.height}
    ];
    this.element = document.createElement('div');
    this.draw = function(){
        this.element.style.position = 'absolute';
        this.element.style.height = this.height + 'px';
        this.element.style.width = this.width + 'px';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.backgroundColor = this.color;
        document.getElementById('game-board').appendChild(this.element);     
        this.element.style.transform = 'rotate(' + this.angle + 'deg)';
       
        axis = { x: this.x + this.width / 2, y: this.y + this.height / 2} 
        angleTemp = this.angle * Math.PI/180;        
        tempRect = [];
        for (i in this.rect){
            tempPoint = this.rect[i];
            xx = (tempPoint.x - axis.x) * Math.cos(angleTemp) - (tempPoint.y - axis.y) * Math.sin(angleTemp) + axis.x;
            yy = (tempPoint.x - axis.x) * Math.sin(angleTemp) + (tempPoint.y - axis.y) * Math.cos(angleTemp) + axis.y;
            tempRect.push({x: xx, y: yy});
            
            
        }
        this.rect = tempRect;     
    }
}
