import { useEffect, useState } from 'react'
import style from './ChangePwd.module.css'
import { Button, Form, Input, Card, Modal } from 'antd';
import { userActions } from '../../store';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function ChangePwd() {
  const dispatch = useDispatch() // 用于派发action
  const {userLogin, password} = useSelector(state => state.user)
  const [model, setModel] = useState({id: 0, newPwd: '', oldPwd: ''})
  const [rePwd, setrePwd] = useState('')
  // 辅助函数
  const setOldPwd = (e) => {
    setModel({...model, oldPwd: e.target.value}) // 设置旧密码，并更新model
  }
  const setNewPwd = (e) => {
    setModel({...model, newPwd: e.target.value}) // 设置新密码，并更新model
  } 
  const setRePwd = (e) => { // 确认密码
    setrePwd({rePwd: e.target.value})
  }
  // validator函数固定参数格式，(rule, value), 所以使用_占位符
  const validateConfirmPassword = (_, value) => {
    const { newPwd } = model; // 解构出newPwd
    if (value && value !== newPwd) {
      return Promise.reject('两次输入的密码不一致');
    }
    return Promise.resolve();
  };
  // 使用useEffect钩子，在组件挂载后执行一次以下函数
  useEffect(() => {
    setModel({...model, id: userLogin.id})
    console.log(userLogin.id)
  }, []) // only once
  // 页面跳转
  const navigate = useNavigate() 
  // 修改密码
  const changePwdHandler = () => {
    dispatch(userActions.changePwd(model))
  }
  useEffect(() => {
    if(password) {
      Modal.confirm({
        title: '提示',
        icon: <ExclamationCircleFilled />,
        content: '密码修改成功，请重新登录!',
        okText: '确定',
        cancelButtonProps: { style: { display: 'none' } }, 
        onOk() {
          sessionStorage.removeItem('token');
          navigate('/login')
          dispatch(userActions.logout())
        }
      })
    }
  }, [password]) // 依赖
  
  return(
    <div className={style['container']}>
      <Card title='密码修改'> 
        <Form labelCol={{ span: 2 }}>
          <Form.Item label='账号' name='username' >
            <Input className={style['input-item']} disabled placeholder={userLogin.username} name='username' />
          </Form.Item>
          <Form.Item  label='旧密码' name='oldPwd' rules={[{ required: true, message: '旧密码不能为空' }, { min: 6, max: 16, message: '密码长度在6-16个字符' }]}>
            <Input className={style['input-item']} placeholder='请输入旧密码' type='password' onChange={setOldPwd} name='oldPwd' />
          </Form.Item>
          <Form.Item label='新密码' name='newPwd' rules={[{ required: true, message: '请输入新密码'}, { min: 6, message: '密码长度不能少于6个字符' }]}>
            <Input className={style['input-item']} placeholder='请输入新密码' type='password' onChange={setNewPwd} />
          </Form.Item>
          <Form.Item  label='确认新密码' name='rePwd' rules={[{ required: true, message: '确认新密码不能为空' },{ validator: validateConfirmPassword }]}>
            <Input className={style['input-item']} placeholder='请确认新密码' onChange={setRePwd} type='password' />
          </Form.Item>
          <Form.Item>
            <Button className={style['btn-item']} htmlType="submit" type='primary' onClick={changePwdHandler}>修改</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
  
} 
export default ChangePwd 