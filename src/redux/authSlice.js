import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  admin: null,
};

const authSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload;
    },
    clearAdmin(state) {
      state.admin = null;
    },
  },
});

export const {setAdmin, clearAdmin} = authSlice.actions;
export default authSlice.reducer;
