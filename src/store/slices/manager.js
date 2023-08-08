// createAsyncThunk是一个函数，接受一个action类型的字符串和返回一个Promise的回调函数。
// createSlice是一个函数，接受一个初始状态，一个reducer函数的对象，一个slice名字，
// 自动生成对应于reducer 和 状态的action创建器 和 action类型
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

export const getList = createAsyncThunk(
  'manager/getList',                                   // thunk名称
  async (params) => await api.manager.getList(params)  // 异步回调函数
)
export const getAdmin = createAsyncThunk(
  'manager/getAdmin',
  async (params) => await api.manager.getAdmin(params)
)
export const add = createAsyncThunk(
  'manager/add',
  async (params) => await api.manager.add(params)
)

export const update = createAsyncThunk(
  'manager/update',
  async (params) => await api.manager.update(params)
)

export const remove = createAsyncThunk(
  'manager/remove',
  async (params) => await api.manager.remove(params)
)
export const upload = createAsyncThunk(
  'manager/upload',
  async (params) => await api.user.upload(params)
)
const slice = createSlice({
  name: 'manager',                                           // 用于创建相应的action类型字符串
  initialState: { managerList: [], total: 0, editList: {} }, // 设置slice的初始状态  
  extraReducers: builder => {                                // 定义额外的reducer处理函数
    builder      // 定义不同的action类型对应的处理逻辑
      .addCase(getList.fulfilled, (state, { payload }) => { // payload
        state.managerList = payload.records;
        state.total = payload.total;
      })
      .addCase(getAdmin.fulfilled, (state, { payload }) => {
        state.editList = payload;
      })
  }
})

export default slice.reducer