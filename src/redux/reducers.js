import {combineReducers} from 'redux'

import {getRedirectPath} from '../utils'
import { AUTH_SUCCESS, ERROR_MSG ,RECEIVE_USER, RESET_USER,RECEIVE_USER_LIST} from './action-types'

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

export default combineReducers({ 
    user,
    userList
})