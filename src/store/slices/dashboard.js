import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

export const getMenu = createAsyncThunk(
  "dashboard/getMenu", // 类型前缀
  async () => await api.user.getMenu()
)

export const getRoutes = createAsyncThunk(
  "dashboard/getRoutes",
  async () => await api.user.getRoutes()
)

const slice = createSlice({
  name: 'dashboard',
  initialState: {menu: [], dynamicRoutes: []},
  extraReducers: builder => {
    builder
      // {payload}从state中解构出payload赋值给payload{payload: payload}
      // 赋值给state.menu 
      .addCase(getMenu.fulfilled, (state, {payload}) => {state.menu = payload}) 
      .addCase(getRoutes.fulfilled, (state, {payload}) => {
        state.dynamicRoutes = payload
        console.log(state.dynamicRoutes)
      }) 
  }
})

export default slice.reducer