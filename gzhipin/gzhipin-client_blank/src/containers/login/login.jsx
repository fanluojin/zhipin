//**注册路由组件 */
import React, {Component} from "react";
import {
    NavBar,
    WingBlank,
    List,
    Button,
    InputItem,
    WhiteSpace
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {login} from '../../redux/actions'
import Logo from '../../components/logo/logo'
class Login extends Component {
    state = {
        username: '',// 用户名
        password: '',// 密码
        
     
    }


    // 注册
    login = () => {
        // console.log(this.state);
        this.props.login(this.state);
        
    }

    // 更新状态
    handleChange = (name, val) => {
        this.setState({
            [name]: val// 此时name是一个变量
        })
    }

    // 点击跳转到登录页面
    toRegister = () => {
        this.props.history.replace('/register');
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
                        <Button type="primary" onClick={this.login}>登录</Button>
                        <Button onClick={this.toRegister}>还没有账户</Button>
                    </List>
                </WingBlank>

            </div>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {login}
)(Login)