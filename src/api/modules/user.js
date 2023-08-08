export const getMenu = async () => {
  console.log('获取当前用户菜单')
  await new Promise(resolve => setTimeout(() => resolve(),1000))
  return [
    {id: 1, name: '首页',fid: 0, path: '/homePage'},
    {id: 2, name: '平台管理', fid: 1, children : [
      {id: 3, name: '管理员列表', fid: 2, path: '/manager'},
      {id: 4, name: '广告位列表', fid: 2, path: '/ad'},
    ]},
    {id: 5, name: '产品管理',fid: 0, children : [
      {id: 6, name: '产品信息', fid: 5, path: '/info'},
      {id: 7, name: '产品分类', fid: 5, path: '/category'},
    ]},
    {id: 8, name: '销售管理', fid: 0, children : [
      {id: 9, name: '零售清单', fid: 8, path: '/retail'},
      {id: 10, name: '退货清单',fid: 8, path: '/return'},
    ]},
  ]
}
//获取当前登录用的动态路由信息
export const getRoutes = async () => {
  console.log('获取动态路由信息')
  // await new Promise(resolve => setTimeout(() => resolve(),1000))
  return [
    {path: '/homePage', moduleName: 'HomePage'},
    {path: '/manager', moduleName: 'Manager' },
    {path: '/ad', moduleName: 'Ad' },
    {path: '/info', moduleName: 'Info' },
    {path: '/category', moduleName: 'Category' },
    {path: '/retail', moduleName: 'Retail' },
    {path: '/return', moduleName: 'Return' },
    {path: '/changePwd', moduleName: 'ChangePwd'}
  ]
}
//管理员登录
import fetch from '../../utils/fetch'
export const login = ({username, password}) => fetch(`/medicine/platformAdmin/login?username=${username}&password=${password}`)

export const upload = (data) => fetch('/medicine/api/file/upload', {
  headers: {'Content-Type': 'multipart/from-data'},
  body:JSON.stringify(data),
  method: 'post'
})

export const changePwd = ({id, newPwd, oldPwd}) => fetch(`/medicine/platformAdmin/pwd?id=${id}&newPwd=${newPwd}&oldPwd=${oldPwd}`, {method: 'put'})
