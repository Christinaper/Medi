import { Menu } from 'antd'
import { FolderOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

function SysMenu() {
  const navigate = useNavigate() // 实现路由跳转
  const menu = useSelector(state => state.dashboard.menu)
  const menuItems = useMemo(() => {
    function _transformMenu(arr) {
      let result = []
      arr.forEach(item => {
        let menuItem = {label :item.name, key: item.path || item.id, icon: item.path ? <AppstoreOutlined /> : <FolderOutlined />}
        if(item.children) menuItem.children = _transformMenu(item.children)
        result.push(menuItem)
    })
    return result
    }
    return _transformMenu(menu)
  }, [menu])

  return (
    // items属性是一个数组，表示菜单项的数据源
    // onSelect菜单被选择时的事件处理函数
    // --- Q: 为什么onSelect可以用items中的key? ---
    // --- A: Menu组件会自动将items数组中的每一项对象作为参数传递给onSelect函数, 使用解构赋值({key})提取key并赋值给key, 并使用了键值对简写({key: key}) ---
    <Menu theme='dark' mode='inline' items={menuItems} onSelect={({key}) => navigate(`/home${key}`, {replace: true})} />
  )
}

export default SysMenu