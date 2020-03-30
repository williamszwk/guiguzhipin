import {combineReducers} from 'redux'
import {getRedirectPath} from '../utils'
import { AUTH_SUCCESS, ERROR_MSG ,RECEIVE_USER, RESET_USER,RECEIVE_USER_LIST,RECEIVE_MSG_LIST, RECEIVE_MSG, MSG_READ} from './action-types'

const initUser = { 
    username: '', // 用户名 
    type: '', // 类型 
    msg: '', // 错误提示信息 
    redirectTo: '' // 需要自动跳转的路由 
}
const initUserList = []


function user(state=initUser,action){
    switch(action.type){ 
        case AUTH_SUCCESS:
            const redirectTo = getRedirectPath(action.data.type, action.data.header)
            return {...action.data,redirectTo}
        case ERROR_MSG:
            return {...state,msg:action.data}
        case RECEIVE_USER:
            return action.data
        case RESET_USER: 
        return {...initUser, msg: action.data}
        default:
            return state
    }
    
}
function userList(state = initUserList, action){
    switch (action.type){
        case RECEIVE_USER_LIST: 
            return action.data
        default: 
            return state
    }
}
const initChat = { 
    chatMsgs: [], // 消息数组 [{from: id1, to: id2}{}] 
    users: {}, // 所有用户的集合对象{id1: user1, id2: user2} 
    unReadCount: 0 // 未读消息的数量 
}

function chat(state=initChat, action) {
    switch (action.type) {
        case RECEIVE_MSG_LIST:  // data: {users, chatMsgs}
            const {users, chatMsgs, userid} = action.data
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal+(!msg.read&&msg.to===userid?1:0),0)
            }
        case RECEIVE_MSG: // data: chatMsg
            const {chatMsg} = action.data
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
            }
        case MSG_READ: 
            const {count, from, to} = action.data
            state.chatMsgs.forEach(msg => {
                if(msg.from===from && msg.to===to && !msg.read) {
                  msg.read = true
                }
              })
            return { 
                chatMsgs: state.chatMsgs.map(msg => { 
                    if(msg.from===from && msg.to===to && !msg.read) { 
                        // msg.read = true 不能直接修改状态 
                        return {...msg, read: true} } 
                    else { 
                        return msg 
                    } 
                    }),
                users: state.users, 
                unReadCount: state.unReadCount-count 
            }
            default: 
                return state
    }
}

export default combineReducers({ 
    user,
    userList,
    chat
})