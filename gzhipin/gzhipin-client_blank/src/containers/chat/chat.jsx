import React, { Component } from "react";
import { connect } from 'react-redux'
import { NavBar, List, InputItem, Grid, Icon } from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

import { sendMsg, readMsg } from '../../redux/actions'

const Item = List.Item;

// 对话聊天的路由组件

class Chat extends Component {
    state = {
        content: '',
        isShow: false//消息的内容
    }

    componentWillMount() {
        // 初始化表情数据
        const emojis = ['😁', '😃', '😄', '😅', '😆', '😊',
            '😁', '😃', '😄', '😅', '😆', '😊',
            '😁', '😃', '😄', '😅', '😆', '😊',
            '😁', '😃', '😄', '😅', '😆', '😊',
            '😁', '😃', '😄', '😅', '😆', '😊',
            '😁', '😃', '😄', '😅', '😆', '😊',
            '😁', '😃', '😄', '😅', '😆', '😊',
            '😁', '😃', '😄', '😅', '😆', '😊'
        ];
        this.emojis = emojis.map(val => ({ text: val }));
    }
    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight);
       
        
    }
    componentWillUnmount() {
        const from = this.props.match.params.userid;
        const to = this.props.user._id;
        this.props.readMsg(from, to);
    }
    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    handleSend = () => {
        // 收集数据
        const from = this.props.user._id;
        const to = this.props.match.params.userid;
        const content = this.state.content.trim();
        if (content) {
            this.props.sendMsg({ from, to, content });
        }
        // 发送消息后清除文本框的内容
        this.setState({ 
            content: '',
            isShow: false 
        })

    }
    toggleShow = () => {
        const isShow = !this.state.isShow;
        this.setState({isShow});
        if(isShow) {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 0);
        }
    }

    render() {
        const { user } = this.props;
        const { users, chatMsgs } = this.props.chat;

        // 计算当前的chat_id
        const meId = user._id;
        if (!users[meId]) {
            return null;
        }
        const targetId = this.props.match.params.userid;
        console.log(targetId);

        const chatId = [meId, targetId].sort().join('_');
        // 过滤
        console.log(chatMsgs)
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId);
        // 得到目标用户的header头像
        const targetHeader = users[targetId].header;
        const targetIcon = targetHeader ? require(`../../assets/imgs/${targetHeader}.png`) : null;

        return (
            <div id="chat-page">
                <NavBar
                 icon={<Icon type='left'/>} 
                 className='sticky-header'
                 onClick={() => this.props.history.goBack()}
                 >
                    {users[targetId].username}
                 </NavBar>
                <List style={{marginTop: 50, marginBottom: 50}}>

                <QueueAnim type='alpha' delay={100}>
                {
                        msgs.map(msg => {
                            if (targetId === msg.from) {
                                return (
                                    <Item
                                        key={msg._id}
                                        thumb={targetIcon}>
                                        {msg.content}
                                    </Item>
                                )
                            } else {
                                return (
                                    <Item
                                        key={msg._id}
                                        className='chat-me'
                                        extra='我'>
                                        {msg.content}
                                    </Item>
                                )
                            }

                        })
                    }
                </QueueAnim>
                   
                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        placeholder='请输入'
                        value={this.state.content}
                        onChange={val => this.setState({ content: val })}
                        onFocus={() => this.setState({isShow: false})}
                        extra={
                            <span>
                                <span onClick={this.toggleShow} style={{marginRight: 5}}>😊</span>
                                <span onClick={this.handleSend}>发送</span>
                            </span>
                        } />

                    {
                        this.state.isShow ? (
                            <Grid
                                data={this.emojis}
                                columnNum={8}
                                carouselMaxRow={4}
                                isCarousel={true}
                                onClick={(item) => {
                                    this.setState({ content: this.state.content + item.text })
                                }}
                            />
                        ) : null
                    }



                </div>
            </div>
        )
    }

}

export default connect(
    state => ({ user: state.user, chat: state.chat }),
    { sendMsg, readMsg }
)(Chat)