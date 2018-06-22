module.exports = function (server) {
    const io = require('socket.io')(server);
    // 服务器监视客户端与服务的连接
    io.on('connection', function(socket) {
        console.log('有一个客户端连接上了！');
        socket.on('sendMsg', function(data) {
            console.log('服务端接受客户端发送的消息',data);

            //服务的向客户端发送消息
            data.name = data.name.toUpperCase();
            socket.emit('reveiveMsg', data);
            console.log('服务的向客户端发送消息', data);
            
            

        })
        
    })

}