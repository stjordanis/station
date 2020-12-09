import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StdSignMsg } from '@terra-money/terra.js'

export interface SignRequest {
  id: number
  unsignedTx: StdSignMsg.Data
  pending: boolean
  result: any
}

export interface QueueState {
  signRequests: SignRequest[]
}

const initialState: QueueState = {
  signRequests: [],
}

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    addRequest(state, action: PayloadAction<SignRequest>) {
      state.signRequests.push(action.payload)
    },

    resolveRequest(state, action: PayloadAction<{ id: number; result: any }>) {
      const index = state.signRequests.findIndex(
        (v, i) => v.id == action.payload.id
      )
      state.signRequests[index].pending = false
      state.signRequests[index].result = action.payload.result
    },

    removeRequest(state, action: PayloadAction<number>) {
      state.signRequests.splice(action.payload, 1)
    },
  },
})

export const { addRequest, resolveRequest, removeRequest } = queueSlice.actions
