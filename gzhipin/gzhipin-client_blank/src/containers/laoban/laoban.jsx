// 老板主界面
import React, {Component} from 'react'
import {connect} from 'react-redux'

import {getUserList} from '../../redux/actions'
import UserList from '../../components/user-list/user-list'
class Laoban extends Component {
    
    componentDidMount() {
        // 发送请求获取用户列表
        this.props.getUserList('dashen');
    }
    render() {
        // const {userList} = this.props
        // // debugger
        return (
            <UserList userList={this.props.userList} />
        )
    }
}
export default connect(
    state => ({userList: state.userList}),
    {getUserList}
)(Laoban)