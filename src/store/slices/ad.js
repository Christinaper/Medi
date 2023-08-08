// createAsyncThunk是一个函数，接受一个action类型的字符串和返回一个Promise的回调函数。
// createSlice是一个函数，接受一个初始状态，一个reducer函数的对象，一个slice名字，
// 自动生成对应于reducer 和 状态的action创建器 和 action类型
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

// 轮播图列表
export const getCarousel = createAsyncThunk(
  'ad/getCarousel',                                   // thunk名称
  async (params) => await api.ad.getCarousel(params)  // 异步回调函数
)
export const saveCarousel = createAsyncThunk(
  'ad/saveCarousel',
  async (params) => await api.ad.saveCarousel(params)
)
// 轮播图商品列表
export const getProductList = createAsyncThunk(
  'ad/getProductList',
  async (params) => await api.ad.getProductList(params)
)
// 推荐列表
export const getRecommend = createAsyncThunk(
  'ad/getRecommend',
  async (params) => await api.ad.getRecommend(params)
)
// 分类列表
export const getCategoryList = createAsyncThunk(
  'ad/getCategoryList',
  async (params) => await api.ad.getCategoryList(params)
)
export const saveRecommend = createAsyncThunk(
  'ad/saveRecommend',
  async (params) => await api.ad.saveRecommend(params)
)
const slice = createSlice({
  name: 'ad',
  initialState: {carousel: [], productList: [], categoryList: [], recommend: []},
  extraReducers: builder => {
    builder
      .addCase(getCarousel.fulfilled, (state, {payload}) => {
        state.carousel = payload
        console.log(state.carousel)
      })
      .addCase(getProductList.fulfilled, (state, {payload}) => {
        state.productList = payload
        console.log(state.productList)
      })
      .addCase(getRecommend.fulfilled, (state, {payload}) => {
        state.recommend = payload
      })
      .addCase(getCategoryList.fulfilled, (state, {payload}) => {
        state.categoryList = payload
      })
  }
})

export default slice.reducer