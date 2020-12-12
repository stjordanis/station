import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface NetworkState {
  chainID: string
  lcd: string
  fcd: string
  ws: string
}

const initialState: NetworkState = {
  chainID: '',
  lcd: '',
  fcd: '',
  ws: '',
}

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetwork(state, action: PayloadAction<NetworkState>) {
      const { chainID, lcd, fcd, ws } = action.payload
      state.chainID = chainID
      state.lcd = lcd
      state.fcd = fcd
      state.ws = ws
    },
  },
})

export const { setNetwork } = networkSlice.actions
