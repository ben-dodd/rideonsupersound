import create, { State, StoreApi, UseBoundStore } from 'zustand'
import dayjs from 'dayjs'
import produce from 'immer'
import { Pages, StoreState } from './types'
import { v4 as uuid } from 'uuid'
import { useSetWeatherToCart } from 'lib/api/external'
import { saveCart } from 'lib/api/sale'
import { mutate } from 'swr'
import { PaymentMethodTypes, SaleStateTypes } from 'lib/types/sale'
import { useSetRegisterId } from 'lib/api/register'
import { axiosAuth } from 'lib/api'
import { mysql2js } from 'lib/database/utils/helpers'
import { BatchReceiveObject } from 'lib/types/stock'

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

const initCart = {
  sale: { id: null, customerId: null },
  customer: {},
  items: [],
  transactions: [],
  registerId: null,
}

export const initBatchReceiveSession = <BatchReceiveObject>{
  vendorId: null,
  batchList: [],
  dateCompleted: null,
  dateStarted: null,
  media: null,
  format: null,
  isNew: false,
  cond: null,
  section: null,
  country: null,
  doReorder: true,
  doListOnWebsite: true,
  genre: [],
  totalSell: '0',
  vendorCut: '0',
  defaultMargin: '25',
}

const initState = {
  view: {},
  confirmModal: { open: false },
  alert: { open: false },
  clippy: {
    visible: true,
    showMessage: false,
    image: 'default.png',
    message:
      'It looks like a customer is trying to buy an Adam Hattaway CD. Have you tried to sell them the Joe Sampson zine instead?',
    position: { x: 100, y: 100 },
    size: { height: 100, width: 100 },
  },
  createableCustomerName: '',
  cart: initCart,
  batchReceiveSession: initBatchReceiveSession,
  batchPaymentSession: { paymentList: [] },
  sellPage: {
    searchBar: '',
    isSearching: false,
    activeItemId: null,
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
    tab: 0,
  },
  paymentsPage: { tab: 0 },
  registersPage: {
    tab: 0,
  },
  salesPage: {
    tab: 0,
    returnToCartDialog: {},
  },
  salesListPage: {
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
  options: {
    doBypassRegister: false,
  },
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
    setCreateableCustomerName: (name) =>
      set(
        produce((draft) => {
          draft.createableCustomerName = name
        }),
      ),
    setCart: (update) => {
      set(
        produce((draft) => {
          Object.entries(update).forEach(([key, value]) => (draft.cart[key] = value))
        }),
      )
    },
    loadSaleToCartById: (saleId) => {
      return axiosAuth.get(`api/sale/${saleId}`).then((newCart) => {
        set(
          produce((draft) => {
            draft.cart = mysql2js(newCart)
          }),
        )
      })
    },
    loadSaleToCart: (newCart) => {
      const alert = { open: true, type: 'success', message: 'SALE LOADED' }
      const oldCart = get().cart
      if (oldCart?.items?.length > 0 && oldCart?.sale?.id !== newCart?.sale?.id) {
        saveCart({
          ...oldCart,
          sale: {
            ...oldCart?.sale,
            state: oldCart?.sale?.state === SaleStateTypes.InProgress ? SaleStateTypes.Parked : oldCart?.sale?.state,
          },
        })
        alert.type = 'warning'
        alert.message = 'SALE LOADED. PREVIOUS CART HAS BEEN PARKED.'
      }
      set(
        produce((draft) => {
          draft.cart = newCart
          draft.alert = alert
        }),
      )
    },
    mutateCart: async (mutates = []) => {
      await saveCart(get().cart)
      mutates.forEach((key) => mutate(key))
      // set(
      //   produce((draft) => {
      //     draft.cart = newCart
      //   }),
      // )
    },
    addCartTransaction: (transaction) => {
      set(
        produce((draft) => {
          draft.cart.transactions.push(transaction)
        }),
      )
      const mutates =
        transaction?.paymentMethod === PaymentMethodTypes.GiftCard
          ? [`stock/giftcard`]
          : transaction?.paymentMethod === PaymentMethodTypes.Account
          ? [`vendor/accounts`]
          : []
      get().mutateCart(mutates)
    },
    deleteCartTransaction: (transaction) => {
      set(
        produce((draft) => {
          const newTrans = get().cart.transactions.map((trans) =>
            trans?.id === transaction?.id ? { ...trans, isDeleted: true } : trans,
          )
          draft.cart.transactions = newTrans
        }),
      )
      const mutates = transaction?.paymentMethod === PaymentMethodTypes.GiftCard ? [`stock/giftcard`] : []
      get().mutateCart(mutates)
    },
    addCartItem: (newItem, clerkId, replacePrevious = false, alertMessage = 'ITEM ADDED') => {
      const alert = { open: true, type: 'success', message: alertMessage }
      if (replacePrevious) {
        const oldCart = get().cart
        if (oldCart?.items?.length > 0) {
          saveCart({
            ...oldCart,
            sale: {
              ...oldCart?.sale,
              state: oldCart?.sale?.state === SaleStateTypes.InProgress ? SaleStateTypes.Parked : oldCart?.sale?.state,
            },
          })
          alert.type = 'warning'
          alert.message = 'ITEM ADDED TO CART. PREVIOUS CART HAS BEEN PARKED.'
        }
      }
      set(
        produce((draft) => {
          if (replacePrevious)
            draft.cart = {
              sale: { id: null, customerId: null },
              customer: {},
              items: [],
              transactions: [],
            }
          if (get().cart.items.length === 0) {
            useSetWeatherToCart(get().setCartSale)
            useSetRegisterId(get().setCart)
            draft.cart.sale.dateSaleOpened = dayjs.utc().format()
            draft.cart.sale.saleOpenedBy = clerkId
            draft.cart.sale.state = SaleStateTypes.InProgress
          }
          draft.view.cart = true
          const index = get().cart.items.findIndex((cartItem) => cartItem?.itemId === newItem?.itemId)
          if (index < 0) draft.cart.items.push(newItem)
          else {
            const currItem = get().cart.items.find((cartItem) => cartItem?.itemId === newItem?.itemId)
            if (currItem?.isDeleted || currItem?.isRefunded) {
              // Item has been deleted or refunded, start fresh (refund will be disappeared)
              draft.cart.items[index] = newItem
            } else {
              // Add +1 quantity to item
              draft.cart.items[index].quantity = `${parseInt(get().cart.items[index].quantity) + 1}`
            }
          }
          draft.alert = alert
        }),
      )
    },
    setCartItem: (id, update) => {
      set(
        produce((draft) => {
          const index = get().cart.items.findIndex((cartItem) => cartItem?.itemId === id)
          draft.cart.items[index] = { ...get().cart.items[index], ...update }
        }),
      )
      get().cart?.sale?.id && get().mutateCart()
    },
    setCartSale: (update, doMutate = true) => {
      set(
        produce((draft) => {
          Object.entries(update).forEach(([key, value]) => (draft.cart.sale[key] = value))
        }),
      )
      doMutate && get().cart?.sale?.id && get().mutateCart()
    },
    setClippy: (update) => {
      console.log('Updating clippy', update)
      set(
        produce((draft) => {
          Object.entries(update).forEach(([key, value]) => (draft.clippy[key] = value))
        }),
      )
    },
    setBatchPaymentSession: (update) => {
      set(
        produce((draft) => {
          draft.batchPaymentSession = { ...get().batchPaymentSession, ...update }
        }),
      )
    },
    setBatchPaymentList: (list) => {
      set(
        produce((draft) => {
          draft.batchPaymentSession.paymentList = list
        }),
      )
    },
    setBatchAccountPayment: (vendorId, update) => {
      set(
        produce((draft) => {
          const index = get().batchPaymentSession.paymentList.findIndex((account) => account?.vendorId === vendorId)
          draft.batchPaymentSession.paymentList[index] = {
            ...get().batchPaymentSession.paymentList[index],
            ...update,
          }
        }),
      )
    },
    resetBatchPaymentSession: () => {
      set(
        produce((draft) => {
          draft.batchPaymentSession = { paymentList: [] }
        }),
      )
    },
    setCustomer: (update) => {
      set(
        produce((draft) => {
          Object.entries(update).forEach(([key, value]) => (draft.cart.customer[key] = value))
          if (update?.id) draft.cart.sale.customerId = update?.id
        }),
      )
    },
    setBatchReceiveSession: (update) =>
      set(
        produce((draft) => {
          Object.entries(update).forEach(([key, value]) => (draft.batchReceiveSession[key] = value))
        }),
      ),
    loadBatchReceiveSession: (session) =>
      set(
        produce((draft) => {
          draft.batchReceiveSession = session
        }),
      ),
    addBatchReceiveItem: (newItem) =>
      set(
        produce((draft) => {
          draft.batchReceiveSession?.batchList?.push({ key: uuid(), ...newItem })
        }),
      ),
    updateBatchReceiveItem: (key, update) =>
      set(
        produce((draft) => {
          const index = get().batchReceiveSession.batchList.findIndex((batchItem) => batchItem?.key === key)
          draft.batchReceiveSession.batchList[index] = {
            ...get().batchReceiveSession.batchList[index],
            ...update,
          }
        }),
      ),
    updateBatchReceiveItemField: (i, objName, fieldName, newValue) =>
      set(
        produce((draft) => {
          draft.batchReceiveSession.batchList[i][objName][fieldName] = newValue
        }),
      ),
    resetCart: () => {
      set(
        produce((draft) => {
          draft.cart = initCart
        }),
      )
    },
    resetBatchReceiveSession: () =>
      set(
        produce((draft) => {
          draft.receiveStock = initBatchReceiveSession
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
    setOption: (option, value) => {
      set(
        produce((draft) => {
          draft.options[option] = value
        }),
      )
    },
  })),
)
