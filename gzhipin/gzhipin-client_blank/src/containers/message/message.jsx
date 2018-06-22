import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'

const Item = List.Item;
const Brief = Item.Brief;

function getLastMsgs(chatMsgs,userid) {
    // 1.找出每个聊天的lastMsg, 并用一个容器对象来保存
    const lastMsgObjs = {};
    chatMsgs.forEach(msg => {

        // 对msg进行个体的统计
        if(msg.to === userid && !msg.read) {
            msg.unReadCount = 1;

        }else {
            msg.unReadCount = 0;
        }
        // 得到msg的聊天组id
        const chatId = msg.chat_id;
        // 获取已保存的当前组件的lastMsg
        let lastMsg = lastMsgObjs[chatId];
        // 没有
        if (!lastMsg) {
            lastMsgObjs[chatId] = msg;
        } else {// 有 如果msg比lastMsg晚， 将msg保存为lastMsg
            const unReadCount = lastMsg.unReadCount + msg.unReadCount;
            if (msg.create_time > lastMsg.create_time) {

                lastMsgObjs[chatId] = msg;
            }
            lastMsgObjs[chatId].unReadCount = unReadCount;
        }
    });
    // 2. 再得到所有lastMsg的数组
    const lastMsgs = Object.values(lastMsgObjs);
    // 3. 对数组进行牌勋(create_time)
    lastMsgs.sort((m1, m2) => {
        // 降序排序
        return m2.create_time - m1.create_time;
    })
    return lastMsgs;

}
class Message extends Component {
    render() {
        const { user } = this.props;
        const { users, chatMsgs } = this.props.chat;
        // 对chatMsgs按chat_id进行分
        const lastMsgs = getLastMsgs(chatMsgs,user._id);

        return (
            <List style={{ marginTop: 50, marginBottom: 50 }}>
                {
                    lastMsgs.map(msg => {
                        const targetUserId = msg.to === user._id ? msg.from : msg.to;
                        const targetUser = users[targetUserId];
                        return (
                            <Item
                                key={msg.id}
                                extra={<Badge text={msg.unReadCount} />}
                                thumb={targetUser.header ? require(`../../assets/imgs/${targetUser.header}.png`) : null}
                                arrow='horizontal'
                                onClick={() => this.props.history.push(`/chat/${targetUserId}`)} >
                                {msg.content}
                        <Brief>{targetUser.username}</Brief>
                            </Item>
                        )
                    })
                }
            </List>
        )
    }
}
export default connect(
    state => ({ user: state.user, chat: state.chat }),
    {}
)(Message)