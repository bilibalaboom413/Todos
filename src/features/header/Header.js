import React, { useState } from 'react'

import { useDispatch } from 'react-redux'

import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const dispatch = useDispatch()

  const handleChange = (e) => setText(e.target.value)

  const handleKeyDown = async (e) => {
    const trimmedText = e.target.value.trim()
    // e.which === 13
    if (e.key === 'Enter' && trimmedText) {
      // dispatch({ type: 'todos/todoAdded', payload: trimmedText })
      // const saveNewTodoThunk = saveNewTodo(trimmedText)
      setStatus('loading')
      await dispatch(saveNewTodo(trimmedText))
      setText('')
      setStatus('idle')
    }
  }

  let isLoading = status === 'loading'
  let placeholder = isLoading ? '' : 'What needs to be done?'
  let loader = isLoading ? <div className="loader" /> : null

  return (
    // <header className="header">
    //   <input
    //     className="new-todo"
    //     placeholder="What needs to be done?"
    //     value={text}
    //     onChange={handleChange}
    //   />
    // </header>
    <header className="header">
      <input
        className="new-todo"
        type="text"
        placeholder={placeholder}
        autoFocus={true}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {loader}
    </header>
  )
}

export default Header
