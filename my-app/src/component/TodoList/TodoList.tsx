import { type } from 'os'
import { useEffect, useState } from 'react'
import { Todo } from '../../@types/todo.types'
import TaskInput from '../TaskInput'
import TaskList from '../TaskList'
import styles from './todoList.module.scss'

// interface HandleNewTodos {
//   (todos: Todo[]): Todo[]
// }

type HandleNewTodos = (todos: Todo[]) => Todo[]

const syncReactToLocal = (handlerNewTodo: HandleNewTodos) => {
  const todosString = localStorage.getItem('todo')
  const todosObj: Todo[] = JSON.parse(todosString || '[]')
  const newTodosObj = handlerNewTodo(todosObj)
  localStorage.setItem('todo', JSON.stringify(newTodosObj))
}

export default function TodoList() {
  const [todos, setToDos] = useState<Todo[]>([])
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)
  const doneTodos = todos.filter((todo) => todo.done)
  const notDoneTodos = todos.filter((todo) => !todo.done)

  useEffect(() => {
    const todosString = localStorage.getItem('todo')
    const todosObj: Todo[] = JSON.parse(todosString || '[]')
    setToDos(todosObj)
  }, [])

  const addToDo = (name: string) => {
    const todo: Todo = {
      name,
      done: false,
      id: new Date().toISOString()
    }
    setToDos((prev) => [...prev, todo])
    syncReactToLocal((todosObj: Todo[]) => [...todosObj, todo])
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

  const startEditTodo = (id: string) => {
    const findedTodo = todos.find((todo) => todo.id === id)
    if (findedTodo) {
      setCurrentTodo(findedTodo)
    }
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name }
      return prev
    })
  }

  const finishEditTodo = () => {
    const handler = (todosObj: Todo[]) => {
      return todosObj.map((todo) => {
        if (todo.id === (currentTodo as Todo).id) {
          return currentTodo as Todo
        }
        return todo
      })
    }
    setToDos(handler)
    setCurrentTodo(null)
    syncReactToLocal(handler)
  }

  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null)
    }
    const handler = (todoObj: Todo[]) => {
      const findedIndexTodo = todoObj.findIndex((todo) => todo.id === id)
      if (findedIndexTodo > -1) {
        const result = [...todoObj]
        result.splice(findedIndexTodo, 1)
        return result
      }
      return todoObj
    }
    setToDos(handler)
    syncReactToLocal(handler)
  }

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput addToDo={addToDo} currentTodo={currentTodo} editTodo={editTodo} finishEditTodo={finishEditTodo} />
        <TaskList
          todos={notDoneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          doneTaskList
          todos={doneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}
