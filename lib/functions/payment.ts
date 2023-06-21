import dayjs, { extend } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { KiwiBankTransactionObject } from '../types/payment'
import { dollarsToCents } from 'lib/utils'
import { AccountPayment } from 'lib/types/vendor'

extend(utc)

interface KiwiBankBatchFileProps {
  transactions: KiwiBankTransactionObject[]
  batchNumber: string
  sequenceNumber: string
}

// This function writes a KBB file
export function writeKiwiBankBatchFile({ transactions, batchNumber, sequenceNumber }: KiwiBankBatchFileProps) {
  let validTransactions = getValidTransactions(transactions)
  let transactionAmount = getTotalTransactionAmount(validTransactions)
  let transactionCount = getTotalTransactionCount(validTransactions)
  let hashTotal = getHashTotal(validTransactions)
  let kbb = []
  kbb.push(writeKBBHeaderRecord({ batchNumber, sequenceNumber }))
  validTransactions.forEach((transaction: KiwiBankTransactionObject) => {
    kbb.push(writeKBBTransactionRecord({ transaction, batchNumber }))
  })
  kbb.push(writeKBBFooter({ transactionAmount, transactionCount, hashTotal }))
  return writeOutKBBFile(kbb)
}

function getValidTransactions(transactions) {
  return transactions.filter((transaction) => checkKiwibankTransactionIsValid(transaction))
}

function checkKiwibankTransactionIsValid(transaction) {
  return modulusCheck(transaction.accountNumber) && transaction.amount > 0
}

function getTotalTransactionAmount(transactions) {
  return transactions.reduce((sum, transaction) => sum + parseInt(transaction.amount), 0)
}

function getTotalTransactionCount(transactions) {
  return transactions.length
}

function getHashTotal(transactions) {
  let hashTotal = transactions.reduce(
    (sum, transaction) => sum + parseInt(`${transaction?.accountNumber}`.replace(/\D/g, '')?.slice(2, 13)),
    0,
  )
  return `00000000000${hashTotal}`.slice(-11)
}

function writeKBBHeaderRecord({ batchNumber, sequenceNumber }) {
  // Example: 1,,,,389016070450500,7,210216,210421,
  const storeAccountNumber = process.env.NEXT_PUBLIC_STORE_ACCOUNT_NUMBER
  return [
    1, // Record Type. 1 denotes the header. Max length 1
    '', // Auth Code. Blank for DC batches. Max length 7
    parseInt(batchNumber?.slice(0, 2)) || '', // Batch Number. Max length 2, optional
    parseInt(sequenceNumber?.slice(0, 4)) || '', // Batch Sequence Number. Max length 4, optional
    parseInt(storeAccountNumber?.slice(0, 16)), // Account Number to be debited. Max length 16.
    7, // Batch Type. Always 7 for DC batches. Max length 1.
    dayjs.utc().format('YYMMDD'), // Batch Due Date. YYMMDD. Max length 6. Valid date and not in the past. Can be up to 65 days in advance.
    dayjs.utc().format('YYMMDD'), // File Date. YYMMDD. Max length 6. Valid date and not in the future.
    '', // Indicator. Not used. Left blank.
  ]
}

function writeKBBTransactionRecord({ transaction, batchNumber }) {
  return [
    2, // Record Type. 2 denotes transaction record. Max length 1
    `${transaction?.accountNumber}`.replace(/\D/g, '')?.slice(0, 16), // Account number. Max 16 (numeric only). Must pass Modulus Test (modulusCheck).
    50, // Tran code. 50 for direct credits. Max length 2
    transaction?.amount, // Transaction amount in cents. Max length 12
    transaction?.name?.slice(0, 20), // Other party name. Payee name for DC. Max length 20.
    'RideOn Pay'.slice(0, 12), // Other part reference. Max length 12.
    `${transaction?.vendorId} ${transaction?.name}`?.slice(0, 12), // Other party code details. Max length. 12.
    '', // Other part alpha ref - Leave blank
    `Reg ${batchNumber}`?.slice(0, 12), // Other party particulars. Max length 12
    'Ride On Super Sound'.slice(0, 20), // This party name. Max length 20.
    `Reg ${batchNumber}`?.slice(0, 12), // This party code. Max length 12.
    `${transaction?.vendorId} ${transaction?.name}`?.slice(0, 12), // This party reference. Max length 12.
    `Seq ${dayjs.utc().format('YYMMDD')}`?.slice(0, 12), // This party particulars. Max length 12.
  ]
}

function writeKBBFooter({ transactionAmount, transactionCount, hashTotal }) {
  return [
    3, // 3 denotes the footer
    transactionAmount, // Transaction amount. Total of type 2 records in cents. Max length 12 (numeric)
    transactionCount, // Count of type 2 records. Max length 6 characters (numeric)
    hashTotal, // Hash total of type 2 records. Max length 11 characters (numeric)
  ]
}

