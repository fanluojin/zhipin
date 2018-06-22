import io from 'socket.io-client'

// 连接服务器,获取客户端与服务的的连接对象socket
const socket = io('ws://localhost:4000');
socket.emit('sendMsg', {name: 'zhangsan'});
console.log('客户端向服务端发送消息', {name: 'zhangsan'});
// 客户端接受服务端消息
socket.on('reveiveMsg', function(data) {

    console.log('客户端接受服务端消息', data);
    
})

