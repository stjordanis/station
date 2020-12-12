import { AccAddress } from '@terra-money/terra.js'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface WalletState {
  address: AccAddress
}

const initialState: WalletState = {
  address: '',
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAddress(state, action: PayloadAction<AccAddress>) {
      state.address = action.payload
    },
  },
})

export const { setAddress } = walletSlice.actions
