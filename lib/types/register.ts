export interface RegisterObject {
  id?: number
  openedById?: number
  openDate?: string
  openAmount?: number
  openNote?: string
  openTillId?: number
  closedById?: number
  closeDate?: string
  closeTillId?: number
  closeAmount?: number
  closePettyBalance?: number
  closeCashGiven?: number
  closeManualPayments?: number
  closeExpectedAmount?: number
  closeDiscrepancy?: number
  closeNote?: string
}

export interface TillObject {
  id?: number
  oneHundredDollar?: number
  fiftyDollar?: number
  twentyDollar?: number
  tenDollar?: number
  fiveDollar?: number
  twoDollar?: number
  oneDollar?: number
  fiftyCent?: number
  twentyCent?: number
  tenCent?: number
}
