import attractionsReducer from "./modules/store"
import { configureStore } from "@reduxjs/toolkit"

const store = configureStore({
    reducer:{
        attractions:attractionsReducer
    }
})

export default store;