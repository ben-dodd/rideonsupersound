import create, { State, StoreApi, UseBoundStore } from 'zustand'
import dayjs from 'dayjs'
import produce from 'immer'
import { StoreState } from './types'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export const createSelectors = <S extends UseBoundStore<StoreApi<State>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }
  return store
}

export const errorHandler = (method: string, route: string) => (err: any) => {
  if (err.message === 'Not Found') {
    throw Error(
      `Error: You need to implement an API route for ${method} ${route}`
    )
  } else {
    throw Error(`${err.message} on ${method} ${route}`)
  }
}

export const useAppStore = createSelectors(
  create<StoreState>((set, get) => ({
    view: {},
    cart: { id: null, customer: {}, transactions: [] },
    loadedItemId: {},
    loadedVendorId: {},
    loadedHoldId: {},
    loadedSaleId: {},
    loadedStocktakeId: 0,
    loadedStocktakeTemplateId: 0,
    createableCustomerName: '',
    sellSearchBar: '',
    confirmModal: { open: false },
    alert: { open: false },
    receiveStock: {},
    bypassRegister: false,
    salesView: 'day',
    salesViewRange: {
      startDate: dayjs().startOf('week').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    },
    salesViewClerks: [],
    tableMode: false,
    compactMode: false,
    openView: (view) =>
      set(
        produce((draft) => {
          draft.view[view] = true
        })
      ),
    closeView: (view) =>
      set(
        produce((draft) => {
          draft.view[view] = false
        })
      ),
    openConfirm: (confirm) =>
      set(
        produce((draft) => {
          draft.confirmModal = confirm
        })
      ),
    closeConfirm: () =>
      set(
        produce((draft) => {
          draft.confirmModal = { open: false }
        })
      ),
    setAlert: (alert) =>
      set(
        produce((draft) => {
          draft.alert = alert
        })
      ),
    closeAlert: () =>
      set(
        produce((draft) => {
          draft.alert = null
        })
      ),
    setCart: (update) =>
      set(
        produce((draft) => {
          Object.entries(update).forEach(
            ([key, value]) => (draft.cart.key = value)
          )
        })
      ),
    addCartItem: (newItem) =>
      set(
        produce((draft) => {
          draft.cart.items.push(newItem)
        })
      ),
    setCartItem: (id, update) =>
      set(
        produce((draft) => {
          draft.cart.items[id] = { ...get().cart.items[id], ...update }
        })
      ),
    setCustomer: (update) =>
      set(
        produce((draft) => {
          Object.entries(update).forEach(
            ([key, value]) => (draft.cart.customer[key] = value)
          )
        })
      ),
    addCartTransaction: (transaction) =>
      set(
        produce((draft) => {
          draft.cart.transactions.push(transaction)
        })
      ),
    resetCart: () =>
      set(
        produce((draft) => {
          draft.cart = { id: null, customer: {} }
        })
      ),
    resetCustomer: () =>
      set(
        produce((draft) => {
          draft.cart.customer = {}
        })
      ),
    resetSellSearchBar: () =>
      set(
        produce((draft) => {
          draft.sellSearchBar = ''
        })
      ),
    toggleCompactMode: () =>
      set(
        produce((draft) => {
          draft.compactMode = !get().compactMode
        })
      ),
    toggleTableMode: () =>
      set(
        produce((draft) => {
          draft.tableMode = !get().tableMode
        })
      ),
    toggleBypassRegister: () =>
      set(
        produce((draft) => {
          draft.bypassRegister = !get().bypassRegister
        })
      ),
    setLoadedStocktakeTemplateId: (id) =>
      set(
        produce((draft) => {
          draft.loadedStocktakeTemplateId = id
        })
      ),
    setLoadedVendorId: (id) =>
      set(
        produce((draft) => {
          draft.loadedVendorId = id
        })
      ),
  }))
)
