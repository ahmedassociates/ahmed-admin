import {createSlice} from '@reduxjs/toolkit';

const navslice = createSlice({
  name: 'nav',
  initialState: {
    navStatus: false,
  },
  reducers: {
    setNavStatus(state, aciton) {
      state.navStatus = aciton.payload;
    },
  },
});

export const {setNavStatus} = navslice.actions;
export default navslice.reducer;
