import React, {Component} from "react";
import {List,Grid} from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {
    static propTypes = {
        setHeader: PropTypes.func.isRequired
    }

    state = {
        icon: null
    }

    constructor(props) {
        super(props);
        this.headerList = [];
        for(let i = 0; i < 20; i++) {
            this.headerList.push({
                text: '头像' + (i+1),
                icon: require(`../../assets/imgs/头像${i+1}.png`)// 不能使用import
            })
        }
    }

    handleClick = ({text, icon}) => {
        console.log(text, icon);
        
        // 更新当前的组件状态
        this.setState({icon});
        // 调用setHeader更新父组件的状态
        this.props.setHeader(text)
    }

    render() {
        const {icon} = this.state;
        const listHeader = !icon ? '请选择头像' : (
            <div>
                已选择头像：<img src={icon}/>
            </div>
        )

        // const listHeader = '请选择头像'
        return (
            <div>   
                <List renderHeader={() => listHeader}>
                    <Grid data={this.headerList}
                          columnNum={5}
                          onClick={this.handleClick}>
                    </Grid>
                </List>
            </div>
        )
    }
}