import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import examenService from './examenService'

const initialState = {
    examens: null,
    sujets: null,
    examen: null,

    isError: false,
    isSuccess: false,
    isLoading: false,

    isEditError: false,
    isEditSuccess: false,
    isEditLoading: false,

    isSujetError: false,
    isSujetSuccess: false,
    isSujetLoading: false,
    message: '',
}

export const getTodayExams = createAsyncThunk(
    'examen/today',
    async (data, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user
        return await examenService.getTodayExams(data, token)
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

export const getExam = createAsyncThunk(
  'examen/show',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user
      return await examenService.getExam(data, token)
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

export const updateExam = createAsyncThunk(
  'examen/edit',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user
      return await examenService.updateExam(data, token)
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

export const getSujets = createAsyncThunk(
  'examen/sujet',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user
      return await examenService.getSujets(data, token)
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

export const getMyPrograms = createAsyncThunk(
  'examen/my-program',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user
      return await examenService.getMyPrograms(data, token)
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
export const getExams = createAsyncThunk(
    'examen/etat',
    async (data, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user
        return await examenService.getExams(data, token)
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

export const examenSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      reset: (state) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = false
        state.isEditLoading = false
        state.isEditSuccess = false
        state.isEditError = false
        state.message = ''
      },
    },
    extraReducers: (builder) => {
      builder
        
        .addCase(getMyPrograms.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getMyPrograms.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.examens = action.payload
        })
        .addCase(getMyPrograms.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.examens = null
        })

        .addCase(getExam.pending, (state) => {
          state.isLoading = true
        })
        .addCase(getExam.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.examen = action.payload
        })
        .addCase(getExam.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.examen = null
        })
        
        .addCase(getExams.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getExams.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.examens = action.payload
        })
        .addCase(getExams.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.examens = null
        })

        .addCase(updateExam.pending, (state) => {
          state.isEditLoading = true
        })
        .addCase(updateExam.fulfilled, (state, action) => {
            state.isEditLoading = false
            state.isEditSuccess = true
            state.message = action.payload
        })
        .addCase(updateExam.rejected, (state, action) => {
            state.isEditLoading = false
            state.isEditError = true
            state.message = action.payload
            // state.examen = null
        })

        .addCase(getTodayExams.pending, (state) => {
          state.isLoading = true
        })
        .addCase(getTodayExams.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.examens = action.payload
        })
        .addCase(getTodayExams.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.examens = null
        })

        .addCase(getSujets.pending, (state) => {
            state.isSujetLoading = true
        })
        .addCase(getSujets.fulfilled, (state, action) => {
            state.isSujetLoading = false
            state.isSujetSuccess = true
            state.sujets = action.payload
        })
        .addCase(getSujets.rejected, (state, action) => {
            state.isSujetLoading = false
            state.isSujetError = true
            state.message = action.payload
            state.sujets = null
        })
    },
})
  
export const { reset } = examenSlice.actions
export default examenSlice.reducer