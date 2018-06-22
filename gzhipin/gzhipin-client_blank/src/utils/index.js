
// 获取路径
export function getRedirectTo(type, header){
    let path;
    if(type === 'laoban') {
        path = '/laoban';
    }else {
        path = '/dashen'
    }

    if(!header) {
        path += 'Info'
    }
    
    return path;
}