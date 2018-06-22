// 根据老的state 和新的action返回新的state
import { combineReducers } from 'redux'
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
import { getRedirectTo } from '../utils/index'
const initUser = {
    username: '',// 用户名
    type: '',// 用户类型
    msg: '',// 返回的错误信息
    redirectTo: ''
}

function user(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            const { type, header } = action.data;
            return { ...action.data, redirectTo: getRedirectTo(type, header) };
        case ERROR_MSG:
            return { ...state, msg: action.data }
        case RECEIVE_USER:
            return action.data;
        case RESET_USER:
            return { ...initUser, msg: action.data }
        default:
            return state;
    }

}

// userList
const initUserList = [];
function userList(state = initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

// 产生聊天状态的reducer
const initChat = {
    users: {},
    chatMsgs: {},
    unReadCount: 0
}
function chat(state = initChat, action) {

    switch (action.type) {
        case RECEIVE_MSG_LIST:
            const { users, chatMsgs, userid } = action.data;
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && msg.to === userid ? 1 : 0), 0)
            }
        case RECEIVE_MSG:// data: chatMsg
            const { chatMsg } = action.data;
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to === action.data.userid ? 1 : 0)
            }
        case MSG_READ:
        const {from, to, count} = action.data;
        state.chatMsgs.forEach(msg => {
            if(from === msg.from && to === msg.to && !msg.read) {
                msg.read = true
            }
        });
        return {
            users: state.users,
            chatMsgs: state.chatMsgs.map(msg => {
                if(from === msg.from && to === msg.to && !msg.read) {
                    // 需要更新
                    return {...msg, read: true}
                }else {
                    // 不需要更新
                    return msg
                }
            }),
            unReadCount: state.unReadCount - count
        }
        default:
            return state;
    }
}

export default combineReducers({
    user,
    userList,
    chat
})
// 向外暴露的结构： {user: {}, userList: [],chat: {}}



