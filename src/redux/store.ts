// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import exchangeReducer from './exchanges'; // 해당 경로에 실제 exchangeSlice.reducer 파일 위치

export const store = configureStore({
  reducer: {
    exchange: exchangeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
