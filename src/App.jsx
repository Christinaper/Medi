import { lazy, Suspense } from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'

const lazyLoad = moduleName => {
  // 使用lazy函数，动态导入，赋值给Module
  const Module = lazy(() => import(`@/views/${moduleName}/${moduleName}.jsx`))
  return (
    // Module加载完成之前显示的内容LazyLoading
    <Suspense fallback={<LazyLoading />}>
      <Module />
    </Suspense>
  )
}

// 静态路由
const staticRoutes = [
  {path: '/', element: <Navigate to="/login" />},
  {path: '/login', element: lazyLoad('Login')},
  {path: "/home", element: lazyLoad('Home'), meta: {needAuth: true}},
  {path: "*", element: lazyLoad('NotFound')}
]

function App() {
  // 动态路由
  const dynamicRoutes = useSelector(state => state.dashboard.dynamicRoutes)
  const routes = useMemo(() => {
    if(dynamicRoutes.length > 0) {
      staticRoutes[2].children = [] // 第三项: /home路由
      // 遍历动态路由，push到/home的children数组
      dynamicRoutes.forEach(route => {
        staticRoutes[2].children.push({path: `/home${route.path}`, element: lazyLoad(route.moduleName)})
      })
    }
    return staticRoutes;
  }, [dynamicRoutes])
  
  return (<>{useRoutes(routes)}</>)
  // 静态路由 + push的动态子路由 = 路由树
}

export default App


// 如果用户在地址栏输入"/home"并回车，那么React会匹配到routes数组中第三项对象（即/home路由），并渲染Home组件到页面上。如果用户点击了Home组件中的某个按钮，那么React会调用Home组件中定义的事件处理函数，并根据函数内部的逻辑来更新状态和重新渲染页面。