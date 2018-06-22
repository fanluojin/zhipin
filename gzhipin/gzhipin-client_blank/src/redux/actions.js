// 包含n个action creator
// 同步的action
// 异步action
import io from 'socket.io-client'
import {reqRegister, reqLogin, reqUpdate, reqUser, reqUserList, reqMsgList, reqReadMsg} from '../api/index'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER, 
    RESET_USER, 
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    MSG_READ
} from './action-types'

// 获取用户信息列表
async function getMsgList(dispatch, userid) {
    initIO(dispatch, userid);
    
    const response = await reqMsgList();
    const result = response.data;
    if(result.code === 0) {
        // 分发同步action
        const {users, chatMsgs} = result.data;
        dispatch(receiveMsgList({users, chatMsgs, userid}))
    }
}

function initIO(dispatch,userid) {
    if(!io.socket) {
        // 连接服务器，获取与服务器的链接对象
        io.socket = io('ws://localhost:4000');
        // 绑定监听，接受服务器发送的消息
        io.socket.on('receiveMsg', function(chatMsg) {
            console.log('客户端接受服务器发送的消息', chatMsg);
            if(userid === chatMsg.from || userid === chatMsg.to) {
                dispatch(receiveMsg(chatMsg, userid));
            }

        })
    } 
}



// 授权成功同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg});
const receiveUser = (user) => ({type: RECEIVE_USER, data: user});
export const resetUser = (msg) => ({type: RESET_USER, data: msg});
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList});
// 接受消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data:  {users, chatMsgs, userid}})
// 接受一条消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}});
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})




// 读取消息的action
export const readMsg = (from,to) => {
    return async dispatch => {
        const response = await reqReadMsg(from);
        const result = response.data;
        if(result.code === 0 ) {
            const count = result.data;

            dispatch(msgRead({count, from ,to}))
        }

    }
}

// 注册的异步action
export const register = (user) => {
    const {username, password, password2, type} = user;
    if(!username) {
        return errorMsg('用户名不能为空');
    }else if(password !== password2) {
        return errorMsg('两次密码要一致')
    }
    return async dispatch => {
        const response = await reqRegister({username, password, type});
        // debugger
        const result = response.data;
        if(result.code === 0) {
            // 分发授权成功的同步action
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data));
        }else {
            // 分发授权失败的同步action
            dispatch(errorMsg(result.msg));
        }
    }
}

// 登录异步action
export const login = (user) => {
    const {username, password} = user;
    if(!username) {
        return errorMsg('用户名不能为空');
    }else if(!password) {
        return errorMsg('密码必须指定')
    }
    return async dispatch => {
        const response = await reqLogin(user);
        const result = response.data;
        if(result.code === 0) {
            // 分发授权成功的同步action
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data));
        }else {
            // 分发授权失败的同步action
            dispatch(errorMsg(result.msg));
        }


    }
}

// 更新用户的异步action
export const updateUser = (user) => {

    return async dispatch => {
        const response = await reqUpdate(user);
        const result = response.data;
        if(result.code === 0) {// 返回数据成功 data
            dispatch(receiveUser(result.data))
        }else {// 失败 msg
            dispatch(resetUser(result.msg))
        }

    }
}

// 获取用户信息的异步action
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser();
        const result = response.data;
        if(result.code === 0) {
            //查询用户成功
            getMsgList(dispatch, result.data._id)
            dispatch(receiveUser(result.data))
        }else {
            // 查询用户失败
            dispatch(resetUser(result.msg));
        }
        

    }
}

// 获取指定用户类型的用户列表
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type);
        const result = response.data;
        if(result.code === 0) {
            // 获取用户成功
        dispatch(receiveUserList(result.data));
        }
    }
}

// 发送消息的异步action
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        // 发送消息
        io.socket.emit('sendMsg', {from, to, content});
        
    }
}