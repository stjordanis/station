import { createStore, combineReducers } from 'redux'

import { walletSlice } from './slices/walletSlice'
import { queueSlice } from './slices/queueSlice'
import { networkSlice } from './slices/networkSlice'

import { persistStore, persistReducer } from 'redux-persist'
// @ts-ignore
import { localStorage } from 'redux-persist-webextension-storage'

const rootReducer = persistReducer(
  { key: 'root', storage: localStorage },
  combineReducers({
    wallet: walletSlice.reducer,
    network: networkSlice.reducer,
    queue: queueSlice.reducer,
  })
)

export const store = createStore(rootReducer)
export const persistor = persistStore(store)
