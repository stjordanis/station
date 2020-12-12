import { createStore, combineReducers } from 'redux'

import { walletSlice } from '../slices/walletSlice'
import { queueSlice } from '../slices/queueSlice'
import { networkSlice } from '../slices/networkSlice'

import { wrapStore } from 'webext-redux'

const rootReducer = combineReducers({
  wallet: walletSlice.reducer,
  network: networkSlice.reducer,
  queue: queueSlice.reducer,
})

export const store = createStore(rootReducer)

wrapStore(store)
