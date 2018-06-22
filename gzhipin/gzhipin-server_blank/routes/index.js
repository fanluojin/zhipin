var express = require('express');
var router = express.Router();

const {UserModel, ChatModel} = require('../db/models'); 
const md5 = require('blueimp-md5')
const filter = {password: 0, _v: 0};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// // 用户注册
// router.post('/register', function(req, res) {
//   // 接收请求参数
//   const {username, password} = req.body;
//   // 处理请求
//   if(username === 'admin') {
//     // 注册失败
//     res.send({code: 1, msg: '用户名已存在！'})
//   }else {
//     // 注册成功1
//     res.send({code: 0, data: {id: 'ab123', username, password}})
//   }

// })


// 注册的路由
router.post('/register', function(req, res) {
  // 接受请求参数
  const {username, password, type} = req.body;
  // 处理请求逻辑
   // 查询(根据username)
   UserModel.findOne({username}, function(error, user) {
    if(user) {
      // 用户存在，注册失败,返回注册失败的数据
      res.send({code: 1, msg: '此用户已存在'})

    }else {
      new UserModel({username,password: md5(password), type}).save(function(error, user) {
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24});
        const data = {username, type, _id: user._id};
        res.send({code: 0, data});
      })
    }

   }) 
  // 返回请求数据

})

// 登录的路由
router.post('/login', function(req, res) {
  const {username, password} = req.body;

  UserModel.findOne({username, password:md5(password)}, filter,function(error, user) {
    if(user) {
      //登录成功
      res.cookie('userid', user._id, {maxAge:1000*60*60*24});
      res.send({code: 0, data: user});
    }else {
      // 登录失败
      res.send({code: 1, msg: '用户名或密码错误'})
    }

  })

})

// 更新用户路由
router.post('/update', function(req, res) {
  // 接受cookie
  const userid = req.cookies.userid;
  if(!userid) {
    return res.send({code: 1, msg: '请先登录！'})
  }

  const user = req.body;// 没有_id
  UserModel.findByIdAndUpdate({_id: userid}, user, function(error, oldUser) {
    // cookie被篡改，查不到
    if(!oldUser) {
      res.clearCookie(userid);
      res.send({code: 1, msg: '请先登录'})
    }else {
      const {_id, username, type} = oldUser;
      const data = Object.assign(user, {_id, username, type});
      res.send({code: 0, data});
    }
  })



})

// 获取用户信息的路由
router.get('/user', function(req, res) {
  // 从cookie中获取userid
  const userid = req.cookies.userid;
  // 如果不存在，直接返回一个错误信息
  if(!userid) {
    return res.send({code: 1, msg: '请先登录！'})
  }

  // 根据userid查询呢用户信息
  UserModel.findOne({_id: userid}, filter, function(error, user) {
      res.send({code: 0, data: user});
  })

})

// 根据指定类型获取用户列表路由
router.get('/userList', function(req, res) {
  const {type} = req.query;

  UserModel.find({type}, filter, function(error, users) {
    res.send({code: 0, data: users});
  })
})

// 获取消息列表的路由
router.get('/msgList', function(req, res) {
  
  const {userid} = req.cookies;
  
  UserModel.find(function(error, userDocs) {
    const users = {};
    userDocs.forEach(user => {
      users[user._id] = {username: user.username, header: user.header}
    })
    // const users = userDocs.reduce((users, user) => {
    //   users[user._id] = {username: user.username, header: user.header}
    // }, {})
    ChatModel.find({"$or": [{from: userid}, {to: userid}]}, filter, function(error, chatMsgs) {
      
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
  
  
})

// 获取读取消息数量的路由
router.post('/readmsg', function(req, res) {
  const from = req.body.from;
  const to = req.cookies.userid;
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function(error, doc) {
    
    res.send({code: 0, data: doc.nModified})// 更新的数量

  })
})






module.exports = router;
