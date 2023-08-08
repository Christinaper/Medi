// createAsyncThunk是一个函数，接受一个action类型的字符串和返回一个Promise的回调函数。
// createSlice是一个函数，接受一个初始状态，一个reducer函数的对象，一个slice名字，
// 自动生成对应于reducer 和 状态的action创建器 和 action类型
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

export const getList = createAsyncThunk(
  'retail/getList',                                   // thunk名称
  async (params) => await api.retail.getList(params)  // 异步回调函数
)
export const getDetail = createAsyncThunk(
  'retail/getDetail',
  async (params) => await api.retail.getDetail(params)
)
export const changeStatus = createAsyncThunk(
  'retail/changeStatus',
  async (params) => await api.retail.changeStatus(params)
)
const slice = createSlice({
  name: 'retail',
  initialState: {getRetailList: [], total: 0, detailList: []},
  extraReducers: builder => {
    builder
      .addCase(getList.fulfilled, (state, {payload}) => {
        state.getRetailList = payload.records
        console.log(state.getRetailList)
        state.total = payload.total
      })
      .addCase(getDetail.fulfilled, (state, {payload}) => {
        state.detailList = payload
        console.log(state.detailList)
      })
  }
})

export default slice.reducer