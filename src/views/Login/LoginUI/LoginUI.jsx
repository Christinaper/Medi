import style from './LoginUI.module.css'
import loginImg from '../../../assets/images/login_bg.jpg'
import logo from '../../../assets/images/logo.png'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
// import React from 'react';

function LoginUI({setName, setPwd, loginHandler}) {
  return (
    <div className={style['login']}>
      <div className={style['login-box']}>
        <div className={style['box-left']}>
          <img src={loginImg} alt="" className={style['box-image']} />
        </div>
        <div className={style['login-form']}>
          <Form action="">
            <div className={style['login-form-title']}>
              <img src={logo} alt="" />
              <p className={style['form-title-content']}>医药分销平台</p>
            </div>
            <Form.Item name='username' className={style['form-item']} rules={[{required: true, message: '请输入用户名'}]}>
              <Input prefix={<UserOutlined className={style['form-icon']} />} placeholder="Username" onChange={setName} />
            </Form.Item>
            <Form.Item name='password' className={style['form-item']} rules={[{required: true, message: '请输入密码'}]}>
              <Input prefix={<LockOutlined className={style['form-icon']} />} type="password" placeholder="Password" onChange={setPwd} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className={style['login-form-button']} onClick={loginHandler}>Login in</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default LoginUI