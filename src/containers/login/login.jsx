import React, { Component } from 'react';
import {connect} from 'react-redux'
import { NavBar, WingBlank, List, InputItem, WhiteSpace, Button } from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {login} from '../../redux/action'

class Login extends Component {
    state = { 
        username: '', 
        password: '', 
    }
    handleChange = (name, value) => { 
        this.setState({[name]: value}) 
    }
    toRegister = () => { 
        this.props.history.replace('/register') 
    }

    login = () => { 
        this.props.login(this.state)
    }

    render() {
        const {redirectTo, msg} = this.props
        if (redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar>硅谷直聘</NavBar>
                <Logo/>
                <WingBlank>
                {msg ? <p className='error-msg'>{msg}</p> : null}
                    <List>
                        <InputItem 
                            placeholder='输入同户名'
                            onChange={val => this.handleChange('username', val)}
                        >
                            用户名：
                        </InputItem>
                        <WhiteSpace/>
                        <InputItem
                        type='password' 
                        placeholder='输入密码' 
                        onChange={val => this.handleChange('password', val)}
                        >
                        密&nbsp;&nbsp;&nbsp;码
                        </InputItem>
                        <WhiteSpace/>
  
                        <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;陆 </Button>
                        <WhiteSpace/>
                        <Button onClick={this.toRegister}>还没有账号</Button>
                    </List>
                </WingBlank>
            </div>
        );
    }
}

export default connect( state => state.user, {login} )(Login)