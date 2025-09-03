import { createSlice } from '@reduxjs/toolkit';
import { addMonths, isFuture } from 'date-fns';

type SubscriptionState = {
  expiresAt?: string;
  paymentResult?: 'success' | 'error' | null;
};

const initialState: SubscriptionState = {
  expiresAt: undefined,
  paymentResult: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    subscribe: (state) => {
      state.expiresAt = addMonths(new Date(), 1).toISOString();
    },
    unsubscribe: (state) => {
      state.expiresAt = undefined;
    },
    setPaymentResult: (state, action) => {
      state.paymentResult = action.payload;
    },
    clearPaymentResult: (state) => {
      state.paymentResult = null;
    },
  },
  selectors: {
    selectIsSubscribed: (state) =>
      state.expiresAt && isFuture(new Date(state.expiresAt)),
    selectPaymentResult: (state) => state.paymentResult,
  },
});

export const { subscribe, unsubscribe, setPaymentResult, clearPaymentResult } = subscriptionSlice.actions;
export const { selectIsSubscribed, selectPaymentResult } = subscriptionSlice.selectors;
export default subscriptionSlice.reducer;
