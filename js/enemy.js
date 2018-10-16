function Enemy(){
    this.setWidth(60);
    this.setHeight(60);
    this.setX(x);
    this.setY(y);
    this.direction = 1;
    this.counter = 0;
    this.random = function(inf, sup){
        var posibilities = sup - inf;
        var random = Math.random() * posibilities;
        random = Math.floor(random);
        return parseInt(inf) + random;
    }
    this.move = function(){

    }
}