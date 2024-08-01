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
import { BatchReceiveObject } from 'lib/types/stock'
import { arraysAreEqual, getMatrixValue, getSelectionCorners } from 'lib/functions/dataTable'
import { mysql2js } from 'lib/utils'

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
  id: null,
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
  viewMode: 'table',
  confirmModal: { open: false },
  infoModal: { open: false },
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
  pages: {
    sellPage: {
      searchBar: '',
      isSearching: false,
      activeItemId: null,
    },
    stockPage: {
      tab: 0,
      searchBar: { list: '', edit: '', receive: '', movement: '' },
      filter: {
        list: {
          sorting: [],
          pagination: {
            pageIndex: 0,
            pageSize: 20,
          },
          visibleColumns: {},
        },
        edit: {
          sorting: [],
          pagination: {
            pageIndex: 0,
            pageSize: 20,
          },
          visibleColumns: { genre: false, media: false },
        },
      },
    },
    vendorsPage: {
      tab: 0,
      searchBar: { list: '', my: '' },
    },
    salesPage: {
      tab: 0,
      returnToCartDialog: {},
      searchBar: {
        list: '',
        calendar: '',
        parked: '',
        layby: '',
        hold: '',
      },
      filter: {
        list: {},
        calendar: {
          viewPeriod: 'day',
          rangeStartDate: dayjs().startOf('week').format('YYYY-MM-DD'),
          rangeEndDate: dayjs().format('YYYY-MM-DD'),
          clerkIds: [],
          viewLaybysOnly: false,
        },
        parked: {},
        layby: {},
        hold: {},
      },
      loadedHold: null,
    },
    laybysPage: {},
    holdsPage: {
      loadedHold: null,
    },
    paymentsPage: { tab: 0 },
    ordersPage: {
      tab: 0,
    },
    registersPage: {
      tab: 0,
    },
    giftCardsPage: {
      searchBar: '',
      loadedGiftCard: null,
    },
    jobsPage: {
      tab: 0,
    },
    clerksPage: {},
    logsPage: { tab: 0 },
    stocktakesPage: {},
  },
  options: {
    doBypassRegister: false,
  },
  dataTable: {
    data: [],
    schema: [],
    active: [],
    corner: [],
    widthRatios: [],
    loading: false,
    error: '',
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
    setViewMode: (mode) =>
      set(
        produce((draft) => {
          draft.viewMode = mode
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
    openInfo: (info) =>
      set(
        produce((draft) => {
          draft.infoModal = info
        }),
      ),
    closeInfo: () =>
      set(
        produce((draft) => {
          draft.infoModal = { open: false }
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
      return axiosAuth.get(`api/sale/${saleId}`).then((newCart) => get().loadSaleToCart(mysql2js(newCart)))
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
      const newCart = await saveCart(get().cart)
      get().setCart(newCart)
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
          // console.log(draft.batchReceiveSession)
          // console.log(update)
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
          console.log('Resetting batch receive')
          draft.receiveStock = initBatchReceiveSession
        }),
      ),
    resetCustomer: () =>
      set(
        produce((draft) => {
          draft.cart.customer = {}
        }),
      ),
    setSearchBar: (page, val, tab) => {
      set(
        produce((draft) => {
          tab ? (draft.pages[page].searchBar[tab] = val) : (draft.pages[page].searchBar = val)
          page === Pages.sellPage ? (draft.pages.sellPage.isSearching = true) : null
        }),
      )
    },
    setPageFilter: (page, update, tab) => {
      console.log('setting filter', page, update, tab)
      set(
        produce((draft) => {
          const filter = tab
            ? { ...get()?.pages?.[page]?.filter?.[tab], ...update }
            : { ...get()?.pages?.[page]?.filter, ...update }
          console.log(filter)
          if (tab) draft.pages[page].filter[tab] = filter
          else draft.pages[page].filter = filter
        }),
      )
    },
    setPage: (page, update) => {
      set(
        produce((draft) => {
          draft.pages[page] = {
            ...get()?.pages?.[page],
            ...update,
          }
        }),
      )
    },
    resetSearchBar: (page) => {
      set(
        produce((draft) => {
          draft.pages[page].searchBar = ''
        }),
      )
    },
    resetPage: (page) => {
      set(
        produce((draft) => {
          draft.pages[page] = initState[page]
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
    dataTable: {
      data: [],
      active: [],
      corner: [],
      schema: [],
      widthRatios: [],
      loading: false,
      error: '',
    },
    dtSetData: (data) => {
      set(
        produce((draft) => {
          draft.dataTable.data = data
        }),
      )
    },
    dtGetSelection: () => {
      const selection = []
      const [topLeft, bottomRight] = getSelectionCorners(get().dataTable.active, get().dataTable.corner)
      for (let i = topLeft[0]; i <= bottomRight[0]; i++) {
        const row = []
        for (let j = topLeft[1]; j <= bottomRight[1]; j++) {
          const prop: any = get().dataTable.schema[j]
          row.push(prop.getValue ? prop.getValue(get().dataTable.data[i]) : get().dataTable.data[i][prop.key])
        }
        selection.push(row)
      }
      return selection
    },
    dtGetSelectionAsText: () => {
      const text = get()
        .dtGetSelection()
        .map((row) => row.join('\t'))
        .join('\n')
      console.log(text)
      return text
    },
    dtSetSchema: (schema) => {
      set(
        produce((draft) => {
          draft.dataTable.schema = schema
        }),
      )
    },
    dtSetCell: (cellRef, value) => {
      set(
        produce((draft) => {
          console.log(cellRef)
          console.log(get().dataTable.schema)
          console.log(get().dataTable.schema[cellRef[1]])
          const propName = draft.dataTable.schema[cellRef[1]].key
          draft.dataTable.data[cellRef[0]][propName] = value
        }),
      )
    },
    dtSetCellRange: (valueMatrix) => {
      set(
        produce((draft) => {
          if (arraysAreEqual(draft.dataTable.active, draft.dataTable.corner)) {
            // Single cell selected, extend valueMatrix from that point once
            const maxRow = draft.dataTable.data.length - 1
            const maxCol = draft.dataTable.schema.length - 1
            valueMatrix.forEach((row, i) => {
              if (draft.dataTable.active[0] + i <= maxRow) {
                row.forEach((cell, j) => {
                  if (draft.dataTable.active[1] + j <= maxCol) {
                    const propName = draft.dataTable.schema[draft.dataTable.active[1] + j].key
                    draft.dataTable.data[draft.dataTable.active[0] + i][propName] = cell
                  }
                })
              }
            })
          } else {
            // Multiple cells selected, repeat valuematrix within the selection
            const [topLeft, bottomRight] = getSelectionCorners(draft.dataTable.active, draft.dataTable.corner)
            for (let i = topLeft[0]; i <= bottomRight[0]; i++) {
              for (let j = topLeft[1]; j <= bottomRight[1]; j++) {
                const propName = draft.dataTable.schema[j].key
                const value = getMatrixValue([i, j], topLeft, valueMatrix)
                draft.dataTable.data[i][propName] = value
              }
            }
          }
        }),
      )
    },
    dtClearCellRange: () => {
      set(
        produce((draft) => {
          const [topLeft, bottomRight] = getSelectionCorners(draft.dataTable.active, draft.dataTable.corner)
          for (let i = topLeft[0]; i <= bottomRight[0]; i++) {
            for (let j = topLeft[1]; j <= bottomRight[1]; j++) {
              const propName = draft.dataTable.schema[j].key
              draft.dataTable.data[i][propName] = ''
            }
          }
        }),
      )
    },
    dtClickCell: (cellRef, shiftKey) =>
      set(
        produce((draft) => {
          if (shiftKey) {
            draft.dataTable.corner = cellRef
          } else {
            draft.dataTable.active = cellRef
            draft.dataTable.corner = cellRef
          }
        }),
      ),
    dtSelectByDrag: (mouseoverCell) => {
      set(
        produce((draft) => {
          draft.dataTable.corner = mouseoverCell
        }),
      )
    },
    dtSelectByKeyboard: (evt) => {
      console.log('Select by keyboard', evt)
      set(
        produce((draft) => {
          if (evt.key === 'ArrowLeft' || (evt.key === 'Tab' && evt.shiftKey)) {
            draft.dataTable.corner[1] = draft.dataTable.corner[1] === 0 ? 0 : draft.dataTable.corner[1] - 1
          } else if (evt.key === 'ArrowRight' || (evt.key === 'Tab' && !evt.shiftKey)) {
            const maxCol = draft.dataTable.schema.length - 1
            draft.dataTable.corner[1] = draft.dataTable.corner[1] === maxCol ? maxCol : draft.dataTable.corner[1] + 1
          } else if (evt.key === 'ArrowUp' || (evt.key === 'Enter' && evt.shiftKey)) {
            draft.dataTable.corner[0] = draft.dataTable.corner[0] === 0 ? 0 : draft.dataTable.corner[0] - 1
          } else if (evt.key === 'ArrowDown' || (evt.key === 'Enter' && !evt.shiftKey)) {
            const maxRow = draft.dataTable.data.length - 1
            draft.dataTable.corner[0] = draft.dataTable.corner[0] === maxRow ? maxRow : draft.dataTable.corner[0] + 1
          }
          if (!evt.shiftKey || evt.key === 'Enter' || evt.key === 'Tab') {
            draft.dataTable.active = draft.dataTable.corner
          }
        }),
      )
    },
    dtClearSelection: () => {
      set(
        produce((draft) => {
          draft.dataTable.active = []
          draft.dataTable.corner = []
        }),
      )
    },
    dtSetInitialWidthRatios: (widthRatios) => {
      set(
        produce((draft) => {
          draft.dataTable.widthRatios = widthRatios
        }),
      )
    },
    dtSetWidthRatios: (index, widthOffset) => {
      set(
        produce((draft) => {
          draft.dataTable.widthRatios[index] = draft.dataTable.widthRatios[index] + widthOffset
          if (draft.dataTable.widthRatios[index + 1])
            draft.dataTable.widthRatios[index + 1] = draft.dataTable.widthRatios[index + 1] - widthOffset
        }),
      )
    },
  })),
)
