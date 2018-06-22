
// 引入md5
const md5 = require('blueimp-md5');
// 链接数据库
// 映入mongoose
const mongoose = require('mongoose');
// 连接数据库的url
mongoose.connect('mongodb://localhost:27017/gzhipin_test1');
// 获取连接对象
const conn = mongoose.connection;
// 绑定链接完成的监听
conn.on('connected', function() {
    console.log('数据库连接成功！！！！');
    
})

// 2得到对应的特定集合Model
// 定义文档的schema(定义文档的结构)
const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    header: {type: String}
})
// 定义Model
const UserModel = mongoose.model('user', userSchema);// users集合的名称

// CURD
function testSave() {
    // 创建UserMOdel的实例保存用户
    const userModel = new UserModel({username: 'Tom', password: md5('123'), type: 'dashen1'});
    userModel.save(function(error, user) {
        console.log('save()', error, user);
        

    })

}
testSave();
