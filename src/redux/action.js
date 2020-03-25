import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER, RESET_USER,RECEIVE_USER_LIST} from './action-types'
import {reqRegister,reqLogin,reqUpdateUser,reqUser,reqUserList} from '../api'


const errorMsg = (msg) => ({type:ERROR_MSG, data: msg})
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})    //授权成功，同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})    //同步接受
export const resetUser = (msg) => ({type: RESET_USER, data: msg})       //同步重置
const receiveUserList = (users) => ({type: RECEIVE_USER_LIST, data: users})

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