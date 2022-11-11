import create from 'zustand'
// create store
const useStore = create((set) => ({
  color: 'white',
  changeColor: () =>
    set((state) => ({ color: state.color === 'white' ? '#212529' : 'white' })),
}))
export default useStore
