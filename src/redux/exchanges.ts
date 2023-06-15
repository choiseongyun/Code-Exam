import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export interface Exchange {
  id: string;
  name: string;
  year_established: number;
  country: string;
  trade_volume_24h_btc: number;
  supportedPairs: string[]; // 거래소에서 지원하는 거래쌍 목록
}

export const updateSortOrder = createAction<'asc' | 'desc'>('exchanges/updateSortOrder');

interface ExchangeState {
  entities: Exchange[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  sortOrder: 'asc' | 'desc';
  sortedEntities: Exchange[];
}

const initialState: ExchangeState = {
  entities: [],
  loading: 'idle',
  sortOrder: 'asc',
  sortedEntities: [],
};

export const fetchExchanges = createAsyncThunk('exchanges/fetchExchanges', async () => {
  const response = await axios.get<Exchange[]>('https://api.coingecko.com/api/v3/exchanges');
  const exchanges = response.data.map((exchange) => ({
    ...exchange,
    supportedPairs: [], // 초기값으로 빈 배열 설정
  }));
  return exchanges;
});

export const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExchanges.fulfilled, (state, action: PayloadAction<Exchange[]>) => {
      state.entities = action.payload;
      state.sortedEntities = action.payload;
      state.loading = 'succeeded';
    });
    builder.addCase(updateSortOrder, (state, action) => {
      state.sortOrder = action.payload;
      state.sortedEntities = [...state.entities].sort((a, b) => {
        if (state.sortOrder === 'asc') {
          return a.trade_volume_24h_btc - b.trade_volume_24h_btc; // 숫자로 비교
        } else {
          return b.trade_volume_24h_btc - a.trade_volume_24h_btc; // 숫자로 비교
        }
      });
    });
  },
});

export default exchangeSlice.reducer;
