var socket = io.connect('http://milmeng-milmeng.a3c1.starter-us-west-1.openshiftapps.com', { 'forceNew': true} );
socket.on('messages', function(data){
    console.log(data);
    render(data);
});

socket.on('start-game', function(data){
    console.log(data);
});

socket.on('display-dice', function(data){
    document.getElementById('display-dice').innerHTML = data;
    console.log(data);
});

function render(data){
    var html = data.map(function(elem, index){
        return ('<tr><th>' + elem.author + ':</th><td>' + elem.text + '</td></tr>');
    }).join(" ");  
    document.getElementById('messages').innerHTML = html;
}

function addMessage(e){
    var payload = {
        author: user.currentUser.get().w3.ig, 
        text: document.getElementById('text').value
    };
    socket.emit('new-message', payload);
    return false;
}

function throwDice(){
    socket.emit('throw-dice');
}