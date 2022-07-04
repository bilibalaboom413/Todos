import { configureStore } from '@reduxjs/toolkit'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

/**
 * That one call to configureStore did all the work for us:
 * It combined todosReducer and filtersReducer into the root reducer function, which will handle a root state that looks like {todos, filters}
 * It created a Redux store using that root reducer
 * It automatically added the thunk middleware
 * It automatically added more middleware to check for common mistakes like accidentally mutating the state
 * It automatically set up the Redux DevTools Extension connection
 */
const store = configureStore({
  reducer: {
    todos: todosReducer,
    filters: filtersReducer,
  },
})

export default store
