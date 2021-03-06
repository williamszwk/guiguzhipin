import ajax from './ajax'
//
export const reqRegister = (user) => ajax('/register', user, 'POST')
//
export const reqLogin = (user) => ajax('/login', user, 'POST')
//
export const reqUpdateUser = (user) => ajax('/update', user, 'POST')
//
export const reqUser = () => ajax('/user')
//
export const reqUserList = (type) => ajax('/list', {type})
//
export const reqChatMsgList = () => ajax('/msglist')
//修改信息为已读
export const reqReadChatMsg = (from) => ajax('/readmsg', {from}, 'POST')