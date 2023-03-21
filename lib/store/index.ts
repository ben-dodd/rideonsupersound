import create, { State, StoreApi, UseBoundStore } from 'zustand'
import dayjs from 'dayjs'
import produce from 'immer'
import { Pages, StoreState } from './types'
import { v4 as uuid } from 'uuid'
import { useSetWeatherToCart } from 'lib/api/external'
import { saveCart } from 'lib/api/sale'
import { mutate } from 'swr'
import { PaymentMethodTypes } from 'lib/types/sale'
import { useSetRegisterId } from 'lib/api/register'

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never

export const createSelectors = <S extends UseBoundStore<StoreApi<State>>>(_store: S) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }
  return store
}

export const errorHandler = (method: string, route: string) => (err: any) => {
  if (err.message === 'Not Found') {
    throw Error(`Error: You need to implement an API route for ${method} ${route}`)
  } else {
    throw Error(`${err.message} on ${method} ${route}`)
  }
}

const initState = {
  view: {},
  confirmModal: { open: false },
  alert: { open: false },
  cart: {
    sale: { id: null, customerId: null },
    customer: {},
    items: [],
    transactions: [],
    registerId: null,
  },
  receiveBasket: { vendorId: null, items: [] },
  sellPage: {
    searchBar: '',
    isSearching: false,
    bypassRegister: false,
    createableCustomerName: '',
  },
  ordersPage: {
    tab: 0,
  },
  stockPage: {
    searchBar: '',
    tab: 0,
  },
  vendorsPage: {
    searchBar: '',
  },
  paymentsPage: {},
  registersPage: {},
  salesListPage: {
    tab: 0,
    searchBar: '',
  },
  salesCalendarPage: {
    viewPeriod: 'day',
    rangeStartDate: dayjs().startOf('week').format('YYYY-MM-DD'),
    rangeEndDate: dayjs().format('YYYY-MM-DD'),
    clerkIds: [],
    viewLaybysOnly: false,
  },
  parkedSalesPage: {},
  laybysPage: {},
  holdsPage: {
    loadedHold: null,
  },
  saleStatsPage: {},
  giftCardsPage: {
    searchBar: '',
    loadedGiftCard: null,
  },
  logsPage: { tab: 0 },
  jobsPage: {
    tab: 0,
  },
  stocktakesPage: {},
}

