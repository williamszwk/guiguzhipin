import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER, RESET_USER,RECEIVE_USER_LIST,RECEIVE_MSG_LIST, RECEIVE_MSG, MSG_READ} from './action-types'
import {reqRegister,reqLogin,reqUpdateUser,reqUser,reqUserList,reqChatMsgList, reqReadChatMsg} from '../api'
import io from 'socket.io-client'

const errorMsg = (msg) => ({type:ERROR_MSG, data: msg})
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})    //授权成功，同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})    //同步接受
export const resetUser = (msg) => ({type: RESET_USER, data: msg})       //同步重置
const receiveUserList = (users) => ({type: RECEIVE_USER_LIST, data: users})

const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userid}}) //接收消息列表的同步
//接收一个消息
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})//
const msgRead = ({from, to, count}) => ({type: MSG_READ, data: {from, to, count}})//

//注册异步action
export function register({username,password,password2,type}){
    //前台检查
    if (!username || !password || !type) { 
        return errorMsg('用户名密码必须输入') 
    }
    if (password !== password2) { 
        return errorMsg('密码和确认密码不同') 
    }
    //返回分发的数据，异步要加上async ,因为用来异步await
    return async dispatch=>{
        const response = await reqRegister({username, password, type})
        const result = response.data
        if (result.code === 0){//成功
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data))
        }else{
            dispatch(errorMsg(result.msg))
        }
    }
}

export const login = ({username, password})=>{
    if (!username || !password ) { 
        return errorMsg('用户名密码必须输入') 
    }

    return async dispatch =>{
        const response = await reqLogin({username, password})
        const result = response.data
        if (result.code === 0){
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data))
        }else{
            dispatch(errorMsg(result.msg))
        }
    }
}

export const updateUser = (user) =>{
    return async dispatch => {
        const response = await reqUpdateUser(user)
        const result = response.data
        if (result.code === 0) {
            dispatch(receiveUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}

export const getUser = () =>{
    return async dispatch =>{
        const response = await reqUser()
        const result = response.data
        if (result.code === 0){
            getMsgList(dispatch, result.data._id)
            dispatch(receiveUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}
export const getUserList = (type) =>{
    return async dispatch =>{
        const response = await reqUserList(type)
        const result = response.data
        if (result.code === 0){
            dispatch(receiveUserList(result.data))
        }
    }
}
/* 
单例对象，
创建之后，下次访问就不用创建了。
*/
function initIO(dispatch, userid) {
    if(!io.socket){
        io.socket = io('ws://localhost:4000') //连接服务器，得到连接对象
        io.socket.on('receiveMessage', (chatMsg) => { //绑定监听
            if(chatMsg.from===userid || chatMsg.to===userid) {
                dispatch(receiveMsg(chatMsg,userid))
            }
        })
    }

}

async function getMsgList(dispatch, userid){

    initIO(dispatch, userid)
    const response = await reqChatMsgList()
    const result = response.data
    if(result.code===0) {
        const {chatMsgs, users} = result.data
        dispatch(receiveMsgList({chatMsgs, users, userid}))
    }
}

export const sendMsg = ({from, to, content}) => {
    return dispatch => {
      console.log('客户端向服务器发送消息', {from, to, content})
      // 发消息
      io.socket.emit('sendMessage', {from, to, content})
    }
  }

export const readMsg = (from,to) => { 
    return async dispatch => { 
        const response = await reqReadChatMsg(from) 
        const result = response.data 
        if(result.code===0) { 
            const count = result.data 
            dispatch(msgRead({from, to, count})) 
        } 
    } 
}