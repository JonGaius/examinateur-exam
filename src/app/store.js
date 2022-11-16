import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import examenReducer from '../features/examens/examenSlice'


export const store = configureStore({
    reducer: {
      auth: authReducer,
      examen: examenReducer,
    }
})