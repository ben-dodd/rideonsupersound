import create, { State, StoreApi, UseBoundStore } from 'zustand'
import dayjs from 'dayjs'
import produce from 'immer'
import request from 'superagent'
import { StoreState } from './types'
import ConfirmModal from 'components/modal/confirm-modal'

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
    cart: { id: null },
    loadedItemId: {},
    loadedVendorId: {},
    loadedHoldId: {},
    loadedSaleId: {},
    loadedStocktakeId: 0,
    loadedStocktakeTemplateId: 0,
    loadedCustomerObjectAtom: {},
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
    openView: (view) => set(produce((draft) => (draft.view[view] = true))),
    closeView: (view) => set(produce((draft) => (draft.view[view] = false))),
    openConfirm: (confirm) =>
      set(produce((draft) => (draft.confirmModal = confirm))),
    closeConfirm: () =>
      set(produce((draft) => (draft.confirmModal = { open: false }))),
    setAlert: (alert) => set(produce((draft) => (draft.alert = alert))),
    closeAlert: () => set(produce((draft) => (draft.alert = null))),
    toggleCompactMode: () =>
      set(produce((draft) => (draft.compactMode = !get().compactMode))),
    toggleTableMode: () =>
      set(produce((draft) => (draft.tableMode = !get().tableMode))),
    setLoadedStocktakeTemplateId: (id) =>
      set(produce((draft) => (draft.loadedStocktakeTemplateId = id))),
    setLoadedVendorId: (id) =>
      set(produce((draft) => (draft.loadedVendorId = id))),
  }))
)

// setStockItems: (stockItems) => set({ stock: stockItems }),
// addStockItems: (stockItems) =>
//   set(
//     produce((draft) => {
//       draft.stock.push(stockItems)
//     })
//   ),
// fetchStockItems: () => {
//   set({ loading: true })
//   request
//     .get(`/api/v1/stock`)
//     .then((res) => {
//       console.log('returned')
//       set({
//         stock: res.body.map((stock: any, i: number) => ({
//           ...stock,
//           ref: i,
//         })),
//       })
//       set({ loading: false })
//     })
//     .catch(errorHandler('GET', '/v1/stock'))
// },
// getSelection: () => {
//   const selection = []
//   const [topLeft, bottomRight] = getSelectionCorners(
//     get().active,
//     get().corner
//   )
//   for (let i = topLeft[0]; i <= bottomRight[0]; i++) {
//     const row = []
//     for (let j = topLeft[1]; j <= bottomRight[1]; j++) {
//       const prop: any = get().schema[j]
//       row.push(
//         prop.getValue
//           ? prop.getValue(get().stock[i])
//           : get().stock[i][prop.key]
//       )
//     }
//     selection.push(row)
//   }
//   return selection
// },
// getSelectionAsText: () => {
//   const text = get()
//     .getSelection()
//     .map((row) => row.join('\t'))
//     .join('\n')
//   console.log(text)
//   return text
// },
// setSchema: (schema) => {
//   set(
//     produce((draft) => {
//       draft.schema = schema
//     })
//   )
// },
// setCell: (cellRef, value) => {
//   set(
//     produce((draft) => {
//       const propName = draft.schema[cellRef[1]].key
//       draft.stock[cellRef[0]][propName] = value
//     })
//   )
// },
// setCellRange: (valueMatrix) => {
//   set(
//     produce((draft) => {
//       if (arraysAreEqual(draft.active, draft.corner)) {
//         // Single cell selected, extend valueMatrix from that point once
//         const maxRow = draft.stock.length - 1
//         const maxCol = draft.schema.length - 1
//         valueMatrix.forEach((row, i) => {
//           if (draft.active[0] + i <= maxRow) {
//             row.forEach((cell, j) => {
//               if (draft.active[1] + j <= maxCol) {
//                 const propName = draft.schema[draft.active[1] + j].key
//                 draft.stock[draft.active[0] + i][propName] = cell
//               }
//             })
//           }
//         })
//       } else {
//         // Multiple cells selected, repeat valuematrix within the selection
//         const [topLeft, bottomRight] = getSelectionCorners(
//           draft.active,
//           draft.corner
//         )
//         for (let i = topLeft[0]; i <= bottomRight[0]; i++) {
//           for (let j = topLeft[1]; j <= bottomRight[1]; j++) {
//             const propName = draft.schema[j].key
//             const value = getMatrixValue([i, j], topLeft, valueMatrix)
//             draft.stock[i][propName] = value
//           }
//         }
//       }
//     })
//   )
// },
// clearCellRange: () => {
//   set(
//     produce((draft) => {
//       const [topLeft, bottomRight] = getSelectionCorners(
//         draft.active,
//         draft.corner
//       )
//       for (let i = topLeft[0]; i <= bottomRight[0]; i++) {
//         for (let j = topLeft[1]; j <= bottomRight[1]; j++) {
//           const propName = draft.schema[j].key
//           draft.stock[i][propName] = ''
//         }
//       }
//     })
//   )
// },
// clickCell: (cellRef, shiftKey) =>
//   set(
//     produce((draft) => {
//       if (shiftKey) {
//         draft.corner = cellRef
//       } else {
//         draft.active = cellRef
//         draft.corner = cellRef
//       }
//     })
//   ),
// selectByDrag: (mouseoverCell) => {
//   set(
//     produce((draft) => {
//       draft.corner = mouseoverCell
//     })
//   )
// },
// selectByKeyboard: (evt) => {
//   console.log('Select by keyboard', evt)
//   set(
//     produce((draft) => {
//       if (evt.key === 'ArrowLeft' || (evt.key === 'Tab' && evt.shiftKey)) {
//         draft.corner[1] = draft.corner[1] === 0 ? 0 : draft.corner[1] - 1
//       } else if (
//         evt.key === 'ArrowRight' ||
//         (evt.key === 'Tab' && !evt.shiftKey)
//       ) {
//         const maxCol = draft.schema.length - 1
//         draft.corner[1] =
//           draft.corner[1] === maxCol ? maxCol : draft.corner[1] + 1
//       } else if (
//         evt.key === 'ArrowUp' ||
//         (evt.key === 'Enter' && evt.shiftKey)
//       ) {
//         draft.corner[0] = draft.corner[0] === 0 ? 0 : draft.corner[0] - 1
//       } else if (
//         evt.key === 'ArrowDown' ||
//         (evt.key === 'Enter' && !evt.shiftKey)
//       ) {
//         const maxRow = draft.stock.length - 1
//         draft.corner[0] =
//           draft.corner[0] === maxRow ? maxRow : draft.corner[0] + 1
//       }
//       if (!evt.shiftKey || evt.key === 'Enter' || evt.key === 'Tab') {
//         draft.active = draft.corner
//       }
//     })
//   )
// },
// clearSelection: () => {
//   set(
//     produce((draft) => {
//       draft.active = []
//       draft.corner = []
//     })
//   )
// },
// setInitialWidthRatios: (widthRatios) => {
//   set(
//     produce((draft) => {
//       draft.widthRatios = widthRatios
//     })
//   )
// },
// setWidthRatios: (index, widthOffset) => {
//   set(
//     produce((draft) => {
//       draft.widthRatios[index] = draft.widthRatios[index] + widthOffset
//       if (draft.widthRatios[index + 1])
//         draft.widthRatios[index + 1] =
//           draft.widthRatios[index + 1] - widthOffset
//     })
//   )
// },
