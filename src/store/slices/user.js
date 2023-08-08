import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

//createSlice创建的是一个切片
//这个切片是一个对象，这个对象有两个属性：（数据的形状），reducer,actions
export const login = createAsyncThunk( //异步发送ajax
  'user/login',
  async (params) => await api.user.login(params) //return出去发送ajax的数据
)
export const changePwd = createAsyncThunk(
  'login/changePwd',
  async (params) => await api.user.changePwd(params)
)
const slice = createSlice({
  name: "user", //actionType的前缀
  initialState: {userLogin: {}, password: false},
  reducers: {
    logout: (state) => { state.password = false } //登出（同步操作），使password变成false
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, {payload}) => {
        state.userLogin = payload
        console.log(payload)
        sessionStorage.setItem('token', JSON.stringify(payload))
      })
      .addCase(changePwd.fulfilled, (state, {payload}) => {
       state.password = payload
      })
  }
})
export const { logout } = slice.actions
export default slice.reducer;