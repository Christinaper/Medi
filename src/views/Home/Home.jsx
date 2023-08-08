import { Layout, Button, Popover, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import style from './Home.module.css'
import SysMenu from './SysMenu'
import sideImg from '../../assets/images/11.png'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Outlet } from "react-router-dom"
import { useState, useEffect } from 'react';
import { dashboardActions, homepageActions } from '../../store'

function Home() {
    const [collapsed, setCollapsed] = useState(false)
    const dispatch = useDispatch()
    const {userLogin} = useSelector(state => state.user)
    // const order = useSelector(state => state.homepage.order);
    // const categoryList = useSelector(state => state.homepage.categoryList);
    useEffect(() => {
        dispatch(dashboardActions.getMenu())          
        dispatch(dashboardActions.getRoutes())
        dispatch(homepageActions.getCount())
        dispatch(homepageActions.getProductCount())
    }, []) // 不需要更新时重复执行
    const navigate = useNavigate()
    const logout = () => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '确定退出登录!',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                sessionStorage.removeItem('token');
                navigate('/login')
            }
        })
    }
    const changePwd = () => {
        navigate('/home/changePwd')
    }
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Layout.Sider width={220} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className={style['side-content']}>
                    <img src={sideImg} alt="" className={style['side-img']} />
                    {/* <span className={style['side-span']}>{collapsed ? "" : '医药分销平台'}</span> */}
                </div>
                <SysMenu />
            </Layout.Sider>
            <Layout>
                <Layout.Header className={style['header']}>
                    <div></div>
                    <Popover 
                        content = {
                            <div className={style['popover']}>
                                <Button style={{marginBottom: '20px'}} onClick={changePwd}>修改密码</Button>
                                <Button onClick={logout}>退出登录</Button>
                            </div>
                        } trigger='hover'
                    >
                        <div className={style['admin']}>
                            <span className={style['admin-span']}>{userLogin.nickname}</span>
                            <img src={`http://192.168.110.250:2709/medicine/${userLogin.avatar}`} alt="" className={style['admin-img']} />
                        </div>
                    </Popover>
                    
                </Layout.Header>
                <Layout.Content className={style['content']}>
                    {/* 使用Outlet组件，表示子路由的渲染位置 */}
                    <Outlet /> 
                </Layout.Content>
                <Layout.Footer></Layout.Footer>
            </Layout>
        </Layout>
    )
}
export default Home;