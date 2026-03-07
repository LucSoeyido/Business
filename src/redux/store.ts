import { configureStore } from "@reduxjs/toolkit";
import rapportReducer from "./slices/rapportSlice";
import sessionReducer from "./slices/sessionSlice"
import depenseReducer from "./slices/depenseSlice"

export const store = configureStore({
  reducer: {
    rapport: rapportReducer,
    session: sessionReducer,
    depense: depenseReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;