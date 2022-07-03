import { client } from '../../api/client'

import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle',
  entities: [],
}

// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
//   return maxId + 1
// }

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading',
      }
    }
    case 'todos/todosLoaded': {
      // Replace the existing state entirely by returning the new value
      return {
        ...state,
        status: 'idle',
        entities: action.payload,
      }
    }
    case 'todos/todoAdded': {
      // Return a new todos state array with the new todo item at the end
      return {
        ...state,
        entities: [...state.entities, action.payload],
      }

      // Can return just the new todos array - no extra object around it
      // {
      //   id: nextTodoId(state),
      //   text: action.payload,
      //   completed: false,
      // },
    }
    case 'todos/todoToggled': {
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.id !== action.payload) {
            return todo
          }

          return {
            ...todo,
            completed: !todo.completed,
          }
        }),
      }
    }
    case 'todos/colorSelected': {
      const { color, todoId } = action.payload
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.id !== todoId) {
            return todo
          }

          return {
            ...todo,
            color,
          }
        }),
      }
    }
    case 'todos/todoDeleted': {
      return {
        ...state,
        entities: state.entities.filter((todo) => todo.id !== action.payload),
      }
    }
    case 'todos/allCompleted': {
      return {
        ...state,
        entities: state.entities.map((todo) => {
          return { ...todo, completed: true }
        }),
      }
    }
    case 'todos/completedCleared': {
      return {
        ...state,
        entities: state.entities.filter((todo) => !todo.completed),
      }
    }
    default:
      return state
  }
}

export const todosLoading = () => ({ type: 'todos/todosLoading' })

export const allTodosCompleted = () => ({ type: 'todos/allCompleted' })

export const completedTodosCleared = () => ({ type: 'todos/completedCleared' })

export const todosLoaded = (todos) => {
  return {
    type: 'todos/todosLoaded',
    payload: todos,
  }
}

export const todoAdded = (todo) => {
  return {
    type: 'todos/todoAdded',
    payload: todo,
  }
}

// export async function fetchTodos(dispatch, getState) {
//   const response = await client.get('/fakeApi/todos')

// const stateBefore = getState()
// console.log('Todos before dispatch: ', stateBefore.todos.length)

// dispatch({ type: 'todos/todosLoaded', payload: response.todos })

// const stateAfter = getState()
// console.log('Todos after dispatch: ', stateAfter.todos.length)
//   dispatch(todoLoaded(response.todos))
// }

export const fetchTodos = () => async (dispatch) => {
  dispatch(todosLoading())
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}

export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    // dispatch({ type: 'todos/todoAdded', payload: response.todo })
    dispatch(todoAdded(response.todo))
  }
}

export const selectTodoIds = createSelector(
  (state) => state.todos,
  (todos) => todos.map((todo) => todo.id)
)

export const selectTodos = (state) => state.todos.entities

export const selectTodoById = (state, todoId) => {
  return selectTodos(state).find((todo) => todo.id === todoId)
}

export const selectFilteredTodos = createSelector(
  // First input selectors: all todos
  selectTodos,
  // Second input selector: all filter values
  (state) => state.filters,
  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    // Boolean
    const completedStatus = status === StatusFilters.Completed
    return todos.filter((todo) => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus

      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
)
