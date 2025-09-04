import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  inquiries: [],
  isLoading: false,
  error: null,
}

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { clearError } = inquirySlice.actions
export default inquirySlice.reducer
