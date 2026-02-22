import { configureStore } from "@reduxjs/toolkit";
import rapportReducer from "./slices/rapportSlice";

export const store = configureStore({
  reducer: {
    rapport: rapportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;