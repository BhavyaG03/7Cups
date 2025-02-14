import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  listenerId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    endChat: (state, action) => {
      state.userId = action.payload.userId;
      state.listenerId = action.payload.listenerId;
    },
  },
});

export const { endChat } = chatSlice.actions;
export default chatSlice.reducer;
