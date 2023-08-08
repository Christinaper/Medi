// createAsyncThunk是一个函数，接受一个action类型的字符串和返回一个Promise的回调函数。
// createSlice是一个函数，接受一个初始状态，一个reducer函数的对象，一个slice名字，
// 自动生成对应于reducer 和 状态的action创建器 和 action类型
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

export const getList = createAsyncThunk(
  'info/getList',                                   // thunk名称
  async (params) => await api.info.getList(params)  // 异步回调函数
)
export const getCategory = createAsyncThunk(
  'info/getCategory',
  async () => await api.info.getCategory()
)
export const getInfo = createAsyncThunk(
  'info/getInfo',
  async (params) => await api.info.getInfo(params)
)
export const add = createAsyncThunk(
  'info/add',
  async (params) => await api.info.add(params)
)
export const update = createAsyncThunk(
  'info/update', 
  async (params) => await api.info.update(params)
)
export const remove = createAsyncThunk(
  'info/remove', 
  async (params) => await api.info.remove(params)
)
export const upload = createAsyncThunk(
  'info/upload', 
  async (params) => await api.user.upload(params)
)
const slice = createSlice({
  name: 'info',
  initialState: {infoList: [], total: 0, categoryList: [], editList: []},
  extraReducers: builder => {
    builder
      .addCase(getList.fulfilled, (state, {payload}) => {
        state.infoList = payload.records
        console.log(state.infoList)
        state.total = payload.total
      })
      .addCase(getCategory.fulfilled, (state, {payload}) => {
        state.categoryList = payload
        console.log(state.categoryList)
      })
      .addCase(getInfo.fulfilled, (state, {payload}) => {
        state.editList = payload
      })
  }
})

export default slice.reducer