function writeOutKBBFile(kbb) {
  return encodeURI(`data:text/csv;charset=utf-8,${kbb.map((rowArray) => `${rowArray.join(',')}`).join('\r\n')}`)
}

export function writePaymentNotificationEmail({ paymentList, includeUnchecked, includeNoBank }: any) {
  let csvContent = 'data:text/csv;charset=utf-8,'
  csvContent += 'CODE,NAME,RECIPIENT,ACCOUNT,OWING,LINK,DATE,CHECKED,VALID BANK NUM,STORE CREDIT ONLY\r\n'
  let vendorArrays = paymentList
    ?.filter((v) => (includeUnchecked || v?.isChecked) && (includeNoBank || v?.invalidBankAccountNumber))
    ?.map((v) => [
      v?.vendorId,
      v?.name,
      v?.email,
      v?.bankAccountNumber,
      v?.payAmount,
      `https://rideonsupersound.vercel.app/vendor/${v?.uid}`,
      dayjs().format('DD/MM/YYYY'),
      v?.isChecked,
      v?.invalidBankAccountNumber,
      Boolean(v?.storeCreditOnly),
    ])
  // console.log(vendorArrays);
  vendorArrays?.forEach((vendorArray) => {
    let row = vendorArray?.join(',')
    csvContent += row + '\r\n'
  })
  return encodeURI(csvContent)
}

export function splitAccountNumber(accountNumber) {
  let number = `${accountNumber}`?.replace(/\D/g, '')
  return {
    bank: number.slice(0, 2),
    branch: number.slice(2, 6),
    account: number.slice(6, 13),
    suffix: number.slice(13),
  }
}

export function modulusCheck(accountNumber) {
  // Get bank number, branch number, account number, and suffix
  let accountNumberObj = splitAccountNumber(accountNumber)
  const modulus11Banks = [
    '01',
    '02',
    '03',
    '06',
    '09',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '27',
    '30',
    '31',
    '34',
    '36',
    '38',
  ]
  if (accountNumberObj.bank === '08') {
    // Do Modulus 11B Checks
    return modulus11BCheck(accountNumberObj)
  } else if (accountNumberObj.bank === '25') {
    // Do Modulus 10A Checks
    return modulus10ACheck(accountNumberObj)
  } else if (accountNumberObj.bank === '09' && accountNumberObj.branch === '0000') {
    // Do Modulus 11D Checks
    return modulus11DCheck(accountNumberObj)
  } else if (
    parseInt(accountNumberObj.account) >= 990000 &&
    parseInt(accountNumberObj.account) <= 999999 &&
    modulus11Banks.includes(accountNumberObj.bank)
  ) {
    // Do Modulus 11C Checks
    return modulus11CCheck(accountNumberObj)
  } else if (modulus11Banks.includes(accountNumberObj.bank)) {
    // Do Modulus 11A Checks
    return modulus11ACheck(accountNumberObj)
  } else {
    return false
  }
}

function modulusNumCheck(weightings, checkDigits, modulus = 11) {
  let sum = weightings.reduce((summed, weighting, i) => summed + weighting * checkDigits[i], 0)
  return sum % modulus === 0
}

function modulus11ACheck(accountNumberObj) {
  // Format 11A
  //   (i) This format is used by bank numbers 01, 02, 03, 06, 09 (where branch number is not 0000), 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 27, 30, 31, 34, 36 and 38
  //   (ii) The account structure is:
  //    2 digit bank 4 digit branch 6 digit account 2 digit suffix
  //   (iii) The account check digits are performed over the four digits of the branch number and six digits of the account number
  //   (iv) The weightings for the calculation are from left to right: 6, 3, 7, 9, 10, 5, 8, 4, 2, 1
  //    The products are added together and the sum divided by 11. If the remainder is zero the account check digits, e.g.  Account Number 01-0902-0068389-00
  // (vi) Dividing by 11 gives 16 with a remainder of 0 (no remainder). Thus, the check digit is correct.
  let checkDigits = `${accountNumberObj.branch}${accountNumberObj.account.slice(1)}`
    .split('')
    .map((numStr) => parseInt(numStr))
  let weightings = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
  return modulusNumCheck(weightings, checkDigits)
}

function modulus11BCheck(accountNumberObj) {
  // Format 11B
  //   (i) This format is used by bank 08
  //   (ii) The account structure is:
  //    2 digit bank 4 digit branch 7 digit account 3 digit suffix
  //   (iii) The account check digits are performed over the seven digits of the account number only
  //   (iv) The weightings for the calculation are from left to right: 7, 6, 5, 4, 3, 2, 1
  //    The products are added together and the sum divided by 11. If the remainder is zero the account check digits, e.g.  Account Number 08-6523-1954512-001
  // (vi) Dividing by 11 gives 11 with a remainder of 0 (no remainder). Thus, the check digit is correct.
  let checkDigits = accountNumberObj.account.split('').map((numStr) => parseInt(numStr))
  let weightings = [7, 6, 5, 4, 3, 2, 1]
  return modulusNumCheck(weightings, checkDigits)
}

