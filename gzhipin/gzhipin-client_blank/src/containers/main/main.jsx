//**主界面路由组件 */
import React, {Component} from "react";
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'

import DashenInfo from '../dashen-info/dashen-info'
import LaobanInfo from '../laoban-info/laoban-info'
import Laoban from '../laoban/laoban'
import Dashen from '../dashen/dashen'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'
import {getRedirectTo} from '../../utils/index';
import {getUser} from '../../redux/actions'


import '../../assets/css/index.less'
class Main extends Component {

    // 给组件对象添加属性
    navList = [
        {
            path: '/laoban',
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神'
        },
        {
            path: '/dashen',
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板'
        },
        {
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },
        {
            path: '/personal',
            component: Personal,
            title: '个人中心',
            icon: 'personal',
            text: '个人'
        },
    ];

    componentDidMount() {
        // 登陆过(cookie中有userid)，但没登陆(redux中user没有_id),发送请求获取对应的user
        const userid = Cookies.get('userid');
        const {_id} = this.props.user;
        if(userid && !_id) {
            // console.log('发送请求获取对应的user');
            this.props.getUser();
        }
    }

    render() {
        // 检查cookie中是否有userid,
        const userid = Cookies.get('userid');
        // 如果没有，重定向到登录界面
        if(!userid) {
            return <Redirect to='/login' />
        }
        // 如果有，检查redux中的user状态
        const {user,unReadCount} = this.props;
        // 如果user中没有_id，暂时返回空
        if(!user._id) {
            // console.log(999);
            return null;
        }else {
            // 如果有_id,如果请求的是更路径，
            // 那么就根据type和header计算出一个重定向的路径
            let path = this.props.location.pathname;
            
            if(path === '/') {
                path = getRedirectTo(user.type, user.header);
                // console.log(path,888);
                return <Redirect to={path} />
            }
        }

        const {navList} = this;
        const path = this.props.location.pathname;
        const currentNav = navList.find(nav => path === nav.path);
        if(currentNav) {
            if(user.type === 'laoban') {
                // 给navList[1]添加hidden:true
                navList[1].hidden = true;
            }else {
                // 给navList[0]添加hidden：true
                navList[0].hidden = true;
                
            }
        }

        return (
            <div>
                {
                    currentNav ? <NavBar className="sticky-header">{currentNav.title}</NavBar> : null
                }
                <Switch>
                    {
                        navList.map((nav, index) => <Route key={index} path={nav.path} component={nav.component} />)
                    }
                    <Route path='/dashenInfo' component={DashenInfo} />
                    <Route path='/laobanInfo' component={LaobanInfo} />
                    <Route path='/chat/:userid' component={Chat}/>
                    <Route component={NotFound}/>
                </Switch>
                {
                    currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/>: null
                }
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user, unReadCount: state.chat.unReadCount}),
    {getUser}
)(Main)