import testConn from '../testConn'

const { getTodos, getTodo, addTodo, updateTodo, deleteTodo } = require('./todos')

beforeAll(() => testConn.migrate.latest())

beforeEach(() => testConn.seed.run())

afterAll(() => testConn.destroy())

describe('getTodos', () => {
  it('gets all todos in the db', () => {
    return getTodos(testConn).then((todos) => {
      expect(todos).toHaveLength(3)
    })
  })
})

describe('getTodo', () => {
  it('gets todo that matches the id', () => {
    return getTodo(1, testConn).then((todo) => {
      expect(todo.id).toBe(1)
    })
  })
  it('returns if not found', () => {
    return getTodo(5, testConn).then((todo) => {
      expect(todo).toBeUndefined()
    })
  })
})

describe('addTodo', () => {
  it('adds a new todo to the db', () => {
    return addTodo('Do your Trello ticket', testConn).then(() => {
      return getTodo(4, testConn).then((todo) => expect(todo.text).toContain('Trello'))
    })
  })
})

describe('deleteTodo', () => {
  it('deletes a todo matching the id', () => {
    return deleteTodo(2, testConn).then(() => {
      return getTodo(2, testConn).then((todo) => {
        expect(todo).toBeUndefined()
      })
    })
  })
})

describe('updateTodo', () => {
  it('updates a todo with new text', () => {
    return updateTodo('Wash the cat', 2, testConn).then(() => {
      return getTodo(2, testConn).then((todo) => {
        expect(todo.text).toBe('Wash the cat')
      })
    })
  })
})
