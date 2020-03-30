import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {TabBar} from 'antd-mobile'
/* 非路由组件中，使用路由组件的API */
import {withRouter} from 'react-router-dom'


const Item = TabBar.Item

class NavFooter extends Component {

    static propTypes ={
        navList: PropTypes.array.isRequired,
        unReadCount: PropTypes.number.isRequired
    }
    render() {
        const navList = this.props.navList.filter(nav => !nav.hide)
        const {pathname} = this.props.location
        return (
           <TabBar>
               {
                   navList.map((nav,index)=>(
                       <Item
                       key={nav.path} 
                       badge={nav.path === '/message' ? this.props.unReadCount : 0}
                       title={nav.text} 
                       icon={{uri: require(`./imgs/${nav.icon}.png`)}} 
                       selectedIcon={{uri: require(`./imgs/${nav.icon}-selected.png`)}} 
                       selected={pathname===nav.path} 
                       onPress={() => { 
                           this.props.history.replace(nav.path) 
                        }}
                       
                       >


                       </Item>
                   ))
               }
           </TabBar>
        )
    }
}

export default withRouter(NavFooter)