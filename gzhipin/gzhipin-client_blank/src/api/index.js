/**
 * 
 */
import ajax from './ajax'

export const reqRegister = (user) => ajax('/register', user, 'POST')
export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST')
export const reqUpdate = (user) => ajax('/update', user, 'POST')
export const reqUser = () => ajax('/user')
export const reqUserList = (type) => ajax('/userList', {type})

//  获取当前用户的聊天消息列表
export const reqMsgList = () => ajax('/msgList');
// 修改指定消息伟已读
export const reqReadMsg = (from) => ajax('/readmsg', {from}, 'POST')