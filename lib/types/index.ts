/* eslint-disable unused-imports/no-unused-vars */

export enum ButtonTypes {
  Ok = 'ok',
  Cancel = 'cancel',
}

export enum RoleTypes {
  CO = 'Communication Officer',
  RC = 'Record Chief',
  PMC = 'Printed Matter Captain',
  VLG = 'Vendor Liaison General',
  MC = 'Mailorder Czar',
  CL = 'Cash Lord',
  PM = 'Pay Master',
  DW = 'Data Wrangler',
  RS = 'Retail Samurai',
}

export interface ClerkObject {
  id: number
  name?: string
  colour?: number
  password?: string
  fullName?: string
  email?: string
  phone?: string
  imageId?: number
  note?: string
  isAdmin?: number
  isCurrent?: number
  dateCreated?: string
  dateModified?: string
  isDeleted?: number
}
export interface CustomerObject {
  id?: number
  name?: string
  email?: string
  phone?: string
  postalAddress?: string
  note?: string
  createdByClerkId?: number
  isDeleted?: boolean
}

export interface ConfirmModal {
  open: boolean
  onClose?: Function
  title?: string
  message?: string
  styledMessage?: any
  action?: Function
  altAction?: Function
  yesText?: string
  altText?: string
  noText?: string
  yesButtonOnly?: boolean
  buttons?: ModalButton[]
}

export interface LogObject {
  id?: number
  log: string
  clerkId?: number
  clerkName?: string
  tableId?: string
  rowId?: number
  dateCreated?: string
  isDeleted?: boolean
}

export interface TaskObject {
  id?: number
  description?: string
  dateCreated?: string
  createdByClerkId?: number
  assignedTo?: string
  assignedToClerkId?: number
  isCompleted?: boolean
  isPriority?: boolean
  dateCompleted?: string
  completedByClerkId?: number
  isPostMailOrder?: boolean
  isDeleted?: boolean
}

export interface ModalButton {
  type?: string
  onClick?: Function
  text?: string
  disabled?: boolean
  loading?: boolean
  hidden?: boolean
  data?: any[]
  headers?: string[]
  fileName?: string
}

export interface AlertProps {
  open: boolean
  type?: 'error' | 'info' | 'success' | 'warning'
  message?: string
  undo?: Function
}

export interface ClippyProps {
  visible: boolean
  showMessage: boolean
  image: string
  message: string
  options?: any[]
  position: {
    x: number
    y: number
  }
  size: {
    height: number
    width: number
  }
}

export const bgDark = [
  'bg-col1-dark',
  'bg-col2-dark',
  'bg-col3-dark',
  'bg-col4-dark',
  'bg-col5-dark',
  'bg-col6-dark',
  'bg-col7-dark',
  'bg-col8-dark',
  'bg-col9-dark',
  'bg-col10-dark',
]

export const bg = [
  'bg-col1',
  'bg-col2',
  'bg-col3',
  'bg-col4',
  'bg-col5',
  'bg-col6',
  'bg-col7',
  'bg-col8',
  'bg-col9',
  'bg-col10',
]

export const bgLight = [
  'bg-col1-light',
  'bg-col2-light',
  'bg-col3-light',
  'bg-col4-light',
  'bg-col5-light',
  'bg-col6-light',
  'bg-col7-light',
  'bg-col8-light',
  'bg-col9-light',
  'bg-col10-light',
]