export const useAppStore = createSelectors(
  create<StoreState>((set, get) => ({
    ...initState,
    openView: (view) =>
      set(
        produce((draft) => {
          draft.view[view] = true
        }),
      ),
    closeView: (view) =>
      set(
        produce((draft) => {
          draft.view[view] = false
        }),
      ),
    openConfirm: (confirm) =>
      set(
        produce((draft) => {
          draft.confirmModal = confirm
        }),
      ),
    closeConfirm: () =>
      set(
        produce((draft) => {
          draft.confirmModal = { open: false }
        }),
      ),
    setAlert: (alert) =>
      set(
        produce((draft) => {
          draft.alert = alert
        }),
      ),
    closeAlert: () =>
      set(
        produce((draft) => {
          draft.alert = null
        }),
      ),
    setCart: (update) =>
      set(
        produce((draft) => {
          Object.entries(update).forEach(([key, value]) => (draft.cart[key] = value))
        }),
      ),
    loadSaleToCart: (sale) => {
      console.log('LOAD SALE TO CART (NEEDS DOING)', sale)
      set(
        produce((draft) => {
          Object.entries(sale).forEach(([key, value]) => (draft.cart[key] = value))
        }),
      )
    },
    mutateCart: async (mutates = []) => {
      const newCart = await saveCart(get().cart, get().cart?.sale?.state)
      mutates.forEach((key) => mutate(key))
      console.log('new cart is', newCart)
      set(
        produce((draft) => {
          draft.cart = newCart
        }),
      )
    },
    addCartTransaction: (transaction) => {
      set(
        produce((draft) => {
          draft.cart.transactions.push(transaction)
        }),
      )
      const mutates = transaction?.paymentMethod === PaymentMethodTypes.GiftCard ? [`stock/giftcard`] : []
      get().mutateCart(mutates)
    },
    deleteCartTransaction: (transaction) => {
      set(
        produce((draft) => {
          console.log(get().cart.transactions)
          console.log(transaction?.id)
          const newTrans = get().cart.transactions.map((trans) =>
            trans?.id === transaction?.id ? { ...trans, isDeleted: true } : trans,
          )
          console.log(newTrans)
          draft.cart.transactions = newTrans
        }),
      )
      const mutates = transaction?.paymentMethod === PaymentMethodTypes.GiftCard ? [`stock/giftcard`] : []
      get().mutateCart(mutates)
    },
    addCartItem: (newItem, clerkId) =>
      set(
        produce((draft) => {
          if (get().cart.items.length === 0) {
            useSetWeatherToCart(get().setCartSale)
            useSetRegisterId(get().setCart)
            draft.cart.sale.dateSaleOpened = dayjs.utc().format()
            draft.cart.sale.saleOpenedBy = clerkId
          }
          draft.view.cart = true
          const index = get().cart.items.findIndex((cartItem) => cartItem?.itemId === newItem?.itemId)
          if (index < 0) draft.cart.items.push(newItem)
          else draft.cart.items[index].quantity = `${parseInt(get().cart.items[index].quantity) + 1}`
        }),
      ),
    setCartItem: (id, update) =>
      set(
        produce((draft) => {
          const index = get().cart.items.findIndex((cartItem) => cartItem?.itemId === id)
          draft.cart.items[index] = { ...get().cart.items[index], ...update }
        }),
      ),
    setCartSale: (update) =>
      set(
        produce((draft) => {
          Object.entries(update).forEach(([key, value]) => (draft.cart.sale[key] = value))
        }),
      ),
    setCustomer: (update) => {
      set(
        produce((draft) => {
          Object.entries(update).forEach(([key, value]) => (draft.cart.customer[key] = value))
          if (update?.id) draft.cart.sale.customerId = update?.id
        }),
      )
      get().mutateCart()
    },
    setReceiveBasket: (update) =>
      set(
        produce((draft) => {
          Object.entries(update).forEach(([key, value]) => (draft.receiveBasket[key] = value))
        }),
      ),
    addReceiveBasketItem: (newItem) =>
      set(
        produce((draft) => {
          draft.receiveBasket.items.push({ key: uuid(), item: newItem })
        }),
      ),
    updateReceiveBasketItem: (key, update) =>
      set(
        produce((draft) => {
          draft.receiveBasket.items.map((item) => (item?.key === key ? { ...item, ...update } : item))
        }),
      ),
    resetCart: () =>
      set(
        produce((draft) => {
          draft.cart = {
            sale: { id: null, customerId: null },
            customer: {},
            items: [],
            transactions: [],
          }
        }),
      ),
    resetReceiveBasket: () =>
      set(
        produce((draft) => {
          draft.receiveStock = { items: [] }
        }),
      ),
    resetCustomer: () =>
      set(
        produce((draft) => {
          draft.cart.customer = {}
        }),
      ),
    setSearchBar: (page, val) => {
      set(
        produce((draft) => {
          draft[page].searchBar = val
          page === Pages.sellPage ? (draft.sellPage.isSearching = true) : null
        }),
      )
    },
    setPage: (page, update) => {
      set(
        produce((draft) => {
          draft[page] = {
            ...get()[page],
            ...update,
          }
        }),
      )
    },
    togglePageOption: (page, option) => {
      set(
        produce((draft) => {
          draft[page][option] = !get()[page]?.[option]
        }),
      )
    },
    resetSearchBar: (page) => {
      set(
        produce((draft) => {
          draft[page].searchBar = ''
        }),
      )
    },
    resetPage: (page) => {
      set(
        produce((draft) => {
          draft[page] = initState[page]
        }),
      )
    },
  })),
)
