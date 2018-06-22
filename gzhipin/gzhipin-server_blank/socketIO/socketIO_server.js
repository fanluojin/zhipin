const {ChatModel} = require('../db/models')

module.exports = function (server) {
    const io = require('socket.io')(server);
    // 服务器监视客户端与服务的连接
    io.on('connection', function(socket) {
        console.log('有一个客户端连接上了！');
        socket.on('sendMsg', function({from, to, content}) {
            console.log('服务端接受客户端发送的消息',{from, to, content});
            const chat_id = [from, to].sort().join('_');
            const create_time = Date.now();
            new ChatModel({from,to, content, chat_id, create_time}).save(function(error, chatMsg) {
                  io.emit('receiveMsg', chatMsg);              
            })
            
            
            

        })
        
    })

}