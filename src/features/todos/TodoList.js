import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import TodoListItem from './TodoListItem'

import { selectFilteredTodoIds } from './todosSlice'

// const selectTodoIds = (state) => state.todos.map((todo) => todo.id)

const TodoList = () => {
  // const todoIds = useSelector(selectTodoIds, shallowEqual)

  // Any time the state.todos array changes,
  // we're going to create a new todo IDs array as a result.
  const todoIds = useSelector(selectFilteredTodoIds)
  const loadingStatus = useSelector((state) => state.todos.status)

  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader"></div>
      </div>
    )
  }

  // since `todos` is an array, we can loop over it
  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
