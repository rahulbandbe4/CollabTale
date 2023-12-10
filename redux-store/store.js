import { configureStore } from '@reduxjs/toolkit';
import userAuthReducer from './slices/userAuthSlice'

const Store = configureStore({
    reducer: {
        user: userAuthReducer,
    }
})

export default Store;