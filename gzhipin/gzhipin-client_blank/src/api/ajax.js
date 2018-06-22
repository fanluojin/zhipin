/**
 * 能发送ajax请求的函数模块
 * 函数返回的是promise对象
 */

import axios from 'axios'

export default function ajax(url, data={}, type='GET') {
    if(type === 'GET') {// 发送GET请求
        let paramStr = '';
        Object.keys(data).forEach(key => {
            paramStr += key + '=' + data[key] + '&'
        })
        if(paramStr) {
            paramStr.substring(0, paramStr.length - 1);
        }
        return axios.get(url + '?' + paramStr);

    }else {//发送   POST请求
        return axios.post(url, data);

    }


}