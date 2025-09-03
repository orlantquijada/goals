import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { rememberEnhancer, rememberReducer } from 'redux-remember';
import goalsReducer from './goals-store';
import subscriptionReducer from './subscription-store';
import todoReducer from './todo-store';

export const store = configureStore({
  reducer: rememberReducer({
    todos: todoReducer,
    goals: goalsReducer,
    subscription: subscriptionReducer,
  }),

  enhancers: (getDefaultEnhancers) => {
    return getDefaultEnhancers().concat(
      rememberEnhancer(AsyncStorage, ['goals', 'subscription'])
    );
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
