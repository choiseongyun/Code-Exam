// Redux toolkit에서 비동기 thunk 생성, slice 생성, 페이로드 액션 타입을 가져옵니다.
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// HTTP 요청을 처리하기 위한 axios를 가져옵니다.
import axios from 'axios';
// 전체 애플리케이션 상태를 나타내는 RootState 타입을 가져옵니다.
import { RootState } from './store';

// Exchange 인터페이스는 거래소 정보를 나타냅니다.
export interface Exchange {
  id: string;
  name: string;
  year_established: number;
  country: string;
  trade_volume_24h_btc: number;
}

// fetchExchanges는 거래소 정보를 비동기적으로 가져오는 액션을 생성합니다.
export const fetchExchanges = createAsyncThunk('exchanges/fetchExchanges', async () => {
  const response = await axios.get<Exchange[]>('https://api.coingecko.com/api/v3/exchanges');
  return response.data;
});

// ExchangeState는 Exchange 관련 상태를 나타냅니다.
interface ExchangeState {
  entities: Exchange[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

// 초기 상태를 설정합니다.
const initialState: ExchangeState = {
  entities: [],
  loading: 'idle',
};

// Exchange 관련 상태와 액션을 처리하는 Redux slice를 생성합니다.
export const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {},
  // 비동기 액션 fetchExchanges에 대한 리듀서를 정의합니다.
  extraReducers: (builder) => {
    // fetchExchanges 액션이 pending 상태일 때 처리할 로직을 정의합니다.
    builder.addCase(fetchExchanges.pending, (state) => {
      state.loading = 'pending';
    });

    // fetchExchanges 액션이 fulfilled 상태일 때 처리할 로직을 정의합니다.
    builder.addCase(fetchExchanges.fulfilled, (state, action: PayloadAction<Exchange[]>) => {
      state.entities = action.payload;
      state.loading = 'succeeded';
    });

    // fetchExchanges 액션이 rejected 상태일 때 처리할 로직을 정의합니다.
    builder.addCase(fetchExchanges.rejected, (state) => {
      state.loading = 'failed';
    });
  },
});

// exchangeSlice의 reducer를 내보냅니다.
export default exchangeSlice.reducer;
