import React, { Component } from 'react';
import {Switch, Route,Redirect} from 'react-router-dom'
import Cookies from 'js-cookie' //操作前端cookie的对象
import {connect} from 'react-redux'
import {NavBar} from 'antd-mobile'

import {getRedirectPath} from '../../utils'
import {getUser} from '../../redux/action'

import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import Dashen from '../dashen/dashen' 
import Laoban from '../laoban/laoban' 
import Message from '../message/message' 
import Personal from '../personal/personal' 
import NotFound from '../../components/not-found/not-found' 
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat2'

class Main extends Component {
    navList = [
        { 
            path: '/laoban', // 路由路径 
            component: Laoban, 
            title: '大神列表', 
            icon: 'dashen', 
            text: '大神', 
        },
        { 
            path: '/dashen', // 路由路径 
            component: Dashen, 
            title: '老板列表', 
            icon: 'laoban', 
            text: '老板', 
        },{
            path: '/message', // 路由路径 
            component: Message, 
            title: '消息列表', 
            icon: 'message', 
            text: '消息',
        },{
            path: '/personal', // 路由路径 
            component: Personal, 
            title: '用户中心', 
            icon: 'personal', 
            text: '个人',
        }
    ]
    /*曾经登陆过，自动登录 */
    componentDidMount(){
        const userid = Cookies.get('userid')
        const {user} = this.props
        if (userid && !user._id) { 
            this.props.getUser() // 获取 user 并保存到 redux 中 
        }
    }

    render() {
        const userid =Cookies.get('userid')
        const pathname = this.props.location.pathname
        if (!userid){
           return <Redirect to='/login'></Redirect>
        }
        const {user} = this.props
        if(!user._id){
            return null
        }
        else{
           
            if(pathname ==='/'){
                const path = getRedirectPath(user.type,user.header)
                return <Redirect to={path}></Redirect>
            }
            if (user.type === 'laoban'){
                this.navList[1].hide = true
            }else{
                this.navList[0].hide = true
            }
        }

        const currentNav = this.navList.find(nav => nav.path === pathname)
        
        return (
            <div>
                {currentNav ? <NavBar className='stick-top'>{currentNav.title}</NavBar> : null}
                <Switch>
                {
                    this.navList.map(nav => <Route key={nav.path} path={nav.path} component={nav.component}/>)
                    }
                    <Route path='/laobaninfo' component={LaobanInfo}/>
                    <Route path='/dasheninfo' component={DashenInfo}/>
                    <Route path='/chat/:userid' component={Chat}/>
                    
                    <Route component={NotFound}/>>
                </Switch>
                {currentNav ? <NavFooter unReadCount={this.props.unReadCount} navList={this.navList}/> : null}
            </div>
        )
    }
}

export default connect(
    state=>({user:state.user,unReadCount: state.chat.unReadCount}),
    {getUser}
)(Main);