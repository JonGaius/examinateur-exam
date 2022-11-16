import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { isLoggin } from '../../utils/sharedFunction'
import authService from './authService'

// Get user from localStorage
const user = isLoggin("auth-dgttm")
const userInfo = JSON.parse(localStorage.getItem('auth-dgttm-user'))
const examinateurInfo = JSON.parse(localStorage.getItem('auth-dgttm-examinateur'))

const initialState = {
    user: user ? user : null,
    examinateur: examinateurInfo ? examinateurInfo : null,
    me: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    isEditError: false,
    isEditSuccess: false,
    isEditLoading: false,
    message: '',
}

export const login = createAsyncThunk(
    'auth/login', 
    async (data, thunkAPI) => {
    try {
      return await authService.login(data)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const getMe = createAsyncThunk(
    'auth/me',
    async (data = userInfo.user_slug, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user
        return await authService.me(data, token)
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
    }
)

export const updateInfos = createAsyncThunk(
    'auth/update-info',
    async (data, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user
        return await authService.updateInfos(data, token)
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
    }
)

export const updatePassword = createAsyncThunk(
    'auth/update-password',
    async (data, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user
        return await authService.updatePassword(data, token)
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
    }
)

export const logout = createAsyncThunk(
    'auth/logout', 
    async () => {
    await authService.logout()
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      reset: (state) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = false
        state.isEditError = false
        state.isEditLoading = false
        state.isEditSuccess = false
        state.message = ''
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.user = action.payload
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
          state.user = null
        })
        .addCase(getMe.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.me = action.payload
        })
        .addCase(getMe.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
          state.me = null
        })
        .addCase(updateInfos.pending, (state) => {
            state.isEditLoading = true
        })
        .addCase(updateInfos.fulfilled, (state, action) => {
            state.isEditLoading = false
            state.isEditSuccess = true
            // state.me = action.payload
        })
        .addCase(updateInfos.rejected, (state, action) => {
          state.isEditLoading = false
          state.isEditError = true
          state.message = action.payload
          // state.me = null
        })
        .addCase(updatePassword.pending, (state) => {
            state.isEditLoading = true
        })
        .addCase(updatePassword.fulfilled, (state, action) => {
            state.isEditLoading = false
            state.isEditSuccess = true
            // state.me = action.payload
        })
        .addCase(updatePassword.rejected, (state, action) => {
          state.isEditLoading = false
          state.isEditError = true
          state.message = action.payload
          // state.me = null
        })
        .addCase(logout.fulfilled, (state) => {
          state.user = null
        })
    },
})
  
export const { reset } = authSlice.actions
export default authSlice.reducer