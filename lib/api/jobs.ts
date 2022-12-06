import useData from './'

export function useJobsToDo() {
  return useData(`job/todo`, 'jobsToDo')
}
