// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BACKEND_URL } from '@src/configs'
import toast from 'react-hot-toast'
// ** Axios Imports
import axios from 'axios'

export const getData = createAsyncThunk('banner/getData', async params => {
  const result = await axios.post(`${BACKEND_URL}/api/banner`, { params })
    .then(response => {
      if (response.data.success) {
        return {
          allData: [],
          data: response.data.data.rows,
          totalPages: response.data.data.count,
          params
        }
      }
    }).catch(e => {
      console.log(e)
      toast.error('Backend Server Failed!')
      return {
        allData: [],
        data: [],
        totalPages: 0,
        params
      }
    })
  return result
})

export const addEvent = createAsyncThunk(
  'banner/addEvent',
  async (data, { dispatch, getState }) => {
    const result = await axios({
      method: "post",
      url: `${BACKEND_URL}/api/banner/add-event`,
      data,
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(response => {
        if (response.data.success) {
          toast.success('Successfully Added.')
          dispatch(getData(getState().banner.params))
          return response.data
        }
      }).catch(e => {
        console.log(e)
        toast.error('Backend Server Failed!')
      })
    return result
  }
)

export const updateEvent = createAsyncThunk(
  'banner/updateEvent',
  async (data, { dispatch, getState }) => {
    await axios({
      method: "post",
      url: `${BACKEND_URL}/api/banner/update-event`,
      data,
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(response => {
        if (response.data.success) {
          toast.success('Successfully Updated.')
          dispatch(getData(getState().banner.params))
          return response.data
        }
      }).catch(e => {
        console.log(e)
        toast.error('Backend Server Failed!')
      })
    return result
  }
)

export const deleteEvent = createAsyncThunk(
  'banner/deleteEvent',
  async (id, { dispatch, getState }) => {
    await axios.post(`${BACKEND_URL}/api/banner/delete-event`, { id })
      .then(response => {
        if (response.data.success) {
          toast.success('Successfully Deleted.')
          dispatch(getData(getState().banner.params))
          return response.data
        }
      }).catch(e => {
        console.log(e)
        toast.error('Backend Server Failed!')
      })
    return result
  }
)

export const bannerSlice = createSlice({
  name: 'banner',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.totalPages
    })
  }
})

export default bannerSlice.reducer
