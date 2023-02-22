import { useState } from 'react'
import { Todo } from '../../@types/todo.types'
import TaskInput from '../TaskInput'
import TaskList from '../TaskList'
import styles from './todoList.module.scss'
export default function TodoList() {
  const [todos, setToDos] = useState<Todo[]>([])

  const doneTodos = todos.filter((todo) => todo.done)
  const notDoneTodos = todos.filter((todo) => !todo.done)

  const addToDo = (name: string) => {
    const todo: Todo = {
      name,
      done: false,
      id: new Date().toISOString()
    }
    setToDos((prev) => [...prev, todo])
  }

  const handleDoneTodo = (id: string, done: boolean) => {
    setToDos((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    })
  }

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput addToDo={addToDo} />
        <TaskList todos={notDoneTodos} handleDoneTodo={handleDoneTodo} />
        <TaskList doneTaskList todos={doneTodos} handleDoneTodo={handleDoneTodo} />
      </div>
    </div>
  )
}
