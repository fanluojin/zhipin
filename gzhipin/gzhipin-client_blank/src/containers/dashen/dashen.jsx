// 大神的主界面
import React, {Component} from 'react'
import {connect} from 'react-redux'

import {getUserList} from '../../redux/actions'
import UserList from '../../components/user-list/user-list'
class Dashen extends Component {
    
    componentDidMount() {
        // 发送请求获取用户列表
        this.props.getUserList('laoban');
    }
    render() {
        // const {userList} = this.props
        // console.log('aaa');
        // debugger
        return (
            <UserList userList={this.props.userList} />
        )
    }
}
export default connect(
    state => ({userList: state.userList}),
    {getUserList}
)(Dashen)