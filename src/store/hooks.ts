import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;