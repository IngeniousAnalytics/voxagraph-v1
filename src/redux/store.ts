import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import AIDAshboardReducer from '../services';

export const store = configureStore({
  reducer: {
    dashboardServices: AIDAshboardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
