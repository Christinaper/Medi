// 创建store + 合并reducer + 获取默认的middleware
import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit'
// 导入持久化redux需要的工具函数
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage/session'
// 导入所有的slice对应的reducer和actions
import dashboardReducer, * as dashboardActions  from './slices/dashboard'
import userReducer, * as userActions from './slices/user'
import homepageReducer, * as homepageActions from './slices/homepage'
import managerReducer, * as managerActions from './slices/manager'
import adReducer, * as adActions from './slices/ad'
import infoReducer, * as infoActions from './slices/info'
import categoryReducer, * as categoryActions from './slices/category'
import retailReducer, * as retailActions from './slices/retail'

const persistConfig = { key: 'root', storage }
// 合并reducer
const reducer = combineReducers({//combineReducers 是 Redux 提供的函数，用于将多个 reducer 合并成一个根 reducer。
    dashboard: dashboardReducer,
    user: userReducer,
    homepage: homepageReducer,
    manager: managerReducer,
    ad: adReducer,
    info: infoReducer,
    category: categoryReducer,
    retail: retailReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)//定义了存储配置对象 persistConfig，指定了存储的 key 和使用的存储引擎（此处使用了 redux-persist 中的 session storage,不持久化，刷新就没有了

export const store = configureStore({//configureStore 是 Redux Toolkit 提供的函数，用于创建 Redux store。
    devTools: true,//指示是否启用Redux DevTools扩展，允许在开发工具中调试Redux状态。
    reducer: persistedReducer,//这是一个已经通过persistReducer包装后的根 reducer。通过persistReducer的包装，实现了Redux持久化。
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})//使用了一个函数来获取默认的middleware配置，并通过serializableCheck: false禁用了默认的可序列化检查。
})
export const persistor = persistStore(store)//使用 persistStore 创建持久化的 store，并将其导出为 persistor
export {dashboardActions, userActions, homepageActions, managerActions, adActions, infoActions, categoryActions, retailActions};//将所有的 slice 的 actions 导出：