function modulus11CCheck(accountNumberObj) {
  // Format 11C
  // This format is used by bank numbers, 01, 02, 03, 06, 09 (where branch number is not 0000), 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 27, 30, 31, 34, 36 and 38 but only for accounts that fall within the range 990000 - 999999.
  //   (ii) The account structure is:
  //    2 digit bank 4 digit branch 6 digit account 2 digit suffix
  //   (iii) The account check digits are performed over the six digits of the account number only
  //   (iv) The weightings for the calculation are from left to right: 10, 5, 8, 4, 2, 1
  //    The products are added together and the sum divided by 11. If the remainder is zero the account check digits, e.g.  Account Number 01-0902-0998907-00
  // (vi) Dividing by 11 gives 22 with a remainder of 0 (no remainder). Thus, the check digit is correct.
  let checkDigits = accountNumberObj.account
    .slice(1)
    .split('')
    .map((numStr) => parseInt(numStr))
  let weightings = [10, 5, 8, 4, 2, 1]
  return modulusNumCheck(weightings, checkDigits)
}

function modulus11DCheck(accountNumberObj) {
  // Format 11C
  // This format is reserved for use by bank 09 where the branch number is 0000
  //   (ii) The account structure is:
  //    2 digit bank 4 digit branch 4 digit account 1 digit suffix
  //   (iii) The account check digits are performed over the four digits of the account and one digit of the suffix
  //   (iv) The weightings for the calculation are from left to right: 5, 4, 3, 2, 1
  //    The digits of each product are added together. This step is repeated for any result that has more than one digit. The results of these additions are added and the sum is divided by 11. If the remainder is zero the account check digits, e.g. Account Number: 09-0000-00007471-2
  // (vi) Dividing by 11 gives 2 with a remainder of 0 (no remainder). Thus, the check digit is correct.
  //  (vii) In addition to checking the account number it also necessary to check the serial number
  let checkDigits = `${accountNumberObj.account.slice(-3)}${accountNumberObj.suffix}`
    .split('')
    .map((numStr) => parseInt(numStr))
  let weightings = [5, 4, 3, 2, 1]
  let sum = weightings.reduce((summed, weighting, i) => {
    let product = weighting * checkDigits[i]
    // Add digits together
    product = (--product % 9) + 1
    return summed + product
  }, 0)
  return sum % 11 === 0
}

function modulus10ACheck(accountNumberObj) {
  // Format 10A
  // This format is used by bank 25
  //   (ii) The account structure is:
  //    2 digit bank 4 digit branch 7 digit account 3 digit suffix
  //   (iii) The account check digits are performed over the account number only
  //   (iv) The weightings for the calculation are from left to right: 1, 7, 3, 1, 7, 3, 1
  //    The products are added together and the sum divided by 10. If the remainder is zero the account check digits, e.g Account Number: 25-2500-2608486-001
  // (vi) Dividing by 10 gives 11 with a remainder of 0 (no remainder). Thus, the check digit is correct.
  let checkDigits = accountNumberObj.account.split('').map((numStr) => parseInt(numStr))
  let weightings = [1, 7, 3, 1, 7, 3, 1]
  return modulusNumCheck(weightings, checkDigits, 10)
}

export const checkDefaultChecked = (vendor) =>
  vendor?.id !== 666 &&
  modulusCheck(vendor?.bankAccountNumber) &&
  !vendor?.storeCreditOnly &&
  (vendor?.totalOwing >= 2000 ||
    (dayjs().diff(vendor?.lastPaid, 'month') >= 3 && vendor?.totalOwing > 0) ||
    (dayjs().diff(vendor?.lastSold, 'month') >= 3 && !vendor?.lastPaid && vendor?.totalOwing > 0))
    ? true
    : false

export const downloadKbbFile = (id, paymentList) => {
  let csvContent = writeKiwiBankBatchFile({
    transactions: paymentList
      ?.filter((p) => p?.isChecked)
      ?.map((payment: AccountPayment) => ({
        name: payment?.name || '',
        vendorId: `${payment?.vendorId || ''}`,
        accountNumber: payment?.bankAccountNumber || '',
        amount: dollarsToCents(payment?.payAmount),
      })),
    batchNumber: `${id}`,
    sequenceNumber: 'Batch',
  })
  downloadFile(csvContent, `batch-payment-${`00000${id}`.slice(-5)}-${dayjs().format('YYYY-MM-DD')}.kbb`)
}

export const downloadEmailList = (id, paymentList) => {
  console.log(paymentList)
  const { includeUnchecked = false, includeNoBank = false } = paymentList || {}
  let csvContent = writePaymentNotificationEmail({
    paymentList,
    includeUnchecked,
    includeNoBank,
  })
  downloadFile(csvContent, `batch-payment-email-list-${`00000${id}`.slice(-5)}-${dayjs().format('YYYY-MM-DD')}.csv`)
}

export const downloadFile = (fileContents, fileName) => {
  var link = document.createElement('a')
  link.setAttribute('href', fileContents)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
}
