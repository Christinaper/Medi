// createAsyncThunk是一个函数，接受一个action类型的字符串和返回一个Promise的回调函数。
// createSlice是一个函数，接受一个初始状态，一个reducer函数的对象，一个slice名字，
// 自动生成对应于reducer 和 状态的action创建器 和 action类型
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

export const getList = createAsyncThunk(
  'category/getList',                                   // thunk名称
  async (params) => await api.category.getList(params)  // 异步回调函数
)
export const getModel = createAsyncThunk(
  'category/getModel',
  async (params) => await api.category.getModel(params)
)
export const add = createAsyncThunk(
  'category/add',
  async (params) => await api.category.add(params)
)
export const update = createAsyncThunk(
  'category/update',
  async (params) => await api.category.update(params)
)
export const remove = createAsyncThunk(
  'category/remove',
  async (params) => await api.category.remove(params)
)
const slice = createSlice({
  name: 'category',
  initialState: {getCategoryList: [], total: 0, editList:{}},
  extraReducers: builder => {
    builder
      .addCase(getList.fulfilled, (state, {payload}) => {
        state.getCategoryList = payload.records
        state.total = payload.total
      })
      .addCase(getModel.fulfilled, (state, {payload}) => {
        state.editList = payload
      })
  }
})

export default slice.reducer