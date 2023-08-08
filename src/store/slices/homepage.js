import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

export const getCount = createAsyncThunk(
  'homepage/getCount',
  async () => await api.homepage.getCount()
)

export const getProductCount = createAsyncThunk(
  'homepage/getProductCount',
  async () => await api.homepage.getProductCount()
)

const slice = createSlice({
  name: 'homepage', 
  initialState: {order: {}, categoryList: []},
  extraReducers: builder => {
    builder
      .addCase(getCount.fulfilled, (state, {payload}) => {
        state.order = payload
        console.log(state.order)
      })
      .addCase(getProductCount.fulfilled, (state, {payload}) => {
        state.categoryList = payload
        console.log(state.categoryList)
      })
  }
})
export default slice.reducer