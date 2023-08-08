import React from 'react'
import ReactDOM from 'react-dom/client' // 从react-dom库中导入ReactDOM对象，使用client版本，表示在浏览器环境中渲染
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HashRouter>
        {/* <React.StrictMode> */}
          <App />
        {/* </React.StrictMode> */}
      </HashRouter>
    </PersistGate>
  </Provider>
)

// main.jsx文件的作用是实现一个React应用的入口，它负责渲染App组件，
// 并使用Provider, PersistGate, HashRouter等组件来提供Redux store, 持久化存储, 路由系统等功能