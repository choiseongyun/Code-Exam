// Redux toolkit을 이용하여 상태관리를 위한 스토어를 구성합니다.
import { configureStore } from '@reduxjs/toolkit';
// exchange에 대한 reducer를 가져옵니다.
import exchangeReducer from './exchanges';

// configureStore를 이용해 스토어를 생성합니다. 이때 reducer로 exchangeReducer를 사용합니다.
export const store = configureStore({
  reducer: {
    exchange: exchangeReducer,
  },
});

// RootState는 스토어의 현재 상태를 나타내는 타입입니다.
export type RootState = ReturnType<typeof store.getState>;
// AppDispatch는 스토어의 dispatch 함수의 타입을 나타냅니다. 
// 이를 통해 dispatch를 통해 action을 스토어에 전달할 수 있습니다.
export type AppDispatch = typeof store.dispatch;
