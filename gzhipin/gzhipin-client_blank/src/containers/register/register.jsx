//**注册路由组件 */
import React, {Component} from "react";
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    Button,
    Radio,
    WhiteSpace
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {register} from '../../redux/actions'
import Logo from '../../components/logo/logo'
const ListItem = List.Item;
class Register extends Component {
    state = {
        username: '',// 用户名
        password: '',// 密码
        password2: '',// 确认密码
        type: 'laoban',// 用户类型  laoban/dashen
    }


    // 注册
    register = () => {
        // console.log(this.state);
        this.props.register(this.state);
        
    }

    // 更新状态
    handleChange = (name, val) => {
        this.setState({
            [name]: val// 此时name是一个变量
        })
    }

    // 点击跳转到登录页面
    toLogin = () => {
        this.props.history.replace('/login');
    }
    render() {
        const {type} = this.state;
        const {msg, redirectTo} = this.props.user
        if(redirectTo) {
            
            return <Redirect to={redirectTo} />
        }
        return (
            <div>
                <NavBar>硅谷直聘</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        {msg ? <div className="error-msg">{msg}</div> : null}
                        <WhiteSpace />
                        <InputItem onChange={val => {this.handleChange('username', val)}}>用户名：</InputItem>
                        <WhiteSpace />
                        <InputItem type="password" onChange={val => {this.handleChange('password', val)}}>密&nbsp;&nbsp;&nbsp;码：</InputItem>                        
                        <WhiteSpace />
                        <InputItem type="password" onChange={val => {this.handleChange('password2', val)}}>确认密码：</InputItem>                        
                        <WhiteSpace />
                        <ListItem>
                            <span>用户类型：</span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type === 'dashen'} onChange={() => {this.handleChange('type', 'dashen')}}>大神</Radio>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type === 'laoban'} onChange={() => {this.handleChange('type', 'laoban')}}>老板</Radio>
                        </ListItem>
                        <WhiteSpace />
                        <Button type="primary" onClick={this.register}>注册</Button>
                        <Button onClick={this.toLogin}>已有账户</Button>
                    </List>
                </WingBlank>

            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {register}
)(Register)