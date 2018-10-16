function Platform(x, y, w, g, a, c){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = g;
    this.color = c;
    this.angle = a;
    this.draw = function(){
        $('#game-board').append('<div style="position: absolute; background-color: ' + this.color + 
            '; width: ' + this.width + 
            'px; height: ' + this.height + 
            'px; top: ' + this.y + 
            'px; left: ' + this.x +
            'px; transform:rotate(' + this.angle + 'deg)"></div>');
    }
}
