import {configureStore} from '@reduxjs/toolkit'
import userSlice from './features/userSlice'
import serverAPI from './services/serverAPI'

// perist our store
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import {persistReducer} from 'redux-persist'
import thunk from 'redux-thunk'

// reducers
const reducer = combineReducers({
    user: userSlice,
    [serverAPI.reducerPath]: serverAPI.reducer,
})

const persistConfig = {
    key: 'root',
    storage,
    blackList: [serverAPI.reducerPath],
}

// persist our store

const persistedReducer = persistReducer(persistConfig, reducer)

// create the store

const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk, serverAPI.middleware],
})


export default store