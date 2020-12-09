import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface NetworkState {
  chainID: string
  lcd: string
  fcd: string
  ws: string
}

const initialState: NetworkState = {
  chainID: undefined,
  lcd: undefined,
  fcd: undefined,
  ws: undefined,
}

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetwork(state, action: PayloadAction<NetworkState>) {
      state = {
        ...action.payload,
      }
    },
  },
})

export const { setNetwork } = networkSlice.actions
