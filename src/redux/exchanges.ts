import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export interface Exchange {
  id: string;
  name: string;
  year_established: number;
  country: string;
  trade_volume_24h_btc: number;
}

export const fetchExchanges = createAsyncThunk('exchanges/fetchExchanges', async () => {
  const response = await axios.get<Exchange[]>('https://api.coingecko.com/api/v3/exchanges');
  return response.data;
});

interface ExchangeState {
  entities: Exchange[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: ExchangeState = {
  entities: [],
  loading: 'idle',
};

export const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExchanges.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchExchanges.fulfilled, (state, action: PayloadAction<Exchange[]>) => {
      state.entities = action.payload;
      state.loading = 'succeeded';
    });
    builder.addCase(fetchExchanges.rejected, (state) => {
      state.loading = 'failed';
    });
  },
});

export default exchangeSlice.reducer;
