// 连接数据库
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ggggzhipin');
const conn = mongoose.connection;
conn.on('connected',() => {
    console.log('db connect success!');
})

// 定义出对应特定集合的Model并向外暴露
const userSchema = mongoose.Schema({
    username: {type: String, required: true},// 用户名
    password: {type: String, required: true},// 密码
    type: {type: String, required: true},// 用户类型 laoban/dashen
    header: {type: String},// 头像
    post: {type: String},// 职位
    info: {type: String},// 个人信息
    company: {type: String},// 公司简介
    salary: {type: String},// 月薪
});

const UserModel = mongoose.model('user', userSchema);

// 向外暴露UserSchema
exports.UserModel = UserModel;



// 定义chats集合的文档结构
const charSchema = mongoose.Schema({
    from: {type: String, required: true},// 发送用户的id
    to: {type: String, required: true},// 接受用户的id
    chat_id: {type: String, required: true},// from和to组成的字符串
    content: {type: String, required: true},// 聊天的内容
    read: {type: Boolean, default: false},// 标识是否已读
    create_time: {type: Number}// 创建的时间
});
// 定义能操作chats集合的数据Model
const ChatModel = mongoose.model('chat', charSchema);
// 向外暴露CharModel
exports.ChatModel = ChatModel;
///// // / / /////////////////////////////// /////////////

// 一次性暴露 model.exports = aaa;o
/**
 * 分别暴露
 * exports.aaa = aaa   
 * exports.bbb = bbb
*/
